package com.jamshed.hrms.repository;
import com.jamshed.hrms.entity.Payroll; import org.springframework.data.jpa.repository.JpaRepository;
public interface PayrollRepository extends JpaRepository<Payroll,Long> {
}
