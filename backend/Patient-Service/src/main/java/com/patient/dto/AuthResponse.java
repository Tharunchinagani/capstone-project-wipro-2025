package com.patient.dto;

public class AuthResponse {
    private String token;
    private Long patientId;  // Add patientId

    public AuthResponse() {}

    public AuthResponse(String token, Long patientId) {
        this.token = token;
        this.patientId = patientId;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
}
