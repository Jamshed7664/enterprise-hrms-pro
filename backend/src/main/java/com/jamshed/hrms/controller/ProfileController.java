package com.jamshed.hrms.controller;
import com.jamshed.hrms.dto.EmployeeRequest;import com.jamshed.hrms.entity.*;
import com.jamshed.hrms.exception.*;import com.jamshed.hrms.service.*;
import org.springframework.beans.factory.annotation.Value;import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;import java.io.*;import java.util.*;
@RestController @RequestMapping("/api/profile") public class ProfileController {
 private final EmployeeService employees;private final AccessService access;
 @Value("${app.upload-dir}") String dir;
 public ProfileController(EmployeeService employees,AccessService access){this.employees=employees;this.access=access;}
 @GetMapping("/{id}") public Employee get(@PathVariable Long id,@AuthenticationPrincipal Jwt jwt){access.canProfile(jwt,id);return employees.one(id);}
 @PutMapping("/{id}") public Employee update(@PathVariable Long id,@RequestBody EmployeeRequest r,@AuthenticationPrincipal Jwt jwt){
    access.canProfile(jwt,id);
    AppUser user=access.current(jwt);
    if(access.privileged(user))return employees.update(id,r);
    Employee emp=employees.one(id);emp.setPhone(r.phone());emp.setAddress(r.address());emp.setLocation(r.location());return employees.saveProfile(emp);
 }
 @PostMapping(value="/{id}/image", consumes=MediaType.MULTIPART_FORM_DATA_VALUE) public Employee image(@PathVariable Long id,@RequestPart("file") MultipartFile file,@AuthenticationPrincipal Jwt jwt)throws IOException{
    access.canProfile(jwt,id);String ext=FileValidation.extension(file);if(!List.of(".jpg",".png").contains(ext))throw new BusinessException("Profile image must be JPEG or PNG");
    String name=UUID.randomUUID()+ext;Path directory=Paths.get(dir,"profiles").toAbsolutePath().normalize();Files.createDirectories(directory);
    try(InputStream in=file.getInputStream()){Files.copy(in,directory.resolve(name));}
    return employees.setProfileImage(id,"/api/profile/"+id+"/image-file",name);
 }
 @GetMapping("/{id}/image-file") public ResponseEntity<byte[]> imageFile(@PathVariable Long id,@AuthenticationPrincipal Jwt jwt)throws IOException{
    access.canProfile(jwt,id);
    Path directory=Paths.get(dir,"profiles").toAbsolutePath().normalize();
    if(!Files.isDirectory(directory))throw new ResourceNotFoundException("Image not found");
    // Associate filename via stored record rather than enumerate unpredictable images.
    Employee e=employees.one(id);String imageName=e.getProfileImageName();
    if(imageName==null)throw new ResourceNotFoundException("Image not found");
    Path file=directory.resolve(imageName).normalize();if(!file.startsWith(directory)||!Files.isRegularFile(file))throw new ResourceNotFoundException("Image not found");
    return ResponseEntity.ok().contentType(imageName.endsWith(".png")?MediaType.IMAGE_PNG:MediaType.IMAGE_JPEG).body(Files.readAllBytes(file));
 }
}
