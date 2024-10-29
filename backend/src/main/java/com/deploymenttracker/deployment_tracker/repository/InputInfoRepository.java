package com.deploymenttracker.deployment_tracker.repository;

import com.deploymenttracker.deployment_tracker.model.InputInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

public interface InputInfoRepository extends JpaRepository<InputInfo, Integer> {

    /**
     * Finds deployments that conflict with the given dates and channels.
     *
     * @param currentLogId   The logId of the current deployment to exclude.
     * @param deplStartDate  Deployment start date to check overlap.
     * @param deplEndDate    Deployment end date to check overlap.
     * @param channels       List of channels to check for overlap.
     * @return List of conflicting deployments.
     */
    @Query("SELECT DISTINCT i FROM InputInfo i JOIN i.impactedChannels c " +
            "WHERE i.logId <> :currentLogId " +
            "AND (i.deplStartDate <= :deplEndDate AND i.deplEndDate >= :deplStartDate) " +
            "AND c.channel IN :channels")
    List<InputInfo> findConflictingDeployments(@Param("currentLogId") Integer currentLogId,
                                               @Param("deplStartDate") LocalDate deplStartDate,
                                               @Param("deplEndDate") LocalDate deplEndDate,
                                               @Param("channels") List<String> channels);
}
