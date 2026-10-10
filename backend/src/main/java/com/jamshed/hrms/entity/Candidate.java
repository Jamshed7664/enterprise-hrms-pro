package com.jamshed.hrms.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Candidate {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private String name; private String email; private String phone; private String position; private String stage;
 private Integer experienceYears; private String source;
}
