package com.deploymenttracker.deployment_tracker.repository;

import com.deploymenttracker.deployment_tracker.model.ImpactedChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImpactedChannelRepository extends JpaRepository<ImpactedChannel, Integer> {

}
