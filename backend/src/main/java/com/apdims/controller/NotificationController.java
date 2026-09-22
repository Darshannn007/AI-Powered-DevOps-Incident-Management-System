package com.apdims.controller;

import com.apdims.service.SlackNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final SlackNotificationService slackNotificationService;

    @PostMapping("/slack/test")
    public ResponseEntity<Map<String, Object>> testSlack(@RequestParam(defaultValue = "Darshan") String user) {
        log.info("Received request to test Slack notification by [{}]", user);
        boolean sent = slackNotificationService.sendTestNotification(user);

        if (sent) {
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "Test notification sent to Slack channel successfully! Check your Slack workspace."
            ));
        } else {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "FAILED",
                    "message", "Failed to send notification. Please check slack.webhook.url or network connection."
            ));
        }
    }
}
