package com.jamshed.hrms.entity;
import jakarta.persistence.*;import lombok.*;import java.time.*;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DocumentRecord {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Employee employee;
 private String name; private String type; private String category; private LocalDate expiry;
 private String fileUrl; private LocalDateTime uploadedAt;
}
