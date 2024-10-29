const API_BASE_URL = 'http://localhost:8080/api/deployments';

/**
 * Submits a new deployment.
 * @param {Object} data - The deployment data.
 * @returns {Promise<Object>} - The response from the server.
 */
async function submitDeployment(data) {
    const response = await fetch(`${API_BASE_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit deployment.');
    }
    return response.json();
}

/**
 * Retrieves all deployments.
 * @returns {Promise<Array>} - List of deployments.
 */
async function getAllDeployments() {
    const response = await fetch(`${API_BASE_URL}/all`);
    if (!response.ok) {
        throw new Error('Failed to fetch deployments.');
    }
    return response.json();
}

/**
 * Uploads proof for a deployment.
 * @param {number} logId - The logId of the deployment.
 * @param {File} file - The proof file.
 * @returns {Promise<string>} - Success message.
 */
async function uploadProof(logId, file) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE_URL}/uploadProof/${logId}`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload proof.');
    }
    return response.text();
}

/**
 * Retrieves the list of impacted channels.
 * @returns {Promise<Array>} - List of channels.
 */
async function getImpactedChannels() {
    const response = await fetch(`${API_BASE_URL}/channels`);
    if (!response.ok) {
        throw new Error('Failed to fetch impacted channels.');
    }
    return response.json();
}

/**
 * Retrieves proof image for a deployment.
 * @param {number} logId - The logId of the deployment.
 * @returns {Promise<Blob>} - The proof image as a blob.
 */
async function getProof(logId) {
    const response = await fetch(`${API_BASE_URL}/proof/${logId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch proof.');
    }
    return response.blob();
}
