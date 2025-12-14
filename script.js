// Ensure this is your deployed Web App URL from Google Apps Script
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwuqLR5rTuifEo0iyrfnqCMSXW6n9z-r9NDSl9DHsYuci2TliXpoAdy_KCTL2Uh_aGprg/exec';

// ---------- Search logic (Updated with UX improvement) ----------
document.getElementById('searchBtn').addEventListener('click', function(){
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchMessage = document.getElementById('searchMessage'); // Assuming this ID exists in index.html
    let resultsFound = 0; 

    if(!q) {
        // If search is empty, show all items and hide message
        searchMessage.style.display = 'none';
        document.querySelectorAll('#workshops .card, #training .trainer-card, #past-workshops .card').forEach(item => {
            item.style.display = '';
        });
        return;
    }

    const workshops = document.querySelectorAll('#workshops .card');
    const trainers = document.querySelectorAll('#training .trainer-card');
    const past = document.querySelectorAll('#past-workshops .card');
    const all = [...workshops, ...trainers, ...past];

    all.forEach(item => {
        const text = item.innerText.toLowerCase();
        const match = text.includes(q);
        
        // Show item if text contains query, otherwise hide it
        item.style.display = match ? '' : 'none';
        
        if (match) {
            resultsFound++; // Increment counter if match found
        }
    });
    
    // Display or hide message based on results
    if (resultsFound > 0) {
        searchMessage.style.display = 'none';
    } else {
        searchMessage.style.display = 'block';
    }
});
document.getElementById('searchInput').addEventListener('keypress', function(e){
    if(e.key === 'Enter') document.getElementById('searchBtn').click();
});

// ---------- Popup helpers (No change needed) ----------
function openPopup(id){
    const popup = document.getElementById(id);
    if(popup) popup.style.display = 'flex';
}
function closePopup(id){
    const popup = document.getElementById(id);
    if(popup) popup.style.display = 'none';
}
window.openPopup = openPopup;
window.closePopup = closePopup;
// ---------- Scroll To Top Logic (New) ----------
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Show button after scrolling 300px
        scrollToTopBtn.classList.add('show');
    } else {
        scrollToTopBtn.classList.remove('show');
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scroll animation
    });
});

// ---------- Workshop detailed data (No change needed) ----------
const workshopData = {
    xps: { title:"XPS Data Analysis Workshop", img:"images/w1.png", pdf:"#", desc:"Comprehensive XPS fundamentals, instrumentation & peak fitting with hands-on datasets.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2999." },
    electro: { title:"Electrochemical Data Analysis", img:"images/w2.png", pdf:"#", desc:"EIS, CV, LSV, GCD, Nyquist & case studies for batteries & catalysis.\n\nDuration: 1–2 Weeks\nMode: Online\nFees: ₹ 3999." },
    origin: { title:"OriginPro Graphing & Data Analysis", img:"images/w3.png", pdf:"#", desc:"Peak analysis, curve fitting, batch processing & publication-ready graphs.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2499." },
    xrd: { title:"XRD Data Analysis Workshop", img:"images/w4.png", pdf:"#", desc:"Rietveld refinement, peak indexing & crystal structure analysis.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2999." },
    chemdraw: { title:"ChemDraw Hands-on Training", img:"images/w5.png", pdf:"#", desc:"Draw chemical structures, reactions, stereochemistry & export HD images.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 1999." },
    dwsim: { title:"DWSIM Chemical Simulation", img:"images/w6.png", pdf:"#", desc:"Process simulation: reactors, distillation, heat exchangers & flowsheets.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2999." }
};

