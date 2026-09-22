package com.apdims.service;

import com.apdims.dto.AIDTOs.AIAnalysisResponse;
import com.apdims.entity.AIAnalysis;
import com.apdims.entity.Incident;
import com.apdims.exception.ResourceNotFoundException;
import com.apdims.repository.AIAnalysisRepository;
import com.apdims.repository.IncidentRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class GeminiAIService {

    private final AIAnalysisRepository aiAnalysisRepository;
    private final IncidentRepository incidentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String modelName;

    public AIAnalysisResponse analyzeIncident(Long incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + incidentId));

        AIAnalysisResponse analysisResult;

        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            try {
                log.info("Calling real Google Gemini API for Incident ID [{}]", incidentId);
                analysisResult = callGeminiApi(incident);
            } catch (Exception e) {
                log.error("Gemini API call failed, falling back to intelligent heuristic analysis: {}", e.getMessage());
                analysisResult = generateSmartFallbackAnalysis(incident);
            }
        } else {
            log.info("No Gemini API key configured in application.properties. Using intelligent heuristic analysis for Incident [{}]", incidentId);
            analysisResult = generateSmartFallbackAnalysis(incident);
        }

        String actionsJson = "[]";
        try {
            actionsJson = objectMapper.writeValueAsString(analysisResult.getSuggestedActions());
        } catch (Exception ignored) {}

        AIAnalysis entity = AIAnalysis.builder()
                .incidentId(incident.getId())
                .rootCauseSummary(analysisResult.getRootCauseSummary())
                .suggestedActionsJson(actionsJson)
                .preventionTip(analysisResult.getPreventionTip())
                .confidenceScore(analysisResult.getConfidenceScore())
                .modelUsed(analysisResult.getModelUsed())
                .build();

        AIAnalysis saved = aiAnalysisRepository.save(entity);

        incident.setRootCause(analysisResult.getRootCauseSummary());
        incidentRepository.save(incident);

        analysisResult.setId(saved.getId());
        analysisResult.setIncidentId(saved.getIncidentId());
        analysisResult.setCreatedAt(saved.getCreatedAt());

        return analysisResult;
    }

    @Transactional(readOnly = true)
    public AIAnalysisResponse getLatestAnalysis(Long incidentId) {
        AIAnalysis entity = aiAnalysisRepository.findTopByIncidentIdOrderByCreatedAtDesc(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("No AI analysis found for incident id: " + incidentId));

        List<String> actions = new ArrayList<>();
        try {
            actions = objectMapper.readValue(entity.getSuggestedActionsJson(), new TypeReference<List<String>>() {});
        } catch (Exception ignored) {}

        return AIAnalysisResponse.builder()
                .id(entity.getId())
                .incidentId(entity.getIncidentId())
                .rootCauseSummary(entity.getRootCauseSummary())
                .suggestedActions(actions)
                .preventionTip(entity.getPreventionTip())
                .confidenceScore(entity.getConfidenceScore())
                .modelUsed(entity.getModelUsed())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private AIAnalysisResponse callGeminiApi(Incident incident) throws Exception {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + geminiApiKey;

        String prompt = buildPrompt(incident);

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        JsonNode root = objectMapper.readTree(response.getBody());
        String textOutput = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        String cleanedJson = textOutput.replaceAll("```json", "").replaceAll("```", "").trim();
        JsonNode parsedAi = objectMapper.readTree(cleanedJson);

        List<String> actions = new ArrayList<>();
        if (parsedAi.has("suggestedActions") && parsedAi.get("suggestedActions").isArray()) {
            for (JsonNode node : parsedAi.get("suggestedActions")) {
                actions.add(node.asText());
            }
        }

        return AIAnalysisResponse.builder()
                .rootCauseSummary(parsedAi.path("rootCause").asText("Potential service degradation detected."))
                .suggestedActions(actions)
                .preventionTip(parsedAi.path("preventionTip").asText("Add monitoring alerts for this subsystem."))
                .confidenceScore(parsedAi.path("confidenceScore").asDouble(0.90))
                .modelUsed(modelName)
                .build();
    }

    private String buildPrompt(Incident incident) {
        return "You are an expert DevOps and Site Reliability Engineer (SRE) AI Assistant.\n"
                + "Analyze the following incident and diagnose the root cause:\n\n"
                + "Incident Title: " + incident.getTitle() + "\n"
                + "Service: " + incident.getServiceName() + "\n"
                + "Severity: " + incident.getSeverity() + "\n"
                + "Priority: " + incident.getPriority() + "\n"
                + "Description / Error Logs: " + incident.getDescription() + "\n\n"
                + "Respond ONLY in valid, parseable JSON format with this exact structure:\n"
                + "{\n"
                + "  \"rootCause\": \"1-2 sentences explaining why this happened\",\n"
                + "  \"suggestedActions\": [\"Action step 1\", \"Action step 2\", \"Action step 3\"],\n"
                + "  \"confidenceScore\": 0.92,\n"
                + "  \"preventionTip\": \"How to prevent in future\"\n"
                + "}\n";
    }

    private AIAnalysisResponse generateSmartFallbackAnalysis(Incident incident) {
        String desc = incident.getDescription() != null ? incident.getDescription().toLowerCase() : "";
        String title = incident.getTitle() != null ? incident.getTitle().toLowerCase() : "";
        String combined = title + " " + desc;

        String rootCause;
        List<String> actions = new ArrayList<>();
        String prevention;
        double confidence = 0.88;

        if (combined.contains("cpu") || combined.contains("utilization")) {
            rootCause = "High CPU utilization detected in " + incident.getServiceName() + " caused by infinite loop or thread starvation under spike load.";
            actions.add("Scale up Kubernetes pod replicas or increase CPU limits.");
            actions.add("Capture Java thread dump to identify blocked execution threads.");
            actions.add("Check recent code deployment for inefficient algorithms.");
            prevention = "Set up Horizontal Pod Autoscaling (HPA) with CPU target at 75%.";
        } else if (combined.contains("memory") || combined.contains("oom") || combined.contains("heap")) {
            rootCause = "Out of Memory (OOM) or garbage collection pause in " + incident.getServiceName() + " due to memory leak or undersized heap.";
            actions.add("Restart application pods to clear hung heap memory.");
            actions.add("Analyze JVM heap dump with Eclipse Memory Analyzer (MAT).");
            actions.add("Increase -Xmx maximum heap parameter in JVM arguments.");
            prevention = "Configure Prometheus alerts on JVM old-gen memory threshold > 80%.";
        } else if (combined.contains("database") || combined.contains("sql") || combined.contains("connection")) {
            rootCause = "Database connection pool exhaustion in " + incident.getServiceName() + " leading to connection timeout.";
            actions.add("Increase HikariCP maximum-pool-size in application properties.");
            actions.add("Check MySQL slow query logs for unindexed queries holding connections.");
            actions.add("Terminate long-running idle DB connections.");
            prevention = "Add index on frequently queried foreign key columns.";
        } else {
            rootCause = "Service degraded on " + incident.getServiceName() + " due to downstream timeout or unexpected error response.";
            actions.add("Check application logs for recent 5xx error stack traces.");
            actions.add("Verify health and network latency of dependent downstream services.");
            actions.add("Consider triggering circuit breaker to avoid cascading failure.");
            prevention = "Implement Resilience4j circuit breakers on external HTTP calls.";
        }

        return AIAnalysisResponse.builder()
                .rootCauseSummary(rootCause)
                .suggestedActions(actions)
                .preventionTip(prevention)
                .confidenceScore(confidence)
                .modelUsed("heuristic-sre-engine")
                .build();
    }
}
