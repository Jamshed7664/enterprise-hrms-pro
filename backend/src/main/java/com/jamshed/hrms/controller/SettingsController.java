package com.jamshed.hrms.controller;
import com.jamshed.hrms.entity.*;import com.jamshed.hrms.repository.*;import com.jamshed.hrms.service.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
@RestController @RequestMapping("/api/settings") public class SettingsController {
 private final CompanyPreferenceRepository companies;private final UserPreferenceRepository prefs;private final AccessService access;private final AuditService audit;
 public SettingsController(CompanyPreferenceRepository companies,UserPreferenceRepository prefs,AccessService access,AuditService audit){this.companies=companies;this.prefs=prefs;this.access=access;this.audit=audit;}
 @GetMapping("/company") public CompanyPreference company(){return companies.findById(1L).orElse(CompanyPreference.builder().id(1L).companyName("Enterprise HRMS").workspace("HR Workspace").timezone("Asia/Kolkata").locale("English (India)").build());}
 @PutMapping("/company") public CompanyPreference company(@AuthenticationPrincipal Jwt jwt,@RequestBody CompanyPreference input){AppUser u=access.current(jwt);if(!access.privileged(u))throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN);if(input.getCompanyName()==null || input.getCompanyName().isBlank())throw new com.jamshed.hrms.exception.BusinessException("Company name is required");input.setId(1L);audit.record(u.getEmail(),"SETTINGS","UPDATE_COMPANY",input.getCompanyName());return companies.save(input);}
 @GetMapping("/notifications") public UserPreference notifications(@AuthenticationPrincipal Jwt jwt){Long id=access.current(jwt).getId();return prefs.findById(id).orElse(UserPreference.builder().id(id).leaveAlerts(true).attendanceAlerts(true).recruitmentAlerts(true).build());}
 @PutMapping("/notifications") public UserPreference notifications(@AuthenticationPrincipal Jwt jwt,@RequestBody UserPreference request){Long id=access.current(jwt).getId();request.setId(id);return prefs.save(request);}
}
