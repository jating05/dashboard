package com.deploymenttracker.deployment_tracker.service;

import com.deploymenttracker.deployment_tracker.model.ConflictInfo;
import com.deploymenttracker.deployment_tracker.model.ConflictStatus;
import com.deploymenttracker.deployment_tracker.model.ImpactedChannel;
import com.deploymenttracker.deployment_tracker.model.InputInfo;
import com.deploymenttracker.deployment_tracker.repository.ConflictInfoRepository;
import com.deploymenttracker.deployment_tracker.repository.ImpactedChannelRepository;
import com.deploymenttracker.deployment_tracker.repository.InputInfoRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DeploymentService {

    private static final Logger logger = LoggerFactory.getLogger(DeploymentService.class);

    @Autowired
    private InputInfoRepository inputInfoRepository;

    @Autowired
    private ImpactedChannelRepository impactedChannelRepository;

    @Autowired
    private ConflictInfoRepository conflictInfoRepository;

    @Transactional
    public DeploymentResponse submitDeployment(InputInfo inputInfo) {
        logger.info("Submitting deployment for OBN: {}", inputInfo.getObn());

        if (inputInfo.getDeplEndDate().isBefore(inputInfo.getDeplStartDate())) {
            throw new IllegalArgumentException("Deployment end date cannot be before start date.");
        }

        List<ImpactedChannel> channels = inputInfo.getImpactedChannels();
        if (channels == null || channels.isEmpty()) {
            throw new IllegalArgumentException("Impacted Channels cannot be empty.");
        }

        channels.forEach(channel -> channel.setInputInfo(inputInfo));
        InputInfo savedInputInfo = inputInfoRepository.save(inputInfo);
        logger.info("Saved deployment with logId: {}", savedInputInfo.getLogId());

        List<String> channelNames = savedInputInfo.getImpactedChannels().stream()
                .map(ImpactedChannel::getChannel)
                .collect(Collectors.toList());

        List<InputInfo> conflictingDeployments = inputInfoRepository.findConflictingDeployments(
                savedInputInfo.getLogId(),
                savedInputInfo.getDeplStartDate(),
                savedInputInfo.getDeplEndDate(),
                channelNames
        );

        ConflictInfo conflictInfo = new ConflictInfo();
        conflictInfo.setInputInfo(savedInputInfo);

        if (conflictingDeployments.isEmpty()) {
            conflictInfo.setConflictStatus(ConflictStatus.NO_CONFLICT);
            conflictInfo.setConflictProof(null);
            logger.info("No conflicts found for deployment logId: {}", savedInputInfo.getLogId());
        } else {
            conflictInfo.setConflictStatus(ConflictStatus.CONFLICT_PROOF_PENDING);
            conflictInfo.setConflictProof(null);
            conflictingDeployments.forEach(conflict -> {
                // Log conflicting deployments if needed
            });
        }

        conflictInfoRepository.save(conflictInfo);

        if (conflictingDeployments.isEmpty()) {
            return new DeploymentResponse(false, null);
        } else {
            return new DeploymentResponse(true, conflictingDeployments);
        }
    }

    @Transactional
    public String uploadProof(Integer logId, MultipartFile file) {
        logger.info("Uploading proof for logId: {}", logId);
        Optional<ConflictInfo> conflictInfoOpt = conflictInfoRepository.findById(logId);
        if (!conflictInfoOpt.isPresent()) {
            throw new NoSuchElementException("Deployment not found.");
        }

        ConflictInfo conflictInfo = conflictInfoOpt.get();
        if (conflictInfo.getConflictStatus() != ConflictStatus.CONFLICT_PROOF_PENDING) {
            throw new IllegalStateException("No conflict proof is pending for this deployment.");
        }

        try {
            conflictInfo.setConflictProof(file.getBytes());
            conflictInfo.setConflictStatus(ConflictStatus.CONFLICT_PROOF_UPLOADED);
            conflictInfoRepository.save(conflictInfo);
            logger.info("Proof uploaded successfully for logId: {}", logId);
            return "Proof uploaded successfully.";
        } catch (IOException e) {
            throw new RuntimeException("Error uploading proof.");
        }
    }

    @Transactional
    public List<DeploymentDetails> getAllDeployments() {
        List<InputInfo> deployments = inputInfoRepository.findAll();
        List<DeploymentDetails> deploymentDetailsList = new ArrayList<>();

        for (InputInfo deployment : deployments) {
            ConflictInfo conflictInfo = conflictInfoRepository.findById(deployment.getLogId()).orElse(null);
            DeploymentDetails details = new DeploymentDetails(deployment, conflictInfo);
            deploymentDetailsList.add(details);
        }

        return deploymentDetailsList;
    }

    @Transactional
    public DeploymentDetails getDeploymentById(Integer logId) {
        Optional<InputInfo> deploymentOpt = inputInfoRepository.findById(logId);
        if (!deploymentOpt.isPresent()) {
            logger.error("Deployment not found for logId: {}", logId);
            throw new NoSuchElementException("Deployment not found.");
        }

        InputInfo deployment = deploymentOpt.get();
        ConflictInfo conflictInfo = conflictInfoRepository.findById(logId).orElse(null);
        return new DeploymentDetails(deployment, conflictInfo);
    }

    public List<String> getImpactedChannelsList() {
        return Arrays.asList("Apply", "Lilac", "Mobile", "Reward", "Onboard");
    }

    @Transactional
    public ConflictInfo getConflictInfoByLogId(Integer logId) {
        return conflictInfoRepository.findById(logId).orElse(null);
    }
}