// Ensure this is your deployed Web App URL from Google Apps Script
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwuqLR5rTuifEo0iyrfnqCMSXW6n9z-r9NDSl9DHsYuci2TliXpoAdY_KCTL2Uh_aGprg/exec';

// --- Cleanup: Removing old submission logic ---
// REMOVED: const SCRIPT_URL = "..." 
// REMOVED: function submitEnquiry(){...} 
// REMOVED: function submitRegistration(){...}

// ---------- Search logic ----------
document.getElementById('searchBtn').addEventListener('click', function(){
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    if(!q) return;
    const workshops = document.querySelectorAll('#workshops .card');
    const trainers = document.querySelectorAll('#training .trainer-card');
    const past = document.querySelectorAll('#past-workshops .card');
    const all = [...workshops, ...trainers, ...past];
    all.forEach(item => {
        const text = item.innerText.toLowerCase();
        // Show item if text contains query, otherwise hide it
        item.style.display = text.includes(q) ? '' : 'none';
    });
});
document.getElementById('searchInput').addEventListener('keypress', function(e){
    if(e.key === 'Enter') document.getElementById('searchBtn').click();
});

// ---------- Popup helpers ----------
function openPopup(id){
    const popup = document.getElementById(id);
    if(popup) popup.style.display = 'flex';
}
function closePopup(id){
    const popup = document.getElementById(id);
    if(popup) popup.style.display = 'none';
}
window.openPopup = openPopup; // Expose to HTML buttons
window.closePopup = closePopup; // Expose to HTML buttons

// ---------- Workshop detailed data ----------
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
    // Update Enquiry Select (enquiryWorkshop)
    updateSelect('enquiryWorkshop'); 
    // Update Register Select (regWorkshop)
    updateSelect('regWorkshop'); 

    // WhatsApp auto message
    const msg = encodeURIComponent(
        `Hello Nova Academy 👋\nमैं *${data.title}* workshop में interested हूँ।\nPlease details, fees & schedule share करें।`
    );
    document.getElementById("popupWhatsappBtn").href = `https://wa.me/919598183089?text=${msg}`;
    // Optionally update the floating WhatsApp link as well if you want it context-aware
    // document.getElementById("whatsappLink").href = `https://wa.me/919598183089?text=${msg}`;
}
window.openDetails = openDetails; // Expose to HTML buttons

function closeDetails(){
    document.getElementById('workshopInfo').style.display = 'none';
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
}
window.closeDetails = closeDetails; // Expose to HTML buttons


// Close popup on outside click and Escape key (Your original working logic)
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


// ---------- Counters (Your original working logic) ----------
// I've kept your simplified counter logic here, though the one in DOMContentLoaded block below is better
// document.querySelectorAll('.counter').forEach(counter => { ... }); 


// ---------- DOMContentLoaded: Form Submission Logic ----------
document.addEventListener('DOMContentLoaded', () => {

    // --- Counter Logic (Better, as it runs once DOM is ready) ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; 

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace('%', '');
            const increment = target / speed;

            if (count < target) {
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

    // --- 1. Enquiry Form Submission Logic (Modified to use new HTML IDs and final logic) ---
    const enquireForm = document.getElementById('enquireForm');
    const enquireSubmitBtn = document.getElementById('enquireSubmitBtn'); // Ensure this ID exists in HTML

    if (enquireForm && GOOGLE_SHEET_URL.startsWith('http')) {
        enquireForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            enquireSubmitBtn.disabled = true;
            enquireSubmitBtn.textContent = 'Submitting...';

            const formData = new FormData(this);
            const data = {};
            // Convert FormData to object for URLSearchParams
            formData.forEach((value, key) => (data[key] = value));

            try {
                const response = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded', // Required for Apps Script POST
                    },
                    body: new URLSearchParams(data).toString(), // Correct format
                });

                const result = await response.json();

                if (result.result === 'success') {
                    alert('✅ Enquiry Submitted! We will contact you shortly.');
                    this.reset();
                    closePopup('enquirePopup');
                } else {
                    alert('❌ Submission Failed! Error: ' + result.message);
                }
            } catch (error) {
                console.error('Enquiry Submission Error:', error);
                alert('❌ An error occurred during submission. Please try again.');
            } finally {
                enquireSubmitBtn.disabled = false;
                enquireSubmitBtn.textContent = 'Submit Enquiry';
            }
        });
    }

    // --- 2. Registration Form Submission Logic (Final Logic) ---
    const registerForm = document.getElementById('registerForm');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn'); 

    if (registerForm && GOOGLE_SHEET_URL.startsWith('http')) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            registerSubmitBtn.disabled = true;
            registerSubmitBtn.textContent = 'Submitting...';

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
                    alert('🎉 Registration Successful! We are verifying your payment (UTR: ' + data.UTR_ID + '). Confirmation will be sent via email.');
                    this.reset();
                    closePopup('registerPopup');
                } else {
                    alert('❌ Registration Failed! Error: ' + result.message);
                }
            } catch (error) {
                console.error('Registration Submission Error:', error);
                alert('❌ An error occurred during registration. Please check console.');
            } finally {
                registerSubmitBtn.disabled = false;
                registerSubmitBtn.textContent = 'Submit Registration & Payment';
            }
        });
    }
});
