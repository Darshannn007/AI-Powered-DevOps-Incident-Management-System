package com.apdims.enums;

public enum IncidentStatus {
    TRIGGERED,      // Alert -> incident created
    ACKNOWLEDGED,   // Engineer acknowledged
    INVESTIGATING,  //Root cause analysis
    IDENTIFIED,     // Problem identified
    MONITORING,     // Fixed, verifying
    RESOLVED,       // Problem resolved
    CLOSED          // Post-mortem complete
}