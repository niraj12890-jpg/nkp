/* NOVAACADEMY - Client-Side JavaScript */

// =========================================================================
// ⚠️ सेटअप आवश्यक (SETUP REQUIRED) 
// =========================================================================
// 1. Google Apps Script Deployment URL (Replace with your actual URL)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwaNOLieWvfDZE8fLZ0HxHMeM0MjbSl_2PrEZefb_3ieyZO3Hfd-0QEUbszaSVpHE0WMg/exec'; 

// 2. Secret API Key (MUST match the Key used in your Apps Script code!)
const API_KEY = "vand_nkp@2025"; // <--- Replace with your actual SECRET_API_KEY
// =========================================================================

document.addEventListener('DOMContentLoaded', function () {
    
    // --- Counter Logic ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const updateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        
        // Calculate increment step
        const inc = target / speed;

        if (count < target) {
            // Round up to keep it a whole number
            counter.innerText = Math.ceil(count + inc);
            setTimeout(() => updateCounter(counter), 1);
        } else {
            counter.innerText = target;
        }
    };

    const counterSection = document.querySelector('.counter-section');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(updateCounter);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    observer.observe(counterSection);

    // --- Workshop Registration Modal Opener ---
    const registrationModal = new bootstrap.Modal(document.getElementById('registrationModal'));
    const registerButtons = document.querySelectorAll('.register-btn');
    const workshopTitleSpan = document.getElementById('workshopTitle');
    const workshopRegisteredInput = document.getElementById('workshopRegistered');

    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const workshopName = this.getAttribute('data-workshop');
            workshopTitleSpan.textContent = workshopName;
            workshopRegisteredInput.value = workshopName; // Hidden input value set
            
            // Clear previous message and reset form on opening
            document.getElementById('registrationMessage').classList.add('d-none');
            document.getElementById('registrationForm').reset();
            
            registrationModal.show();
        });
    });

    // --- Gallery Image Lightbox Logic ---
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    const fullImage = document.getElementById('fullImage');
    const galleryImages = document.querySelectorAll('#gallery img');

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const imageUrl = this.getAttribute('data-img-url');
            fullImage.src = imageUrl;
            imageModal.show();
        });
    });
    
    // --- Scroll to Top Logic ---
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    };


    // =========================================================
    // --- Form Submission Logic (Centralized Function) ---
    // =========================================================

    function setFormState(form, isSubmitting) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (isSubmitting) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = (form.getAttribute('data-form-type') === 'Registration') ? 'Complete Registration' : 'Submit Enquiry';
        }
    }

    function displayMessage(messageEl, type, text) {
        messageEl.classList.remove('d-none', 'alert-success', 'alert-danger');
        messageEl.classList.add(`alert-${type}`);
        messageEl.textContent = text;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageEl.classList.add('d-none');
        }, 5000);
    }

    function submitForm(event) {
        event.preventDefault();
        const form = event.target;
        const formType = form.getAttribute('data-form-type');
        const messageEl = document.getElementById(formType.toLowerCase() + 'Message') || form.nextElementSibling;

        // 1. Build FormData object
        const formData = new FormData(form);
        const data = {};
        
        // Convert FormData to plain object
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Add required parameters (API Key and Form Type are crucial)
        data.formType = formType;
        data.API_KEY = API_KEY; 

        // 2. Client-side Validation (Basic)
        if (!data.Name || !data.Email) {
            displayMessage(messageEl, 'danger', 'Error: Name and Email are required fields.');
            return;
        }

        setFormState(form, true);

        // 3. Send data to Google Apps Script
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.result === 'success') {
                displayMessage(messageEl, 'success', 
                    `Success! Your ${formType} has been submitted. Thank you!`
                );
                // Reset form on success
                form.reset(); 
                
                // Optionally close modal after successful registration
                if (formType === 'Registration') {
                    // Give user time to read success message before closing modal
                    setTimeout(() => {
                        registrationModal.hide();
                    }, 2000);
                }
                
            } else {
                // Apps Script Error (e.g., API Key Mismatch, Missing Sheet)
                displayMessage(messageEl, 'danger', 
                    `Submission Failed: ${result.message || 'An unknown error occurred on the server.'}`
                );
            }
        })
        .catch(error => {
            // Network or Fetch Error
            console.error('Fetch Error:', error);
            displayMessage(messageEl, 'danger', 'Network error. Please try again later.');
        })
        .finally(() => {
            setFormState(form, false);
        });
    }

    // --- Attach Event Listeners to all forms ---
    
    // 1. Contact Section Enquiry Form
    document.getElementById('enquiryForm').addEventListener('submit', submitForm);
    
    // 2. Modal Enquiry Form
    document.getElementById('modalEnquiryForm').addEventListener('submit', submitForm);

    // 3. Registration Modal Form
    document.getElementById('registrationForm').addEventListener('submit', submitForm);
});
