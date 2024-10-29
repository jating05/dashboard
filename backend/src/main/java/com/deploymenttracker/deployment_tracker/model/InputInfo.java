package com.deploymenttracker.deployment_tracker.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.annotation.processing.Generated;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InputInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer logId;

    private String obn;
    private String projectName;
    private LocalDate goLiveDate;
    private LocalDate deplStartDate;
    private LocalDate deplEndDate;
    private String devName;
    private String qeName;

    @OneToMany(mappedBy = "inputInfo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ImpactedChannel> impactedChannels;

    public List<ImpactedChannel> getImpactedChannels() {
        return impactedChannels;
    }

    public void setImpactedChannels(List<ImpactedChannel> impactedChannels) {
        this.impactedChannels = impactedChannels;
    }

}
