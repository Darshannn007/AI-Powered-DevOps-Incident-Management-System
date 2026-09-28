package com.apdims.service;

import com.apdims.dto.AlertDTOs.AlertResponse;
import com.apdims.dto.AlertDTOs.IngestAlertRequest;
import com.apdims.dto.AlertDTOs.AlertmanagerWebhookPayload;
import com.apdims.dto.AlertDTOs.AlertmanagerAlert;
import com.apdims.dto.CreateIncidentRequest;
import com.apdims.dto.IncidentResponse;
import com.apdims.entity.Alert;
import com.apdims.enums.AlertSource;
import com.apdims.enums.AlertStatus;
import com.apdims.enums.IncidentPriority;
import com.apdims.enums.IncidentSeverity;
import com.apdims.repository.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AlertIngestionService {

    private final AlertRepository alertRepository;
    private final IncidentService incidentService;

    public AlertResponse ingestAlert(IngestAlertRequest request) {
        String fingerprint = request.getFingerprint() != null && !request.getFingerprint().isBlank()
                ? request.getFingerprint()
                : generateFingerprint(request);

        // 1. Deduplication check: Is this alert already FIRING?
        Optional<Alert> existingFiringAlert = alertRepository.findByFingerprintAndStatus(fingerprint, AlertStatus.FIRING);
        if (existingFiringAlert.isPresent()) {
            Alert existing = existingFiringAlert.get();
            log.info("Duplicate alert detected for fingerprint [{}]. Updating existing alert id [{}]", fingerprint, existing.getId());
            return mapToResponse(existing);
        }

        // 2. New Alert: Build and Save
        Alert alert = Alert.builder()
                .alertName(request.getAlertName())
                .alertSource(request.getAlertSource())
                .severity(request.getSeverity())
                .status(AlertStatus.FIRING)
                .serviceName(request.getServiceName())
                .description(request.getDescription())
                .fingerprint(fingerprint)
                .firedAt(LocalDateTime.now())
                .build();

        // 3. Automated Rule: If severity is CRITICAL or HIGH, Auto-create an Incident!
        if (request.getSeverity() == IncidentSeverity.CRITICAL || request.getSeverity() == IncidentSeverity.HIGH) {
            IncidentPriority priority = request.getSeverity() == IncidentSeverity.CRITICAL ? IncidentPriority.P1 : IncidentPriority.P2;

            CreateIncidentRequest incidentReq = CreateIncidentRequest.builder()
                    .title("[Auto-Alert] " + request.getAlertName() + " on " + request.getServiceName())
                    .description(request.getDescription())
                    .severity(request.getSeverity())
                    .priority(priority)
                    .serviceName(request.getServiceName())
                    .createdBy("AlertEngine-" + request.getAlertSource())
                    .build();

            IncidentResponse createdIncident = incidentService.createIncident(incidentReq);
            alert.setIncidentId(createdIncident.getId());
            log.info("Auto-created Incident [{}] for Alert [{}]", createdIncident.getIncidentNumber(), request.getAlertName());
        }

        Alert savedAlert = alertRepository.save(alert);
        return mapToResponse(savedAlert);
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getAllAlerts() {
        return alertRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AlertResponse> getActiveFiringAlerts() {
        return alertRepository.findByStatus(AlertStatus.FIRING).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Ingest alerts coming directly from Prometheus Alertmanager Webhook
    public List<AlertResponse> ingestAlertmanagerWebhook(AlertmanagerWebhookPayload payload) {
        List<AlertResponse> responses = new ArrayList<>();
        if (payload == null || payload.getAlerts() == null || payload.getAlerts().isEmpty()) {
            log.warn("Received empty or null Alertmanager webhook payload");
            return responses;
        }

        log.info("Processing Prometheus Alertmanager webhook with {} alerts (status: {})",
                payload.getAlerts().size(), payload.getStatus());

        for (AlertmanagerAlert alertItem : payload.getAlerts()) {
            Map<String, String> labels = alertItem.getLabels() != null ? alertItem.getLabels() : Map.of();
            Map<String, String> annotations = alertItem.getAnnotations() != null ? alertItem.getAnnotations() : Map.of();

            String alertName = labels.getOrDefault("alertname", "PrometheusAlert");
            String serviceName = labels.getOrDefault("service", labels.getOrDefault("job", "apdims-backend"));
            
            // Map Prometheus severity to APDIMS IncidentSeverity
            String rawSeverity = labels.getOrDefault("severity", "HIGH").toUpperCase();
            IncidentSeverity severity;
            switch (rawSeverity) {
                case "CRITICAL":
                case "PAGE":
                case "FATAL":
                    severity = IncidentSeverity.CRITICAL;
                    break;
                case "WARNING":
                case "WARN":
                case "HIGH":
                    severity = IncidentSeverity.HIGH;
                    break;
                case "LOW":
                case "INFO":
                    severity = IncidentSeverity.LOW;
                    break;
                default:
                    severity = IncidentSeverity.MEDIUM;
                    break;
            }

            // Description extraction
            String description = annotations.getOrDefault("description",
                    annotations.getOrDefault("summary", "Prometheus Alertmanager triggered: " + alertName));

            IngestAlertRequest request = IngestAlertRequest.builder()
                    .alertName(alertName)
                    .alertSource(AlertSource.PROMETHEUS)
                    .severity(severity)
                    .serviceName(serviceName)
                    .description(description)
                    .fingerprint(alertItem.getFingerprint())
                    .build();

            AlertResponse response = ingestAlert(request);
            responses.add(response);
        }

        return responses;
    }

    private String generateFingerprint(IngestAlertRequest request) {
        return (request.getAlertName() + "-" + request.getServiceName() + "-" + request.getSeverity()).toLowerCase();
    }

    private AlertResponse mapToResponse(Alert alert) {
        return AlertResponse.builder()
                .id(alert.getId())
                .alertName(alert.getAlertName())
                .alertSource(alert.getAlertSource())
                .severity(alert.getSeverity())
                .status(alert.getStatus())
                .serviceName(alert.getServiceName())
                .description(alert.getDescription())
                .fingerprint(alert.getFingerprint())
                .incidentId(alert.getIncidentId())
                .firedAt(alert.getFiredAt())
                .resolvedAt(alert.getResolvedAt())
                .createdAt(alert.getCreatedAt())
                .build();
    }
}