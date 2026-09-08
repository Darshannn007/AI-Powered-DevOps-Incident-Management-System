package com.apdims.dto;

import com.apdims.enums.AlertSource;
import com.apdims.enums.AlertStatus;
import com.apdims.enums.IncidentSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

public class AlertDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IngestAlertRequest {
        @NotBlank(message = "Alert name is required")
        private String alertName;

        @NotNull(message = "Alert source is required")
        private AlertSource alertSource;

        @NotNull(message = "Severity is required")
        private IncidentSeverity severity;

        private String serviceName;
        private String description;
        private String fingerprint;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlertResponse {
        private Long id;
        private String alertName;
        private AlertSource alertSource;
        private IncidentSeverity severity;
        private AlertStatus status;
        private String serviceName;
        private String description;
        private String fingerprint;
        private Long incidentId;
        private LocalDateTime firedAt;
        private LocalDateTime resolvedAt;
        private LocalDateTime createdAt;
    }
}