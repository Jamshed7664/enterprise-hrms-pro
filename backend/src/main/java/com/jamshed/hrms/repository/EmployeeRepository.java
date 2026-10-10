package com.jamshed.hrms.repository;
import com.jamshed.hrms.entity.Employee; import org.springframework.data.jpa.repository.JpaRepository;
public interface EmployeeRepository extends JpaRepository<Employee,Long> {
 java.util.Optional<Employee> findByEmail(String email);
}
