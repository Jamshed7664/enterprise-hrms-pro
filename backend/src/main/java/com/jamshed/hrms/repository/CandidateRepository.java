package com.jamshed.hrms.repository;
import com.jamshed.hrms.entity.Candidate; import org.springframework.data.jpa.repository.JpaRepository;
public interface CandidateRepository extends JpaRepository<Candidate,Long> {
}
