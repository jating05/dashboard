package com.deploymenttracker.deployment_tracker.controller;

import com.deploymenttracker.deployment_tracker.dto.DeploymentRequest;
import com.deploymenttracker.deployment_tracker.model.ConflictInfo;
import com.deploymenttracker.deployment_tracker.model.ImpactedChannel;
import com.deploymenttracker.deployment_tracker.model.InputInfo;
import com.deploymenttracker.deployment_tracker.service.DeploymentDetails;
import com.deploymenttracker.deployment_tracker.service.DeploymentResponse;
import com.deploymenttracker.deployment_tracker.service.DeploymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deployments")
@CrossOrigin(origins = "*")
public class DeploymentController {

    @Autowired
    private DeploymentService deploymentService;

    /**
     * Submits a new deployment.
     * @param request The deployment request payload.
     * @return DeploymentResponse indicating conflict status.
     */
    @PostMapping("/submit")
    public ResponseEntity<DeploymentResponse> submitDeployment(@RequestBody DeploymentRequest request) {
        // Map DeploymentRequest to InputInfo and ImpactedChannel entities
        InputInfo inputInfo = new InputInfo();
        inputInfo.setObn(request.getObn());
        inputInfo.setProjectName(request.getProjectName());
        inputInfo.setGoLiveDate(request.getGoLiveDate());
        inputInfo.setDeplStartDate(request.getDeplStartDate());
        inputInfo.setDeplEndDate(request.getDeplEndDate());
        inputInfo.setDevName(request.getDevName());
        inputInfo.setQeName(request.getQeName());

        List<ImpactedChannel> impactedChannels = request.getImpactedChannels().stream()
                .map(channel -> {
                    ImpactedChannel ic = new ImpactedChannel();
                    ic.setChannel(channel);
                    return ic;
                })
                .collect(Collectors.toList());

        inputInfo.setImpactedChannels(impactedChannels);

        DeploymentResponse response = deploymentService.submitDeployment(inputInfo);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves all deployments.
     * @return List of DeploymentDetails.
     */
    @GetMapping("/all")
    public ResponseEntity<List<DeploymentDetails>> getAllDeployments() {
        List<DeploymentDetails> deployments = deploymentService.getAllDeployments();
        return ResponseEntity.ok(deployments);
    }

    /**
     * Uploads proof for a conflicting deployment.
     * @param logId The logId of the deployment.
     * @param file The proof file.
     * @return A message indicating success.
     */
    @PostMapping("/uploadProof/{logId}")
    public ResponseEntity<String> uploadProof(@PathVariable Integer logId, @RequestParam("file") MultipartFile file) {
        String response = deploymentService.uploadProof(logId, file);
        return ResponseEntity.ok(response);
    }

    /**
     * Retrieves proof image for a deployment.
     * @param logId The logId of the deployment.
     * @return The image bytes.
     */
    @GetMapping("/proof/{logId}")
    public ResponseEntity<byte[]> getProof(@PathVariable Integer logId) {
        ConflictInfo conflictInfo = deploymentService.getConflictInfoByLogId(logId);
        if (conflictInfo == null || conflictInfo.getConflictProof() == null) {
            return ResponseEntity.notFound().build();
        }
        // Determine content type dynamically or set a default
        return ResponseEntity.ok()
                .header("Content-Type", "image/jpeg") // Adjust based on your needs
                .body(conflictInfo.getConflictProof());
    }

    /**
     * Retrieves the list of impacted channels.
     * @return List of channels.
     */
    @GetMapping("/channels")
    public ResponseEntity<List<String>> getImpactedChannels() {
        List<String> channels = deploymentService.getImpactedChannelsList();
        return ResponseEntity.ok(channels);
    }

}