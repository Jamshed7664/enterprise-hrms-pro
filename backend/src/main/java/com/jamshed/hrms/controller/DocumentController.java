package com.jamshed.hrms.controller;
import com.jamshed.hrms.entity.*;import com.jamshed.hrms.exception.*;import com.jamshed.hrms.repository.*;import com.jamshed.hrms.service.*;
import org.springframework.beans.factory.annotation.Value;import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;import org.springframework.web.multipart.MultipartFile;
import java.io.*;import java.nio.file.*;import java.time.*;import java.util.*;
@RestController @RequestMapping("/api/documents") public class DocumentController {
 private final DocumentRecordRepository docs;private final EmployeeRepository employees;private final AccessService access;private final AuditService audit;
 @Value("${app.upload-dir}") String uploadDir;
 public DocumentController(DocumentRecordRepository docs, EmployeeRepository employees, AccessService access,AuditService audit){this.docs=docs;this.employees=employees;this.access=access;this.audit=audit;}
 public record DocDto(Long id,String name,String employee,String category,LocalDate expiry,String status,Long employeeId){}
 private DocDto dto(DocumentRecord d){long remaining=d.getExpiry()==null?Long.MAX_VALUE:java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(),d.getExpiry());return new DocDto(d.getId(),d.getName(),d.getEmployee().getFirstName()+" "+d.getEmployee().getLastName(),d.getCategory(),d.getExpiry(),remaining<0?"Expired":remaining<=30?"Expiring":"Valid",d.getEmployee().getId());}
 @GetMapping public List<DocDto> all(@AuthenticationPrincipal Jwt jwt){AppUser u=access.current(jwt);return docs.findAll().stream().filter(d->access.privileged(u) || (u.getEmployee()!=null && u.getEmployee().getId().equals(d.getEmployee().getId()))).map(this::dto).toList();}
 @PostMapping(consumes=MediaType.MULTIPART_FORM_DATA_VALUE) public DocDto add(@RequestParam Long employeeId,@RequestParam(defaultValue="Other") String category,@RequestParam(required=false) @org.springframework.format.annotation.DateTimeFormat(iso=org.springframework.format.annotation.DateTimeFormat.ISO.DATE) LocalDate expiry,@RequestPart("file") MultipartFile file,@AuthenticationPrincipal Jwt jwt) throws IOException {
     Employee employee=employees.findById(employeeId).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
     String extension=FileValidation.extension(file);
     String stored=UUID.randomUUID()+extension; Path directory=Paths.get(uploadDir,"documents").toAbsolutePath().normalize();Files.createDirectories(directory);
     Path target=directory.resolve(stored);try(InputStream in=file.getInputStream()){Files.copy(in,target);}
     DocumentRecord d=docs.save(DocumentRecord.builder().employee(employee).name(Paths.get(Objects.requireNonNullElse(file.getOriginalFilename(),"document")).getFileName().toString()).type(file.getContentType()).category(category).expiry(expiry).fileUrl(stored).uploadedAt(LocalDateTime.now()).build());
     audit.record(jwt.getClaimAsString("email"),"DOCUMENTS","UPLOAD",d.getName());return dto(d);
 }
 private DocumentRecord doc(Long id, Jwt jwt){DocumentRecord d=docs.findById(id).orElseThrow(()->new ResourceNotFoundException("Document not found"));access.canProfile(jwt,d.getEmployee().getId());return d;}
 @GetMapping("/{id}/download") public ResponseEntity<byte[]> download(@PathVariable Long id,@AuthenticationPrincipal Jwt jwt)throws IOException{DocumentRecord d=doc(id,jwt);Path dir=Paths.get(uploadDir,"documents").toAbsolutePath().normalize();Path file=dir.resolve(d.getFileUrl()).normalize();if(!file.startsWith(dir) || !Files.isRegularFile(file))throw new ResourceNotFoundException("File not found");return ResponseEntity.ok().contentType(MediaType.parseMediaType(d.getType()==null?"application/octet-stream":d.getType())).header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename*=UTF-8''"+java.net.URLEncoder.encode(d.getName(),java.nio.charset.StandardCharsets.UTF_8)).body(Files.readAllBytes(file));}
 @DeleteMapping("/{id}") public void remove(@PathVariable Long id,@AuthenticationPrincipal Jwt jwt)throws IOException{DocumentRecord d=doc(id,jwt);docs.delete(d);Files.deleteIfExists(Paths.get(uploadDir,"documents",d.getFileUrl()).toAbsolutePath().normalize());audit.record(jwt.getClaimAsString("email"),"DOCUMENTS","DELETE",d.getName());}
}
