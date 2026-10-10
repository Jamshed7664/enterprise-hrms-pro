package com.jamshed.hrms.repository;
import com.jamshed.hrms.entity.Department; import org.springframework.data.jpa.repository.JpaRepository;
public interface DepartmentRepository extends JpaRepository<Department,Long> {
}
