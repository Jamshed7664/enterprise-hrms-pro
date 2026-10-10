package com.jamshed.hrms.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class ApprovalRule {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String name;
 private String flow; private boolean enabled;
}
