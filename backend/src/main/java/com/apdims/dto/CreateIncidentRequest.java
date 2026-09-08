package com.apdims.dto;

import com.apdims.enums.IncidentPriority;
import com.apdims.enums.IncidentSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateIncidentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Severity is required (CRITICAL, HIGH, MEDIUM, LOW)")
    private IncidentSeverity severity;

    @NotNull(message = "Priority is required (P1, P2, P3, P4)")
    private IncidentPriority priority;

    private String serviceName;

    private String createdBy;

    private String assignedTo;
}