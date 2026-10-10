package com.jamshed.hrms.repository;
import com.jamshed.hrms.entity.LeaveRequest; import org.springframework.data.jpa.repository.JpaRepository;
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest,Long> {
}
