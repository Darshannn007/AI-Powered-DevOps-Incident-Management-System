package com.apdims.controller;

import com.apdims.dto.AssignIncidentRequest;
import com.apdims.dto.CreateIncidentRequest;
import com.apdims.dto.IncidentResponse;
import com.apdims.dto.ResolveIncidentRequest;
import com.apdims.enums.IncidentSeverity;
import com.apdims.enums.IncidentStatus;
import com.apdims.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/incidents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class IncidentController {

    private final IncidentService incidentService;

    // 1. Create a new Incident
    @PostMapping
    public ResponseEntity<IncidentResponse> createIncident(@Valid @RequestBody CreateIncidentRequest request) {
        IncidentResponse response = incidentService.createIncident(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 2. Get All Incidents (with optional status & severity filters)
    @GetMapping
    public ResponseEntity<List<IncidentResponse>> getAllIncidents(
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) IncidentSeverity severity) {

        if (status != null) {
            return ResponseEntity.ok(incidentService.getIncidentsByStatus(status));
        }
        if (severity != null) {
            return ResponseEntity.ok(incidentService.getIncidentsBySeverity(severity));
        }
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    // 3. Get Incident by ID
    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    // 4. Get Incident by Incident Number (e.g. /api/v1/incidents/number/INC-20260907-1234)
    @GetMapping("/number/{incidentNumber}")
    public ResponseEntity<IncidentResponse> getIncidentByNumber(@PathVariable String incidentNumber) {
        return ResponseEntity.ok(incidentService.getIncidentByNumber(incidentNumber));
    }

    // 5. Acknowledge Incident (PATCH /api/v1/incidents/{id}/acknowledge)
    @PatchMapping("/{id}/acknowledge")
    public ResponseEntity<IncidentResponse> acknowledgeIncident(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.acknowledgeIncident(id));
    }

    // 6. Assign Incident to Engineer (PATCH /api/v1/incidents/{id}/assign)
    @PatchMapping("/{id}/assign")
    public ResponseEntity<IncidentResponse> assignIncident(
            @PathVariable Long id,
            @Valid @RequestBody AssignIncidentRequest request) {
        return ResponseEntity.ok(incidentService.assignIncident(id, request));
    }

    // 7. Resolve Incident (PATCH /api/v1/incidents/{id}/resolve)
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<IncidentResponse> resolveIncident(
            @PathVariable Long id,
            @Valid @RequestBody ResolveIncidentRequest request) {
        return ResponseEntity.ok(incidentService.resolveIncident(id, request));
    }

    // 8. Close Incident (PATCH /api/v1/incidents/{id}/close)
    @PatchMapping("/{id}/close")
    public ResponseEntity<IncidentResponse> closeIncident(@PathVariable Long id) {
        return ResponseEntity.ok(incidentService.closeIncident(id));
    }
}