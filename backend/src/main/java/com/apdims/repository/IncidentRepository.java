package com.apdims.repository;

import com.apdims.entity.Incident;
import com.apdims.enums.IncidentSeverity;
import com.apdims.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident,Long> {

    // Unique Incident Code se find karna (e.g. INC-20260904-001)
    Optional<Incident> findByIncidentNumber(String incidentNumber);

    // Filter by status (e.g. Saare TRIGGERED incidents lana)
    List<Incident> findByStatus(IncidentStatus status);

    // Filter by severity (e.g. Saare CRITICAL incidents lana)
    List<Incident> findBySeverity(IncidentSeverity severity);

    // Check if incident number already exists
    boolean existsByIncidentNumber(String IncidentNumber);

    // SLA Escalation: Find TRIGGERED incidents that are past their SLA deadline
    // and haven't been escalated yet
    @Query("SELECT i FROM Incident i WHERE i.status = :status " +
           "AND i.severity = :severity " +
           "AND i.escalated = false " +
           "AND i.createdAt <= :cutoffTime")
    List<Incident> findSlaBreachedIncidents(
            @Param("status") IncidentStatus status,
            @Param("severity") IncidentSeverity severity,
            @Param("cutoffTime") LocalDateTime cutoffTime
    );

}
