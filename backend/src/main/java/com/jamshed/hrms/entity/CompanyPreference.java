package com.jamshed.hrms.entity;
import jakarta.persistence.*; import lombok.*;
@Entity @Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CompanyPreference {
 @Id private Long id;
 private String companyName; private String workspace; private String timezone; private String locale;
}
