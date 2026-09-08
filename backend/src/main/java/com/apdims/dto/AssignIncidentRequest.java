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
public class AssignIncidentRequest {

    @NotBlank(message = "Assigned engineer name/email is required")
    private String assignedTo;
}