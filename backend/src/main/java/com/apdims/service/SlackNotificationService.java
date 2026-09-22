package com.apdims.service;

import com.apdims.entity.Incident;
import com.apdims.enums.IncidentSeverity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Slf4j
@Service
public class SlackNotificationService {

    @Value("${slack.webhook.url:}")
    private String webhookUrl;

    @Value("${slack.enabled:false}")
    private boolean slackEnabled;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendIncidentCreatedNotification(Incident incident) {
        if (!slackEnabled || webhookUrl == null || webhookUrl.isBlank()) {
            log.info("Slack notifications are disabled or webhook URL not configured.");
            return false;
        }

        try {
            String color = getSeverityColor(incident.getSeverity());
            String title = "🚨 [" + incident.getSeverity() + "] New Incident: " + incident.getIncidentNumber();

            List<Map<String, Object>> fields = new ArrayList<>();
            fields.add(createField("Incident #", incident.getIncidentNumber(), true));
            fields.add(createField("Service", incident.getServiceName(), true));
            fields.add(createField("Severity", incident.getSeverity().name(), true));
            fields.add(createField("Priority", incident.getPriority() != null ? incident.getPriority().name() : "N/A", true));
            fields.add(createField("Status", incident.getStatus().name(), true));
            fields.add(createField("Assigned To", incident.getAssignedTo() != null ? incident.getAssignedTo() : "Unassigned", true));
            fields.add(createField("Title", incident.getTitle(), false));
            if (incident.getDescription() != null && !incident.getDescription().isBlank()) {
                fields.add(createField("Description", incident.getDescription(), false));
            }

            Map<String, Object> attachment = new HashMap<>();
            attachment.put("color", color);
            attachment.put("pretext", "⚠️ *APDIMS Alert Engine - Incident Triggered*");
            attachment.put("title", title);
            attachment.put("fields", fields);
            attachment.put("footer", "APDIMS • Automated SRE Incident Platform");
            attachment.put("ts", System.currentTimeMillis() / 1000);

            Map<String, Object> payload = Map.of(
                    "attachments", List.of(attachment)
            );

            sendPayload(payload);
            log.info("Slack notification sent successfully for incident [{}]", incident.getIncidentNumber());
            return true;
        } catch (Exception e) {
            log.error("Failed to send Slack notification for incident [{}]: {}", incident.getIncidentNumber(), e.getMessage());
            return false;
        }
    }

    public boolean sendIncidentResolvedNotification(Incident incident) {
        if (!slackEnabled || webhookUrl == null || webhookUrl.isBlank()) {
            return false;
        }

        try {
            String title = "✅ Incident Resolved: " + incident.getIncidentNumber();

            List<Map<String, Object>> fields = new ArrayList<>();
            fields.add(createField("Incident #", incident.getIncidentNumber(), true));
            fields.add(createField("Service", incident.getServiceName(), true));
            fields.add(createField("Status", "RESOLVED", true));
            fields.add(createField("Root Cause", incident.getRootCause() != null ? incident.getRootCause() : "N/A", false));
            fields.add(createField("Resolution", incident.getResolutionSummary() != null ? incident.getResolutionSummary() : "N/A", false));

            Map<String, Object> attachment = new HashMap<>();
            attachment.put("color", "#2EB886"); // Green for resolved
            attachment.put("pretext", "🎉 *Incident has been successfully resolved!*");
            attachment.put("title", title);
            attachment.put("fields", fields);
            attachment.put("footer", "APDIMS • Incident Resolved");
            attachment.put("ts", System.currentTimeMillis() / 1000);

            Map<String, Object> payload = Map.of(
                    "attachments", List.of(attachment)
            );

            sendPayload(payload);
            log.info("Slack resolved notification sent for incident [{}]", incident.getIncidentNumber());
            return true;
        } catch (Exception e) {
            log.error("Failed to send Slack resolved notification for incident [{}]: {}", incident.getIncidentNumber(), e.getMessage());
            return false;
        }
    }

    public boolean sendTestNotification(String triggeredBy) {
        if (!slackEnabled || webhookUrl == null || webhookUrl.isBlank()) {
            log.warn("Slack webhook not configured or disabled.");
            return false;
        }

        try {
            List<Map<String, Object>> fields = new ArrayList<>();
            fields.add(createField("Status", "ONLINE & CONNECTED ✅", true));
            fields.add(createField("Triggered By", triggeredBy != null ? triggeredBy : "System Admin", true));
            fields.add(createField("Integration", "APDIMS Slack Webhook", true));
            fields.add(createField("Platform", "Spring Boot 3 + Docker", true));

            Map<String, Object> attachment = new HashMap<>();
            attachment.put("color", "#4A154B"); // Slack purple
            attachment.put("pretext", "🚀 *APDIMS Slack Integration Test*");
            attachment.put("title", "APDIMS DevOps Incident Alert System is Connected!");
            attachment.put("text", "Your Slack workspace is now linked with APDIMS. All CRITICAL and HIGH severity incidents will be automatically broadcast to this channel in real time.");
            attachment.put("fields", fields);
            attachment.put("footer", "APDIMS Integration Check");
            attachment.put("ts", System.currentTimeMillis() / 1000);

            Map<String, Object> payload = Map.of(
                    "attachments", List.of(attachment)
            );

            sendPayload(payload);
            log.info("Slack test notification sent successfully!");
            return true;
        } catch (Exception e) {
            log.error("Failed to send Slack test notification: {}", e.getMessage());
            return false;
        }
    }

    private void sendPayload(Map<String, Object> payload) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        restTemplate.postForEntity(webhookUrl, request, String.class);
    }

    private Map<String, Object> createField(String title, String value, boolean isShort) {
        Map<String, Object> field = new HashMap<>();
        field.put("title", title);
        field.put("value", value);
        field.put("short", isShort);
        return field;
    }

    private String getSeverityColor(IncidentSeverity severity) {
        if (severity == null) return "#808080";
        return switch (severity) {
            case CRITICAL -> "#E01E5A"; // Red
            case HIGH -> "#ECB22E";     // Amber/Orange
            case MEDIUM -> "#2EB886";   // Teal/Yellow-Green
            case LOW -> "#4A154B";      // Slack Purple
        };
    }
}
