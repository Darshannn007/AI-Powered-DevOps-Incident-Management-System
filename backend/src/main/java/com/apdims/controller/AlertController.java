package com.apdims.controller;

import com.apdims.dto.AlertDTOs.AlertResponse;
import com.apdims.dto.AlertDTOs.IngestAlertRequest;
import com.apdims.service.AlertIngestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertIngestionService alertIngestionService;

    // Webhook Endpoint to receive alerts (from Prometheus, Grafana, or Custom tools)
    @PostMapping("/webhook")
    public ResponseEntity<AlertResponse> ingestAlert(@Valid @RequestBody IngestAlertRequest request) {
        AlertResponse response = alertIngestionService.ingestAlert(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // View all alerts
    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAllAlerts() {
        return ResponseEntity.ok(alertIngestionService.getAllAlerts());
    }

    // View currently active/firing alerts
    @GetMapping("/active")
    public ResponseEntity<List<AlertResponse>> getActiveAlerts() {
        return ResponseEntity.ok(alertIngestionService.getActiveFiringAlerts());
    }
}