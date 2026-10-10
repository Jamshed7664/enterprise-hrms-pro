package com.jamshed.hrms.controller;

import com.jamshed.hrms.dto.*;
import com.jamshed.hrms.entity.AppUser;
import com.jamshed.hrms.exception.BusinessException;
import com.jamshed.hrms.repository.AppUserRepository;
import com.jamshed.hrms.service.AuditService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

@RestController @RequestMapping("/api/auth")
public class AuthController {
    private final AppUserRepository users;
    private final PasswordEncoder encoder;
    private final JwtEncoder jwtEncoder;
    private final AuditService audit;
    @Value("${app.jwt-duration-hours:8}") long duration;
    public AuthController(AppUserRepository users, PasswordEncoder encoder, JwtEncoder jwtEncoder, AuditService audit) {
        this.users = users; this.encoder = encoder; this.jwtEncoder = jwtEncoder; this.audit = audit;
    }
    @PostMapping("/login") public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        AppUser user = users.findByEmail(request.email()).orElseThrow(this::badCredentials);
        if (!user.isEnabled() || !encoder.matches(request.password(), user.getPasswordHash())) throw badCredentials();
        Instant now = Instant.now();
        JwtClaimsSet.Builder claimBuilder = JwtClaimsSet.builder().issuer("enterprise-hrms")
          .issuedAt(now).expiresAt(now.plus(duration, ChronoUnit.HOURS)).subject(user.getId().toString())
          .claim("role", user.getRole()).claim("version", user.getTokenVersion())
          .claim("email", user.getEmail());
        if (user.getEmployee() != null) claimBuilder.claim("employeeId", user.getEmployee().getId());
        JwtClaimsSet claims = claimBuilder.build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        audit.record(user.getEmail(), "AUTH", "LOGIN", "Logged in");
        var e = user.getEmployee();
        return new LoginResponse(token, user.getEmail(), user.getRole(), e == null ? null : e.getId(), e == null ? user.getEmail() : e.getFirstName() + " " + e.getLastName());
    }
    private ResponseStatusException badCredentials() { return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"); }
    @GetMapping("/me") public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        AppUser user = current(jwt);
        return Map.of("email", user.getEmail(), "role", user.getRole(), "enabled", user.isEnabled());
    }
    @PostMapping("/change-password") public Map<String,String> changePassword(@AuthenticationPrincipal Jwt jwt, @RequestBody Map<String,String> body) {
        AppUser user = current(jwt);
        String next = body.getOrDefault("newPassword", "");
        if (!encoder.matches(body.getOrDefault("currentPassword", ""), user.getPasswordHash())) throw new BusinessException("Current password is incorrect");
        if (next.length() < 12 || next.length() > 128) throw new BusinessException("New password must be 12–128 characters");
        user.setPasswordHash(encoder.encode(next)); user.setTokenVersion(user.getTokenVersion()+1); users.save(user);
        audit.record(user.getEmail(), "AUTH", "PASSWORD_CHANGE", "Own account");
        return Map.of("message", "Password updated");
    }
    private AppUser current(Jwt jwt) {
        AppUser u = users.findById(Long.valueOf(jwt.getSubject())).orElseThrow(this::badCredentials);
        if (!u.isEnabled()) throw badCredentials();
        return u;
    }
}
