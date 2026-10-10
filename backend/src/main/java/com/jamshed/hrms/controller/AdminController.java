package com.jamshed.hrms.controller;
import com.jamshed.hrms.entity.*;import com.jamshed.hrms.repository.*;import com.jamshed.hrms.service.*;
import com.jamshed.hrms.exception.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/admin") public class AdminController {
 private final AppUserRepository users;private final EmployeeRepository employees;private final ApprovalRuleRepository rules;private final AuditEntryRepository logs;private final PasswordEncoder encoder;private final AuditService audit;
 public AdminController(AppUserRepository users,EmployeeRepository employees,ApprovalRuleRepository rules,AuditEntryRepository logs,PasswordEncoder encoder,AuditService audit){this.users=users;this.employees=employees;this.rules=rules;this.logs=logs;this.encoder=encoder;this.audit=audit;}
 public record UserDto(Long id,String email,String role,boolean enabled,Long employeeId){}
 public record UserRequest(String email,String password,String role,Long employeeId){}
 private UserDto dto(AppUser u){return new UserDto(u.getId(),u.getEmail(),u.getRole(),u.isEnabled(),u.getEmployee()==null?null:u.getEmployee().getId());}
 @GetMapping("/users") public List<UserDto> all(){return users.findAll().stream().map(this::dto).toList();}
 @PostMapping("/users") public UserDto add(@RequestBody UserRequest request,@AuthenticationPrincipal Jwt jwt){
     if(request.email()==null || !request.email().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$") || request.password()==null || request.password().length()<12)throw new BusinessException("Valid email and password of at least 12 characters required");
     if(!List.of("ADMIN","HR_MANAGER","EMPLOYEE").contains(request.role()))throw new BusinessException("Unsupported role");
     if(users.findByEmail(request.email()).isPresent())throw new BusinessException("This email already has a login account");
     Employee e=request.employeeId()==null?null:employees.findById(request.employeeId()).orElseThrow(()->new ResourceNotFoundException("Employee not found"));
     AppUser u=users.save(AppUser.builder().email(request.email()).passwordHash(encoder.encode(request.password())).role(request.role()).enabled(true).employee(e).build());
     audit.record(jwt.getClaimAsString("email"),"ADMIN","CREATE_USER",u.getEmail());return dto(u);
 }
 @PatchMapping("/users/{id}") public UserDto change(@PathVariable Long id,@RequestBody Map<String,Object> changes,@AuthenticationPrincipal Jwt jwt){
     AppUser u=users.findById(id).orElseThrow(()->new ResourceNotFoundException("User not found"));
     if(id.toString().equals(jwt.getSubject()))throw new BusinessException("Cannot change your own admin role/status here");
     if(changes.containsKey("role")){String role=String.valueOf(changes.get("role"));if(!List.of("ADMIN","HR_MANAGER","EMPLOYEE").contains(role))throw new BusinessException("Unsupported role");u.setRole(role);}
     if(changes.containsKey("enabled"))u.setEnabled(Boolean.TRUE.equals(changes.get("enabled")));
     if(changes.containsKey("password")){String pwd=String.valueOf(changes.get("password"));if(pwd.length()<12)throw new BusinessException("Password requires 12+ characters");u.setPasswordHash(encoder.encode(pwd));u.setTokenVersion(u.getTokenVersion()+1);}
     audit.record(jwt.getClaimAsString("email"),"ADMIN","UPDATE_USER",u.getEmail());return dto(users.save(u));
 }
 @GetMapping("/rules") public List<ApprovalRule> rules(){if(rules.count()==0){rules.saveAll(List.of(ApprovalRule.builder().name("Leave approval").flow("Manager → HR").enabled(true).build(),ApprovalRule.builder().name("Attendance correction").flow("Manager approval").enabled(true).build(),ApprovalRule.builder().name("Timesheet approval").flow("Reporting manager").enabled(true).build()));}return rules.findAll();}
 @PutMapping("/rules/{id}") public ApprovalRule rule(@PathVariable Long id,@RequestBody Map<String,Boolean> body,@AuthenticationPrincipal Jwt jwt){ApprovalRule r=rules.findById(id).orElseThrow(()->new ResourceNotFoundException("Rule not found"));r.setEnabled(Boolean.TRUE.equals(body.get("enabled")));audit.record(jwt.getClaimAsString("email"),"ADMIN","UPDATE_RULE",r.getName());return rules.save(r);}
 @GetMapping("/audit") public List<AuditEntry> audit(){List<AuditEntry> all=logs.findAll();Collections.reverse(all);return all.stream().limit(100).toList();}
}
