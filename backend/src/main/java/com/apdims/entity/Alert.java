package com.apdims.entity;

import com.apdims.enums.AlertSource;
import com.apdims.enums.AlertStatus;
import com.apdims.enums.IncidentSeverity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String alertName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AlertSource alertSource;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncidentSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AlertStatus status;

    @Column(name = "service_name", length = 100)
    private String serviceName;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Unique hash provided by Alertmanager to detect duplicates
    @Column(name = "fingerprint", length = 100)
    private String fingerprint;

    // Link to Incident (if auto-created)
    @Column(name = "incident_id")
    private Long incidentId;

    @Column(name = "fired_at")
    private LocalDateTime firedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}