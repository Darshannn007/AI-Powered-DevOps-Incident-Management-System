package com.apdims.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "ai_analyses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "incident_id", nullable = false)
    private Long incidentId;

    @Column(name = "root_cause_summary", columnDefinition = "TEXT")
    private String rootCauseSummary;

    // JSON array of remediation steps
    @Column(name = "suggested_actions_json", columnDefinition = "TEXT")
    private String suggestedActionsJson;

    @Column(name = "prevention_tip", columnDefinition = "TEXT")
    private String preventionTip;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    @Column(name = "model_used", length = 50)
    private String modelUsed;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}