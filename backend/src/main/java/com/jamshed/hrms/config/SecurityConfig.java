
package com.jamshed.hrms.config;

import com.jamshed.hrms.repository.AppUserRepository;
import com.nimbusds.jose.jwk.source.ImmutableSecret;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    // JWT Secret Key
    @Bean
    public SecretKey signingKey(
            @Value("${app.jwt-secret}") String value) {

        if (value == null ||
                value.getBytes(StandardCharsets.UTF_8).length < 32) {

            throw new IllegalStateException(
                    "JWT_SECRET must contain at least 32 bytes"
            );
        }

        return new SecretKeySpec(
                value.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );
    }

    // JWT Encoder
    @Bean
    public JwtEncoder jwtEncoder(SecretKey key) {
        return new NimbusJwtEncoder(
                new ImmutableSecret<>(key)
        );
    }

    // JWT Decoder
    @Bean
    public JwtDecoder jwtDecoder(SecretKey key) {
        return NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    // JWT Role Converter
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {

            String role = jwt.getClaimAsString("role");

            if (role == null || role.isBlank()) {
                return List.of();
            }

            return List.of(
                    new SimpleGrantedAuthority("ROLE_" + role)
            );
        });

        return converter;
    }

    // Main Spring Security Configuration
    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationConverter jwtConverter,
            AppUserRepository users,
            @Qualifier("corsConfigurationSource")
            CorsConfigurationSource corsSource
    ) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(corsSource)
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // CORS preflight requests
                        .requestMatchers(
                                HttpMethod.OPTIONS, "/**"
                        ).permitAll()

                        // Public login
                        .requestMatchers(
                                HttpMethod.POST, "/api/auth/login"
                        ).permitAll()

                        .requestMatchers("/error").permitAll()

                        // Admin-only endpoints
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // Authenticated user endpoints
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/profile/**",
                                "/api/settings/notifications"
                        ).authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/settings/company",
                                "/api/documents",
                                "/api/documents/**"
                        ).authenticated()

                        // HR and Admin endpoints
                        .requestMatchers(
                                "/api/**"
                        ).hasAnyRole("ADMIN", "HR_MANAGER")

                        .anyRequest().denyAll()
                )

                // Validate JWT on protected requests
                .oauth2ResourceServer(oauth ->
                        oauth.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(jwtConverter)
                        )
                )

                // Validate account status after JWT authentication
                .addFilterAfter(
                        new AccountStatusFilter(users),
                        BearerTokenAuthenticationFilter.class
                )

                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .build();
    }

    // CORS Configuration
    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors-origins}") String origins
    ) {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(
                Arrays.stream(origins.split(","))
                        .map(String::trim)
                        .filter(origin -> !origin.isBlank())
                        .toList()
        );

        config.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        config.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept"
                )
        );

        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
