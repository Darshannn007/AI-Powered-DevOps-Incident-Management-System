package com.apdims.entity;

import com.apdims.enums.IncidentPriority;
import com.apdims.enums.IncidentSeverity;
import com.apdims.enums.IncidentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "incidents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "incident_number", unique = true, nullable = false, length = 50)
    private String incidentNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncidentSeverity severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncidentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private IncidentPriority priority;

    @Column(name = "service_name", length = 100)
    private String serviceName;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "root_cause", columnDefinition = "TEXT")
    private String rootCause;

    @Column(name = "resolution_summary", columnDefinition = "TEXT")
    private String resolutionSummary;

    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    // SLA Escalation Tracking
    @Column(name = "escalated", nullable = false)
    @Builder.Default
    private boolean escalated = false;

    @Column(name = "escalation_count", nullable = false)
    @Builder.Default
    private int escalationCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}