package com.jamshed.hrms.entity;
import jakarta.persistence.*; import lombok.*; import java.time.*;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LeaveRequest {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Employee employee; private String leaveType;
 private LocalDate startDate; private LocalDate endDate; @Column(length=1000) private String reason;
 private String status; private String managerComment; private LocalDateTime createdAt;
}
