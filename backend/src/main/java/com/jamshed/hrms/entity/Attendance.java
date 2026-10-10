package com.jamshed.hrms.entity;
import jakarta.persistence.*; import lombok.*; import java.time.*;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attendance {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Employee employee; private LocalDate workDate;
 private LocalDateTime checkIn; private LocalDateTime checkOut; private String status;
}
