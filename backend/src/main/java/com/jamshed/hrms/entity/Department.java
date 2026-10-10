package com.jamshed.hrms.entity;
import jakarta.persistence.*; import jakarta.validation.constraints.NotBlank; import lombok.*;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotBlank @Column(unique=true,nullable=false) private String name;
 private String code; private String description; private boolean active=true;
}
