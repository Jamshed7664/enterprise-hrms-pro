package com.jamshed.hrms;

import com.jamshed.hrms.entity.AppUser;
import com.jamshed.hrms.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:hrmstest;MODE=MySQL;DB_CLOSE_DELAY=-1",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "app.jwt-secret=ThisIsARandomLookingTestSecretWithFortyCharacters111",
    "app.demo.seed=false"
})
@AutoConfigureMockMvc
class SecuritySmokeTest {
    @Autowired MockMvc mvc;
    @Autowired AppUserRepository users;
    @Autowired PasswordEncoder passwords;

    @BeforeEach void prepare() {
        users.deleteAll();
        users.save(AppUser.builder().email("demo@example.test")
          .passwordHash(passwords.encode("SafeDemoPassword123"))
          .role("ADMIN").enabled(true).build());
    }
    @Test void protectedEndpointsRequireAuthentication() throws Exception {
        mvc.perform(get("/api/employees")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/users")).andExpect(status().isUnauthorized());
    }
    @Test void invalidPasswordIsRejected() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
          .content("{\"email\":\"demo@example.test\",\"password\":\"wrong\"}"))
          .andExpect(status().isUnauthorized());
    }
    @Test void validTokenCanAccessProtectedEndpoints() throws Exception {
        MvcResult login = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
           .content("{\"email\":\"demo@example.test\",\"password\":\"SafeDemoPassword123\"}"))
           .andExpect(status().isOk()).andExpect(jsonPath("$.token").exists()).andReturn();
        String json = login.getResponse().getContentAsString();
        String token = new com.fasterxml.jackson.databind.ObjectMapper().readTree(json).get("token").asText();
        mvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + token))
          .andExpect(status().isOk());
    }
}
