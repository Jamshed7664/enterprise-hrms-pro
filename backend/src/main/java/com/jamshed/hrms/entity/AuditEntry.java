package com.jamshed.hrms.entity;
import jakarta.persistence.*; import lombok.*; import java.time.LocalDateTime;
@Entity @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AuditEntry {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 private LocalDateTime time; private String actor; private String module; private String action;
 @Column(length=1000) private String details;
}
