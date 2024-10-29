package com.deploymenttracker.deployment_tracker.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "impacted_channel")
public class ImpactedChannel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String channel;

    @ManyToOne
    @JoinColumn(name = "log_id")
    @JsonBackReference
    private InputInfo inputInfo;

}