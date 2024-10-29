package com.deploymenttracker.deployment_tracker.service;

import com.deploymenttracker.deployment_tracker.model.InputInfo;

import java.util.List;

public class DeploymentResponse {
    private boolean hasConflict;
    private List<InputInfo> conflictingDeployments;

    public DeploymentResponse(boolean hasConflict, List<InputInfo> conflictingDeployments) {
        this.hasConflict = hasConflict;
        this.conflictingDeployments = conflictingDeployments;
    }

    // Getters and Setters

    public boolean isHasConflict() {
        return hasConflict;
    }

    public void setHasConflict(boolean hasConflict) {
        this.hasConflict = hasConflict;
    }

    public List<InputInfo> getConflictingDeployments() {
        return conflictingDeployments;
    }

    public void setConflictingDeployments(List<InputInfo> conflictingDeployments) {
        this.conflictingDeployments = conflictingDeployments;
    }
}