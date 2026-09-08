package com.apdims.service;

import com.apdims.dto.AssignIncidentRequest;
import com.apdims.dto.CreateIncidentRequest;
import com.apdims.dto.IncidentResponse;
import com.apdims.dto.ResolveIncidentRequest;
import com.apdims.entity.Incident;
import com.apdims.enums.IncidentSeverity;
import com.apdims.enums.IncidentStatus;
import com.apdims.exception.ResourceNotFoundException;
import com.apdims.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidentService {

    private final IncidentRepository incidentRepository;

    // 1. Create a new Incident
    public IncidentResponse createIncident(CreateIncidentRequest request) {
        String incidentNumber = generateUniqueIncidentNumber();

        Incident incident = Incident.builder()
                .incidentNumber(incidentNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .severity(request.getSeverity())
                .status(IncidentStatus.TRIGGERED)
                .priority(request.getPriority())
                .serviceName(request.getServiceName())
                .assignedTo(request.getAssignedTo())
                .createdBy(request.getCreatedBy() != null ? request.getCreatedBy() : "SYSTEM")
                .triggeredAt(LocalDateTime.now())
                .build();

        Incident savedIncident = incidentRepository.save(incident);
        return mapToResponse(savedIncident);
    }

    // 2. Get All Incidents
    @Transactional(readOnly = true)
    public List<IncidentResponse> getAllIncidents() {
        return incidentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 3. Get Incident by ID
    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));
        return mapToResponse(incident);
    }

    // 4. Get Incident by Incident Number (e.g. INC-20260907-XXXX)
    @Transactional(readOnly = true)
    public IncidentResponse getIncidentByNumber(String incidentNumber) {
        Incident incident = incidentRepository.findByIncidentNumber(incidentNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with number: " + incidentNumber));
        return mapToResponse(incident);
    }

    // 5. Get Incidents by Status
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsByStatus(IncidentStatus status) {
        return incidentRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 6. Get Incidents by Severity
    @Transactional(readOnly = true)
    public List<IncidentResponse> getIncidentsBySeverity(IncidentSeverity severity) {
        return incidentRepository.findBySeverity(severity).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 7. Acknowledge Incident (Lifecycle step: TRIGGERED -> ACKNOWLEDGED)
    public IncidentResponse acknowledgeIncident(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));

        incident.setStatus(IncidentStatus.ACKNOWLEDGED);
        incident.setAcknowledgedAt(LocalDateTime.now());

        return mapToResponse(incidentRepository.save(incident));
    }

    // 8. Assign Incident to an Engineer
    public IncidentResponse assignIncident(Long id, AssignIncidentRequest request) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));

        incident.setAssignedTo(request.getAssignedTo());
        if (incident.getStatus() == IncidentStatus.TRIGGERED) {
            incident.setStatus(IncidentStatus.ACKNOWLEDGED);
            incident.setAcknowledgedAt(LocalDateTime.now());
        }

        return mapToResponse(incidentRepository.save(incident));
    }

    // 9. Resolve Incident (Lifecycle step: -> RESOLVED)
    public IncidentResponse resolveIncident(Long id, ResolveIncidentRequest request) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));

        incident.setStatus(IncidentStatus.RESOLVED);
        incident.setRootCause(request.getRootCause());
        incident.setResolutionSummary(request.getResolutionSummary());
        incident.setResolvedAt(LocalDateTime.now());

        return mapToResponse(incidentRepository.save(incident));
    }

    // 10. Close Incident (Lifecycle step: RESOLVED -> CLOSED)
    public IncidentResponse closeIncident(Long id) {
        Incident incident = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with id: " + id));

        incident.setStatus(IncidentStatus.CLOSED);
        incident.setClosedAt(LocalDateTime.now());

        return mapToResponse(incidentRepository.save(incident));
    }

    // Helper: Auto-generate unique human-friendly Incident Number (e.g. INC-20260907-4821)
    private String generateUniqueIncidentNumber() {
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String incidentNumber;
        Random random = new Random();

        do {
            int randomSuffix = 1000 + random.nextInt(9000);
            incidentNumber = "INC-" + datePart + "-" + randomSuffix;
        } while (incidentRepository.existsByIncidentNumber(incidentNumber));

        return incidentNumber;
    }

    // Helper: Entity to DTO Mapper
    private IncidentResponse mapToResponse(Incident incident) {
        return IncidentResponse.builder()
                .id(incident.getId())
                .incidentNumber(incident.getIncidentNumber())
                .title(incident.getTitle())
                .description(incident.getDescription())
                .severity(incident.getSeverity())
                .status(incident.getStatus())
                .priority(incident.getPriority())
                .serviceName(incident.getServiceName())
                .assignedTo(incident.getAssignedTo())
                .createdBy(incident.getCreatedBy())
                .rootCause(incident.getRootCause())
                .resolutionSummary(incident.getResolutionSummary())
                .triggeredAt(incident.getTriggeredAt())
                .acknowledgedAt(incident.getAcknowledgedAt())
                .resolvedAt(incident.getResolvedAt())
                .closedAt(incident.getClosedAt())
                .createdAt(incident.getCreatedAt())
                .updatedAt(incident.getUpdatedAt())
                .build();
    }
}