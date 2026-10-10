package com.jamshed.hrms.entity;
import jakarta.persistence.*; import lombok.*; import java.time.*;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Timesheet {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Employee employee; private LocalDate weekStart;
 private Double hours; private String projectName; private String status; @Column(length=1000) private String notes;
}
