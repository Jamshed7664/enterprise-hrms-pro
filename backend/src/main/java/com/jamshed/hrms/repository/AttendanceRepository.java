package com.jamshed.hrms.repository;
import com.jamshed.hrms.entity.Attendance; import org.springframework.data.jpa.repository.JpaRepository;
public interface AttendanceRepository extends JpaRepository<Attendance,Long> {
}
