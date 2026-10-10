package com.jamshed.hrms.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder @Table(name="app_users")
public class AppUser {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(unique=true,nullable=false) private String email; private String passwordHash;
 private String role; private boolean enabled=true; private int tokenVersion; @OneToOne private Employee employee;
}
