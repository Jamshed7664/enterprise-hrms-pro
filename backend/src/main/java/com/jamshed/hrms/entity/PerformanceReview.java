package com.jamshed.hrms.entity;
import jakarta.persistence.*;import lombok.*;import java.time.LocalDate;
@Entity @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PerformanceReview {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @ManyToOne(optional=false) private Employee employee;
 private String cycle; private Double rating;@Column(length=1000) private String feedback;
 private String goal;private Integer progress;private LocalDate dueDate;
}
