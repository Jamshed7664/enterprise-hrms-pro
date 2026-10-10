package com.jamshed.hrms.controller;
import com.jamshed.hrms.entity.Payroll;import com.jamshed.hrms.exception.*;import com.jamshed.hrms.repository.PayrollRepository;import com.jamshed.hrms.service.AuditService;
import org.springframework.http.*;import org.springframework.security.core.annotation.AuthenticationPrincipal;import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;import java.nio.charset.StandardCharsets;import java.util.*;
@RestController @RequestMapping("/api/payroll") public class PayrollController {
 private final PayrollRepository repo;private final AuditService audit;
 public PayrollController(PayrollRepository repo,AuditService audit){this.repo=repo;this.audit=audit;}
 @GetMapping public List<Payroll> all(){return repo.findAll();}
 @PatchMapping("/{id}/pay") public Payroll markPaid(@PathVariable Long id,@AuthenticationPrincipal Jwt jwt){Payroll p=repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Payroll record not found"));p.setStatus("PAID");p.setPaidOn(LocalDate.now());audit.record(jwt.getClaimAsString("email"),"PAYROLL","MARK_PAID","Payroll #"+id);return repo.save(p);}
 @GetMapping("/{id}/payslip") public ResponseEntity<byte[]> payslip(@PathVariable Long id){Payroll p=repo.findById(id).orElseThrow(()->new ResourceNotFoundException("Payroll record not found"));String csv="Item,Value\nEmployee,"+p.getEmployee().getFirstName()+" "+p.getEmployee().getLastName()+"\nMonth,"+p.getMonth()+"\nBasic,"+p.getBasicSalary()+"\nAllowances,"+p.getAllowances()+"\nDeductions,"+p.getDeductions()+"\nNet,"+p.getNetSalary()+"\nStatus,"+p.getStatus()+"\n";return ResponseEntity.ok().contentType(MediaType.parseMediaType("text/csv")).header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=payslip-"+id+".csv").body(csv.getBytes(StandardCharsets.UTF_8));}
}
