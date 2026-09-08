package com.apdims.repository;

import com.apdims.entity.Alert;
import com.apdims.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    // Check if an alert with this fingerprint is already actively firing
    Optional<Alert> findByFingerprintAndStatus(String fingerprint, AlertStatus status);

    // Get all alerts linked to a particular incident
    List<Alert> findByIncidentId(Long incidentId);

    // Get all active firing alerts
    List<Alert> findByStatus(AlertStatus status);
}