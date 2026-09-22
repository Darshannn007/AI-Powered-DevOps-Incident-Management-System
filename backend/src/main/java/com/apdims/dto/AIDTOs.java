package com.apdims.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

public class AIDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AIAnalysisResponse {
        private Long id;
        private Long incidentId;
        private String rootCauseSummary;
        private List<String> suggestedActions;
        private String preventionTip;
        private Double confidenceScore;
        private String modelUsed;
        private LocalDateTime createdAt;
    }
}