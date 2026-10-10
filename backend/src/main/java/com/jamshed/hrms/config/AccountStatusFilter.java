
package com.jamshed.hrms.config;

import com.jamshed.hrms.repository.AppUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AccountStatusFilter extends OncePerRequestFilter {

    private final AppUserRepository repo;

    public AccountStatusFilter(AppUserRepository repo) {
        this.repo = repo;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        var auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth instanceof JwtAuthenticationToken token) {

            boolean valid = false;

            try {
                Long userId = Long.parseLong(
                        token.getToken().getSubject()
                );

                String role = token.getToken()
                        .getClaimAsString("role");

                Number version = token.getToken()
                        .getClaim("version");

                if (version != null) {
                    valid = repo.findById(userId)
                            .map(user ->
                                    user.isEnabled()
                                            && user.getRole().equals(role)
                                            && user.getTokenVersion()
                                            == version.intValue()
                            )
                            .orElse(false);
                }

            } catch (NumberFormatException ex) {
                valid = false;
            }

            if (!valid) {
                SecurityContextHolder.clearContext();

                response.sendError(
                        HttpServletResponse.SC_UNAUTHORIZED,
                        "Session expired or account disabled"
                );
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
