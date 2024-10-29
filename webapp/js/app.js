document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('deployment-form');
    const impactedChannelsSelect = document.getElementById('impactedChannels');
    const formFeedback = document.getElementById('form-feedback');
    const deploymentsTableBody = document.querySelector('#deployments-table tbody');
    const loadingSpinner = document.getElementById('loading-spinner');
    const conflictModal = new bootstrap.Modal(document.getElementById('conflictModal'));
    const conflictList = document.getElementById('conflict-list');
    const proofUploadInput = document.getElementById('proofUpload');
    const uploadProofBtn = document.getElementById('uploadProofBtn');
    let currentConflictLogId = null;

    // Populate Impacted Channels
    try {
        const channels = await getImpactedChannels();
        channels.forEach(channel => {
            const option = document.createElement('option');
            option.value = channel;
            option.textContent = channel;
            impactedChannelsSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        formFeedback.innerHTML = `<span class="text-danger">❌ Failed to load impacted channels.</span>`;
    }

    // Handle Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formFeedback.innerHTML = '';
        loadingSpinner.style.display = 'block';

        const data = {
            obn: document.getElementById('obn').value.trim(),
            projectName: document.getElementById('projectName').value.trim(),
            goLiveDate: document.getElementById('goLiveDate').value,
            deplStartDate: document.getElementById('deplStartDate').value,
            deplEndDate: document.getElementById('deplEndDate').value,
            devName: document.getElementById('devName').value.trim(),
            qeName: document.getElementById('qeName').value.trim(),
            impactedChannels: Array.from(impactedChannelsSelect.selectedOptions).map(option => option.value)
        };

        // Basic Frontend Validation
        if (data.impactedChannels.length === 0) {
            formFeedback.innerHTML = `<span class="text-danger">❌ Please select at least one impacted channel.</span>`;
            loadingSpinner.style.display = 'none';
            return;
        }

        try {
            const response = await submitDeployment(data);
            loadingSpinner.style.display = 'none';
            if (!response.hasConflict) {
                formFeedback.innerHTML = `<span class="text-success">✅ Deployment submitted successfully with no conflicts.</span>`;
            } else {
                // Show conflict modal with conflicting deployments
                currentConflictLogId = response.conflictingDeployments[0].logId; // Assuming single conflict for simplicity
                conflictList.innerHTML = '';
                response.conflictingDeployments.forEach(dep => {
                    const li = document.createElement('li');
                    li.textContent = `Developer: ${dep.devName}, QE: ${dep.qeName}, OBN: ${dep.obn}`;
                    conflictList.appendChild(li);
                });
                conflictModal.show();
                formFeedback.innerHTML = `<span class="text-warning">⚠️ Conflict detected. Please provide proof.</span>`;
            }
            loadDeployments();
            form.reset();
        } catch (error) {
            console.error(error);
            formFeedback.innerHTML = `<span class="text-danger">❌ ${error.message}</span>`;
            loadingSpinner.style.display = 'none';
        }
    });

    // Handle Proof Upload
    uploadProofBtn.addEventListener('click', async () => {
        const file = proofUploadInput.files[0];
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }
        loadingSpinner.style.display = 'block';
        try {
            const response = await uploadProof(currentConflictLogId, file);
            loadingSpinner.style.display = 'none';
            alert(response);
            conflictModal.hide();
            loadDeployments();
        } catch (error) {
            console.error(error);
            alert(`❌ ${error.message}`);
            loadingSpinner.style.display = 'none';
        }
    });

    // Load Deployments into Dashboard
    async function loadDeployments() {
        deploymentsTableBody.innerHTML = '';
        loadingSpinner.style.display = 'block';
        try {
            const deployments = await getAllDeployments();
            deployments.forEach(dep => {
                const tr = document.createElement('tr');

                // Apply color coding based on conflict status
                if (dep.conflictStatus === 'NO_CONFLICT') {
                    tr.classList.add('no-conflict');
                } else if (dep.conflictStatus === 'CONFLICT_PROOF_PENDING') {
                    tr.classList.add('conflict-pending');
                } else if (dep.conflictStatus === 'CONFLICT_PROOF_UPLOADED') {
                    tr.classList.add('conflict-resolved');
                }

                tr.innerHTML = `
                    <td>${dep.obn}</td>
                    <td>${dep.projectName}</td>
                    <td>${dep.goLiveDate}</td>
                    <td>${dep.deplStartDate}</td>
                    <td>${dep.deplEndDate}</td>
                    <td>${dep.devName}</td>
                    <td>${dep.qeName}</td>
                    <td>${dep.impactedChannels.join(', ')}</td>
                    <td>${formatConflictStatus(dep.conflictStatus)}</td>
                    <td>
                        ${dep.conflictStatus === 'CONFLICT_PROOF_PENDING' || dep.conflictStatus === 'CONFLICT_PROOF_UPLOADED' ?
                            `<button class="btn btn-sm btn-warning upload-proof-btn" data-logid="${dep.logId}">Upload Proof</button>` : ''}
                        ${dep.conflictProofUrl ?
                            `<a href="${dep.conflictProofUrl}" target="_blank" class="btn btn-sm btn-info ms-2">View Proof</a>` : ''}
                    </td>
                `;
                deploymentsTableBody.appendChild(tr);

                // Trigger fade-in animation
                setTimeout(() => {
                    tr.classList.add('visible');
                }, 100);
            });

            // Add event listeners for upload proof buttons
            document.querySelectorAll('.upload-proof-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    currentConflictLogId = e.target.dataset.logid;
                    conflictList.innerHTML = `<p>Uploading proof for Log ID: ${currentConflictLogId}</p>`;
                    conflictModal.show();
                });
            });

            loadingSpinner.style.display = 'none';
        } catch (error) {
            console.error(error);
            formFeedback.innerHTML = `<span class="text-danger">❌ Failed to load deployments.</span>`;
            loadingSpinner.style.display = 'none';
        }
    }

    /**
     * Formats the conflict status for display.
     * @param {string} status - The conflict status.
     * @returns {string} - Formatted status.
     */
    function formatConflictStatus(status) {
        switch(status) {
            case 'NO_CONFLICT':
                return '<span class="badge bg-success">No Conflict</span>';
            case 'CONFLICT_PROOF_PENDING':
                return '<span class="badge bg-warning text-dark">Conflict Proof Pending</span>';
            case 'CONFLICT_PROOF_UPLOADED':
                return '<span class="badge bg-info">Conflict Resolved</span>';
            default:
                return '<span class="badge bg-secondary">Unknown</span>';
        }
    }

    // Initial Load
    loadDeployments();

    // Theme Toggle (Optional)
    const themeToggleBtn = document.getElementById('theme-toggle');
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        document.querySelectorAll('.card').forEach(card => {
            card.classList.toggle('dark-theme');
            card.classList.toggle('light-theme');
        });
    });
});
