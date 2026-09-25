package com.apdims.service;

import com.apdims.entity.Incident;
import com.apdims.enums.IncidentSeverity;
import com.apdims.enums.IncidentStatus;
import com.apdims.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * SLA Escalation Service — Har 1 minute mein check karta hai:
 *
 * - CRITICAL incident → 15 min mein acknowledge nahi hua? → ESCALATE + Slack Alert
 * - HIGH incident     → 30 min mein acknowledge nahi hua? → ESCALATE + Slack Alert
 *
 * Yeh service Spring Scheduler use karti hai (@Scheduled annotation)
 * Jo har 60 seconds mein automatically chalti hai.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SlaEscalationService {

    private final IncidentRepository incidentRepository;
    private final SlackNotificationService slackNotificationService;

    // SLA Deadlines (minutes mein)
    private static final long CRITICAL_SLA_MINUTES = 15;  // CRITICAL → 15 min
    private static final long HIGH_SLA_MINUTES = 30;       // HIGH → 30 min

    /**
     * Yeh method har 60 seconds (1 minute) mein automatically chalti hai.
     * 
     * Kya karti hai:
     * 1. Database mein dekhti hai — koi TRIGGERED (un-acknowledged) incident hai jo SLA se purana hai?
     * 2. Agar hai → usko escalated = true mark karti hai
     * 3. Slack pe alert bhejti hai — "bhai yeh incident 15 min se pada hua hai!"
     */
    @Scheduled(fixedRate = 60000)  // 60000 ms = 1 minute
    @Transactional
    public void checkAndEscalate() {
        log.debug("⏰ SLA Escalation check running...");

        // 1. CRITICAL incidents check — jo 15 min se zyada purane hain aur TRIGGERED hain
        escalateByRule(
                IncidentSeverity.CRITICAL,
                CRITICAL_SLA_MINUTES
        );

        // 2. HIGH incidents check — jo 30 min se zyada purane hain aur TRIGGERED hain
        escalateByRule(
                IncidentSeverity.HIGH,
                HIGH_SLA_MINUTES
        );
    }

    /**
     * Ek severity ke liye SLA breach check karta hai.
     *
     * @param severity — CRITICAL ya HIGH
     * @param slaMinutes — kitne minutes ka SLA hai (15 ya 30)
     */
    private void escalateByRule(IncidentSeverity severity, long slaMinutes) {
        // Cutoff time calculate karo — "abhi se 15 min pehle ka time"
        // Matlab: agar incident 15 min pehle se bhi pehle bana tha → SLA breach!
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(slaMinutes);

        // Database se find karo — TRIGGERED + is severity + created before cutoff + not yet escalated
        List<Incident> breachedIncidents = incidentRepository.findSlaBreachedIncidents(
                IncidentStatus.TRIGGERED,
                severity,
                cutoffTime
        );

        // Har breached incident ke liye:
        for (Incident incident : breachedIncidents) {
            // Kitne minutes se SLA breach hua calculate karo
            long minutesSinceCreation = ChronoUnit.MINUTES.between(incident.getCreatedAt(), LocalDateTime.now());
            long minutesBreached = minutesSinceCreation - slaMinutes;

            // Incident ko escalated mark karo
            incident.setEscalated(true);
            incident.setEscalationCount(incident.getEscalationCount() + 1);
            incidentRepository.save(incident);

            // Slack pe alert bhejo
            slackNotificationService.sendSlaEscalationNotification(incident, minutesBreached);

            log.warn("🚨 SLA ESCALATION: Incident [{}] (Severity: {}) breached SLA by {} minutes. " +
                            "Created at: {}, SLA limit: {} min",
                    incident.getIncidentNumber(),
                    severity,
                    minutesBreached,
                    incident.getCreatedAt(),
                    slaMinutes
            );
        }

        if (!breachedIncidents.isEmpty()) {
            log.info("⚡ SLA Escalation: {} {} incidents escalated", breachedIncidents.size(), severity);
        }
    }
}
