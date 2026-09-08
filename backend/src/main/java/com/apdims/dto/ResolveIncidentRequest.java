package com.apdims.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResolveIncidentRequest {

    @NotBlank(message = "Root cause is required to resolve incident")
    private String rootCause;

    @NotBlank(message = "Resolution summary is required")
    private String resolutionSummary;
}