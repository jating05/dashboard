package com.deploymenttracker.deployment_tracker.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeploymentRequest {
    private String obn;
    private String projectName;
    private LocalDate goLiveDate;
    private LocalDate deplStartDate;
    private LocalDate deplEndDate;
    private String devName;
    private String qeName;
    private List<String> impactedChannels;

}