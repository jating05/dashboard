package com.deploymenttracker.deployment_tracker.service;

import com.deploymenttracker.deployment_tracker.model.ConflictInfo;
import com.deploymenttracker.deployment_tracker.model.InputInfo;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public class DeploymentDetails {
    private Integer logId;
    private String obn;
    private String projectName;
    private LocalDate goLiveDate;
    private LocalDate deplStartDate;
    private LocalDate deplEndDate;
    private String devName;
    private String qeName;
    private List<String> impactedChannels;
    private String conflictStatus;
    private String conflictProofUrl; // Endpoint to retrieve the proof image

    public DeploymentDetails(InputInfo inputInfo, ConflictInfo conflictInfo) {
        this.logId = inputInfo.getLogId();
        this.obn = inputInfo.getObn();
        this.projectName = inputInfo.getProjectName();
        this.goLiveDate = inputInfo.getGoLiveDate();
        this.deplStartDate = inputInfo.getDeplStartDate();
        this.deplEndDate = inputInfo.getDeplEndDate();
        this.devName = inputInfo.getDevName();
        this.qeName = inputInfo.getQeName();
        this.impactedChannels = inputInfo.getImpactedChannels().stream()
                .map(impactedChannel -> impactedChannel.getChannel())
                .collect(Collectors.toList());
        if (conflictInfo != null) {
            this.conflictStatus = conflictInfo.getConflictStatus().name();
            if (conflictInfo.getConflictProof() != null) {
                // Assuming a separate endpoint serves the image
                this.conflictProofUrl = "/api/deployments/proof/" + logId;
            } else {
                this.conflictProofUrl = null;
            }
        } else {
            this.conflictStatus = "UNKNOWN";
            this.conflictProofUrl = null;
        }
    }

    // Getters and Setters

    public Integer getLogId() {
        return logId;
    }

    public void setLogId(Integer logId) {
        this.logId = logId;
    }

    public String getObn() {
        return obn;
    }

    public void setObn(String obn) {
        this.obn = obn;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public LocalDate getGoLiveDate() {
        return goLiveDate;
    }

    public void setGoLiveDate(LocalDate goLiveDate) {
        this.goLiveDate = goLiveDate;
    }

    public LocalDate getDeplStartDate() {
        return deplStartDate;
    }

    public void setDeplStartDate(LocalDate deplStartDate) {
        this.deplStartDate = deplStartDate;
    }

    public LocalDate getDeplEndDate() {
        return deplEndDate;
    }

    public void setDeplEndDate(LocalDate deplEndDate) {
        this.deplEndDate = deplEndDate;
    }

    public String getDevName() {
        return devName;
    }

    public void setDevName(String devName) {
        this.devName = devName;
    }

    public String getQeName() {
        return qeName;
    }

    public void setQeName(String qeName) {
        this.qeName = qeName;
    }

    public List<String> getImpactedChannels() {
        return impactedChannels;
    }

    public void setImpactedChannels(List<String> impactedChannels) {
        this.impactedChannels = impactedChannels;
    }

    public String getConflictStatus() {
        return conflictStatus;
    }

    public void setConflictStatus(String conflictStatus) {
        this.conflictStatus = conflictStatus;
    }

    public String getConflictProofUrl() {
        return conflictProofUrl;
    }

    public void setConflictProofUrl(String conflictProofUrl) {
        this.conflictProofUrl = conflictProofUrl;
    }
}