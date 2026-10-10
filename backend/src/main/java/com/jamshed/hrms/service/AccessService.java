package com.jamshed.hrms.service;
import com.jamshed.hrms.entity.AppUser;
import com.jamshed.hrms.repository.AppUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
@Service public class AccessService {
 private final AppUserRepository users;
 public AccessService(AppUserRepository users){this.users=users;}
 public AppUser current(Jwt jwt) {
   if(jwt==null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
   AppUser u=users.findById(Long.valueOf(jwt.getSubject())).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));
   if(!u.isEnabled() || !u.getRole().equals(jwt.getClaimAsString("role"))) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Session is no longer valid");
   return u;
 }
 public boolean privileged(AppUser user){return "ADMIN".equals(user.getRole()) || "HR_MANAGER".equals(user.getRole());}
 public void canProfile(Jwt jwt,Long id){AppUser u=current(jwt);
   if(!privileged(u) && (u.getEmployee()==null || !id.equals(u.getEmployee().getId()))) throw new ResponseStatusException(HttpStatus.FORBIDDEN,"Not allowed to access this employee");
 }
}