function openDetails(key){
    const data = workshopData[key];
    if(!data) return;

    document.getElementById('workshopTitle').innerText = data.title;
    document.getElementById('workshopImg').src = data.img;
    document.getElementById('workshopDesc').innerText = data.desc;
    document.getElementById('syllabusBtn').href = data.pdf || '#';
    document.getElementById('workshopInfo').style.display = 'flex';

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Set selected workshop in Enquire and Register popups
    const workshopTitle = data.title;
    const updateSelect = (selectId) => {
        const select = document.getElementById(selectId);
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text === workshopTitle) {
                    select.value = select.options[i].value;
                    return;
                }
            }
        }
    };
    updateSelect('enquiryWorkshop'); 
    updateSelect('regWorkshop'); 

    // WhatsApp auto message
    const msg = encodeURIComponent(
        `Hello Nova Academy 👋\nमैं *${data.title}* workshop में interested हूँ।\nPlease details, fees & schedule share करें।`
    );
    document.getElementById("popupWhatsappBtn").href = `https://wa.me/919598183089?text=${msg}`;
}
window.openDetails = openDetails;

function closeDetails(){
    document.getElementById('workshopInfo').style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}
window.closeDetails = closeDetails;


// Close popup on outside click and Escape key 
document.addEventListener('click', function(e){
    const overlayIds = ['workshopInfo','enquirePopup','registerPopup'];
    overlayIds.forEach(id => {
        const overlay = document.getElementById(id);
        if(overlay && overlay.style.display === 'flex' && e.target === overlay) {
            if(id === 'workshopInfo') closeDetails();
            else closePopup(id);
        }
    });
});
document.addEventListener("keydown", function(e){
    if(e.key === "Escape"){
        closeDetails();
        closePopup('enquirePopup');
        closePopup('registerPopup');
    }
});


// ---------- DOMContentLoaded: Form Submission Logic and Counters ----------
document.addEventListener('DOMContentLoaded', () => {

    // --- Counter Logic ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    // Use Intersection Observer for better performance (Your existing logic is good)
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            // Safely handle percentage by replacing it before calculation
            const count = +counter.innerText.replace('%', ''); 
            const increment = target / speed;

            if (count < target) {
                // Ensure the '%' is added back only if it was originally present
                counter.innerText = Math.ceil(count + increment) + (counter.innerText.includes('%') ? '%' : '');
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + (counter.innerText.includes('%') ? '%' : '');
            }
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(counter); 
                }
            });
        }, { threshold: 0.5 });
        observer.observe(counter);
    });

    // --- Utility function for form handling (Refactored for cleaner code) ---
    const handleFormSubmission = (formId, submitBtnId, successMessage, closeFn) => {
        const form = document.getElementById(formId);
        const submitBtn = document.getElementById(submitBtnId);

        if (form && GOOGLE_SHEET_URL.startsWith('http')) {
            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                submitBtn.disabled = true;
                // Add loading spinner for modern UX
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...';

                const formData = new FormData(this);
                const data = {};
                formData.forEach((value, key) => (data[key] = value));

                try {
                    const response = await fetch(GOOGLE_SHEET_URL, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded', 
                        },
                        body: new URLSearchParams(data).toString(), 
                    });

                    const result = await response.json();

                    if (result.result === 'success') {
                        let finalMessage = successMessage;
                        if(formId === 'registerForm') {
                           finalMessage = finalMessage.replace('UTR_PLACEHOLDER', data.UTR_ID || 'N/A');
                        }
                        alert(finalMessage);
                        this.reset();
                        closeFn();
                    } else {
                        alert('❌ Submission Failed! Error: ' + result.message);
                    }
                } catch (error) {
                    console.error(`${formId} Submission Error:`, error);
                    alert('❌ An error occurred during submission. Please try again.');
                } finally {
                    submitBtn.disabled = false;
                    // Restore original button text
                    submitBtn.textContent = (formId === 'enquireForm') ? 'Submit Enquiry' : 'Submit Registration & Payment';
                }
            });
        }
    };
    
    // --- 1. Enquiry Form Submission Logic ---
    handleFormSubmission(
        'enquireForm',
        'enquireSubmitBtn',
        '✅ Enquiry Submitted! We will contact you shortly.',
        () => closePopup('enquirePopup')
    );

    // --- 2. Registration Form Submission Logic ---
    handleFormSubmission(
        'registerForm',
        'registerSubmitBtn',
        '🎉 Registration Successful! We are verifying your payment (UTR: UTR_PLACEHOLDER). Confirmation will be sent via email.',
        () => closePopup('registerPopup')
    );
});
