package com.jamshed.hrms.repository;
import com.jamshed.hrms.entity.AuditEntry;import org.springframework.data.jpa.repository.JpaRepository;
public interface AuditEntryRepository extends JpaRepository<AuditEntry,Long>{}
