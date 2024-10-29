package com.deploymenttracker.deployment_tracker.model;

import jakarta.persistence.*;

import java.net.ProtocolFamily;

@Entity
public class ConflictInfo {
    @Id
    private Integer logId;

    @Enumerated(EnumType.STRING)
    private ConflictStatus conflictStatus;

    @Lob
    private byte[] conflictProof;

    @OneToOne
    @MapsId
    @JoinColumn(name = "log_id")
    private InputInfo inputInfo;

    // Getters and Setters

    public Integer getLogId() {
        return logId;
    }

    public void setLogId(Integer logId) {
        this.logId = logId;
    }

    public ConflictStatus getConflictStatus() {
        return conflictStatus;
    }

    public void setConflictStatus(ConflictStatus conflictStatus) {
        this.conflictStatus = conflictStatus;
    }

    public byte[] getConflictProof() {
        return conflictProof;
    }

    public void setConflictProof(byte[] conflictProof) {
        this.conflictProof = conflictProof;
    }

    public InputInfo getInputInfo() {
        return inputInfo;
    }

    public void setInputInfo(InputInfo inputInfo) {
        this.inputInfo = inputInfo;
    }
}