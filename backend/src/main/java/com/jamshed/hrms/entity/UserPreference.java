package com.jamshed.hrms.entity;
import jakarta.persistence.*;import lombok.*;
@Entity @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class UserPreference {
 @Id private Long id;
 private boolean leaveAlerts; private boolean attendanceAlerts; private boolean recruitmentAlerts;
}
