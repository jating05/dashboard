document.addEventListener('DOMContentLoaded', function() {
    // Dummy data for Partners and CPCs
    const partnerCPCData = {
        "Partner1": ["CPC1", "CPC2"],
        "Partner2": ["CPC3", "CPC4"],
        "Partner3": ["CPC5", "CPC6"]
    };

    const allCPCs = [];
    for (const [partner, cpcs] of Object.entries(partnerCPCData)) {
        cpcs.forEach(cpc => {
            allCPCs.push(`${partner}: ${cpc}`);
        });
    }

    // Populate Partner dropdown from backend (dummy API)
    function fetchPartners() {
        // Dummy API call - replace with actual API endpoint
        // Input: None
        // Output: Partner-CPC mapping
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(partnerCPCData);
            }, 500);
        });
    }

    fetchPartners().then(data => {
        const partnerSelect = document.getElementById('partner');
        for (const partner in data) {
            const option = document.createElement('option');
            option.value = partner;
            option.textContent = partner;
            partnerSelect.appendChild(option);
        }
    });

    // Handle Partner selection to populate CPCs
    document.getElementById('partner').addEventListener('change', function() {
        const selectedPartner = this.value;
        const cpcSelect = document.getElementById('cpc');
        cpcSelect.innerHTML = '<option value="" selected>-- Select CPC --</option>'; // Reset

        if (selectedPartner) {
            // Populate CPCs related to the selected partner
            partnerCPCData[selectedPartner].forEach(cpc => {
                const option = document.createElement('option');
                option.value = cpc;
                option.textContent = cpc;
                cpcSelect.appendChild(option);
            });
        } else {
            // If no partner selected, show all CPCs with partner prefix
            allCPCs.forEach(cpc => {
                const option = document.createElement('option');
                option.value = cpc;
                option.textContent = cpc;
                cpcSelect.appendChild(option);
            });
        }
    });

    // Ensure only one radio button is selected for 'Have a SSN'
    const haveSSNYes = document.getElementById('haveSSNYes');
    const haveSSNNo = document.getElementById('haveSSNNo');

    haveSSNYes.addEventListener('change', function() {
        if (this.checked) {
            haveSSNNo.checked = false;
        }
    });

    haveSSNNo.addEventListener('change', function() {
        if (this.checked) {
            haveSSNYes.checked = false;
            autoGenerateSSN(); // Automatically generate SSN
        }
    });

    // Handle Autogenerate SSN button click
    document.getElementById('autoGenerateSSN').addEventListener('click', function() {
        autoGenerateSSN();
    });

    /**
     * Generates a random 7-digit SSN and populates the SSN field.
     */
    function autoGenerateSSN() {
        const ssnField = document.getElementById('ssn');
        const randomSSN = Math.floor(1000000 + Math.random() * 9000000);
        ssnField.value = randomSSN;
    }

    // Ensure only one checkbox is selected for 'Condition For'
    const conditionLoans = document.getElementById('conditionLoans');
    const conditionGeneric = document.getElementById('conditionGeneric');

    conditionLoans.addEventListener('change', function() {
        if (this.checked) {
            conditionGeneric.checked = false;
            handleConditionFor('Loans');
            autopopulateLoans(); // Automatically fill personal details
        } else {
            handleConditionFor(null);
        }
    });

    conditionGeneric.addEventListener('change', function() {
        if (this.checked) {
            conditionLoans.checked = false;
            handleConditionFor('Generic');
        } else {
            handleConditionFor(null);
        }
    });

    /**
     * Handles the UI changes based on the selected 'Condition For' option.
     * @param {string|null} condition - 'Loans', 'Generic', or null
     */
    function handleConditionFor(condition) {
        const personalDetails = document.getElementById('personalDetails');

        if (condition === 'Loans') {
            // Disable and fade personal details fields
            personalDetails.classList.add('faded');
            disablePersonalDetails(true);
        } else if (condition === 'Generic') {
            // Enable and remove fade from personal details fields
            personalDetails.classList.remove('faded');
            disablePersonalDetails(false);
        } else {
            // No selection; enable fields
            personalDetails.classList.remove('faded');
            disablePersonalDetails(false);
        }
    }

    /**
     * Enables or disables the personal details fields.
     * @param {boolean} disable - Whether to disable the fields
     */
    function disablePersonalDetails(disable) {
        const fields = document.querySelectorAll('#personalDetails input');
        fields.forEach(field => {
            field.disabled = disable;
        });
    }

    // Handle AutoPopulate button click
    document.getElementById('autoPopulateBtn').addEventListener('click', function() {
        const conditionLoans = document.getElementById('conditionLoans').checked;
        const conditionGeneric = document.getElementById('conditionGeneric').checked;

        if (conditionLoans) {
            autopopulateLoans();
        } else if (conditionGeneric) {
            autopopulateGeneric();
        } else {
            alert('Please select a Condition For option.');
        }
    });

    /**
     * Autopopulates the form with fixed values for Loans.
     */
    function autopopulateLoans() {
        document.getElementById('firstName').value = 'bcus';
        document.getElementById('lastName').value = 'Cltest';
        document.getElementById('dob').value = '1994-09-09';
        document.getElementById('address1').value = '';
        document.getElementById('address2').value = '';
        document.getElementById('zipcode').value = '';
        document.getElementById('email').value = '';
    }

    /**
     * Autopopulates the form with random values for Generic.
     */
    function autopopulateGeneric() {
        document.getElementById('firstName').value = getRandomFirstName();
        document.getElementById('lastName').value = getRandomLastName();
        document.getElementById('dob').value = getRandomDOB();
        document.getElementById('address1').value = getRandomAddress1();
        document.getElementById('address2').value = getRandomAddress2();
        document.getElementById('zipcode').value = getRandomZipcode();
        document.getElementById('email').value = getRandomEmail();
    }

    // Dummy functions to generate random data
    function getRandomFirstName() {
        const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Emily', 'Daniel', 'Sophia'];
        return firstNames[Math.floor(Math.random() * firstNames.length)];
    }

    function getRandomLastName() {
        const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson'];
        return lastNames[Math.floor(Math.random() * lastNames.length)];
    }

    function getRandomDOB() {
        const start = new Date(1970, 0, 1);
        const end = new Date(2000, 11, 31);
        const dob = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        return dob.toISOString().split('T')[0];
    }

    function getRandomAddress1() {
        const addresses = ['123 Main St', '456 Elm St', '789 Oak St', '321 Pine St', '654 Maple St', '987 Cedar Ave'];
        return addresses[Math.floor(Math.random() * addresses.length)];
    }

    function getRandomAddress2() {
        const addresses = ['Apt 1', 'Suite 200', 'Floor 3', 'Unit 4B', '', ''];
        return addresses[Math.floor(Math.random() * addresses.length)];
    }

    function getRandomZipcode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    function getRandomEmail() {
        const domains = ['example.com', 'mail.com', 'test.org', 'demo.net', 'genie.com'];
        const firstName = getRandomFirstName().toLowerCase();
        const lastName = getRandomLastName().toLowerCase();
        const domain = domains[Math.floor(Math.random() * domains.length)];
        return `${firstName}.${lastName}@${domain}`;
    }

    // Handle form submission
    document.getElementById('applyGenieForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const formData = {
            environment: document.getElementById('environment').value,
            partner: document.getElementById('partner').value || null,
            cpc: document.getElementById('cpc').value,
            haveSSN: haveSSNYes.checked ? 'Yes' : haveSSNNo.checked ? 'No' : null,
            ssn: document.getElementById('ssn').value,
            conditionFor: conditionLoans.checked ? 'Loans' : conditionGeneric.checked ? 'Generic' : null,
            personalDetails: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                dob: document.getElementById('dob').value,
                address1: document.getElementById('address1').value,
                address2: document.getElementById('address2').value,
                zipcode: document.getElementById('zipcode').value,
                email: document.getElementById('email').value
            }
        };

        // Validate mandatory fields
        if (!formData.cpc) {
            alert('CPC is mandatory.');
            return;
        }
        if (!formData.conditionFor) {
            alert('Condition For is mandatory.');
            return;
        }
        if (!formData.haveSSN) {
            alert('Please select if you have a SSN.');
            return;
        }
        if (!formData.ssn) {
            alert('SSN is mandatory.');
            return;
        }

        // Send form data to dummy API endpoint
        sendFormData(formData).then(response => {
            alert('Form submitted successfully!');
            console.log('Response:', response);
            // Reset form if needed
            // document.getElementById('applyGenieForm').reset();
        }).catch(error => {
            alert('Error submitting form.');
            console.error('Error:', error);
        });
    });

    /**
     * Sends form data to a dummy API endpoint.
     * @param {Object} data - The form data to send
     * @returns {Promise} - Resolves with API response
     */
    function sendFormData(data) {
        // Replace the URL with your actual API endpoint
        const apiUrl = 'https://dummyapi.example.com/submit';

        return fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the API returns JSON
        });
    }

    // Handle 'Apply and Register' button click
    document.getElementById('applyRegisterBtn').addEventListener('click', function() {
        // Trigger form submission
        document.getElementById('applyGenieForm').dispatchEvent(new Event('submit'));

        // After successful submission, implement registration logic
        // For demonstration, we'll show an alert
        alert('Registration process initiated.');
    });

    // Dark Mode Toggle Functionality
    const themeSwitch = document.getElementById('themeSwitch');

    // Check for saved user preference, if any, on load of the website
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
});
