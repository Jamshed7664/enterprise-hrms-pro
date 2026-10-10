package com.jamshed.hrms.entity;
import jakarta.persistence.*; import jakarta.validation.constraints.*; import lombok.*; import java.time.LocalDate;
@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Employee {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @NotBlank @Column(unique=true,nullable=false) private String employeeCode;
 @NotBlank private String firstName; @NotBlank private String lastName;
 @Email @Column(unique=true,nullable=false) private String email;
 private String phone; private String jobTitle; private String location; private LocalDate joinDate;
 @ManyToOne(fetch=FetchType.EAGER) private Department department;
 private String status; private String profileImageUrl; private String profileImageName; private String gender; private LocalDate dateOfBirth;
 private String address; private String managerName;
}
