package com.jamshed.hrms.repository;
import com.jamshed.hrms.entity.Timesheet; import org.springframework.data.jpa.repository.JpaRepository;
public interface TimesheetRepository extends JpaRepository<Timesheet,Long> {
}
