package com.deploymenttracker.deployment_tracker.repository;

import com.deploymenttracker.deployment_tracker.model.ConflictInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConflictInfoRepository extends JpaRepository<ConflictInfo, Integer> {
    // Custom query methods if needed
}