package com.apdims.controller;

import com.apdims.dto.AIDTOs.AIAnalysisResponse;
import com.apdims.service.GeminiAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIAnalysisController {

    private final GeminiAIService geminiAIService;

    @PostMapping("/{id}/ai-analyze")
    public ResponseEntity<AIAnalysisResponse> triggerAIAnalysis(@PathVariable Long id) {
        AIAnalysisResponse response = geminiAIService.analyzeIncident(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/ai-analysis")
    public ResponseEntity<AIAnalysisResponse> getLatestAIAnalysis(@PathVariable Long id) {
        AIAnalysisResponse response = geminiAIService.getLatestAnalysis(id);
        return ResponseEntity.ok(response);
    }
}
