// Ensure this is your deployed Web App URL from Google Apps Script
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwaNOLieWvfDZE8fLZ0HxHMeM0MjbSl_2PrEZefb_3ieyZO3Hfd-0QEUbszaSVpHE0WMg/exec';

// 🛡️ SECURITY KEY (Must match the one in Google Apps Script)
const SECRET_API_KEY = "vand_nkp@2025";

// ---------- Search logic ----------
document.getElementById('searchBtn').addEventListener('click', function(){
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchMessage = document.getElementById('searchMessage'); 
    let resultsFound = 0; 

    if(!q) {
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
        item.style.display = match ? '' : 'none';
        if (match) resultsFound++;
    });
    
    searchMessage.style.display = (resultsFound > 0) ? 'none' : 'block';
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
window.openPopup = openPopup;
window.closePopup = closePopup;

// ---------- Scroll To Top ----------
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) scrollToTopBtn.classList.add('show');
    else scrollToTopBtn.classList.remove('show');
});
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---------- Workshop detailed data ----------
const workshopData = {
    xps: { title:"XPS Data Analysis Workshop", img:"images/w1.png", pdf:"#", desc:"Comprehensive XPS fundamentals, instrumentation & peak fitting with hands-on datasets.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2999." },
    electro: { title:"Electrochemical Data Analysis", img:"images/w2.png", pdf:"#", desc:"EIS, CV, LSV, GCD, Nyquist & case studies for batteries & catalysis.\n\nDuration: 1–2 Week\nMode: Online\nFees: ₹ 2500." }, 
    origin: { title:"OriginPro Graphing & Data Analysis", img:"images/w3.png", pdf:"#", desc:"Peak analysis, curve fitting, batch processing & publication-ready graphs.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2000." },
    xrd: { title:"XRD Data Analysis Workshop", img:"images/w4.png", pdf:"#", desc:"Rietveld refinement, peak indexing & crystal structure analysis.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2000." }, 
    chemdraw: { title:"ChemDraw Hands-on Training", img:"images/w5.png", pdf:"#", desc:"Draw chemical structures, reactions, stereochemistry & export HD images.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 4500." },
    dwsim: { title:"DWSIM Chemical Simulation", img:"images/w6.png", pdf:"#", desc:"Process simulation: reactors, distillation, heat exchangers & flowsheets.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 5000." }
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

    const workshopTitle = data.title;
    const updateSelect = (selectId) => {
        const select = document.getElementById(selectId);
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                const optionText = select.options[i].text.split(' (')[0].trim(); 
                if (optionText === workshopTitle) {
                    select.value = select.options[i].value;
                    return;
                }
            }
        }
    };
    updateSelect('enquiryWorkshop'); 
    updateSelect('regWorkshop'); 

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

// Close popup on outside click or Escape key 
document.addEventListener('click', function(e){
    const overlayIds = ['workshopInfo','registerPopup'];
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
        closePopup('registerPopup');
    }
});

// WhatsApp Notification Logic after Registration
function sendRegistrationWhatsapp(data) {
    const workshopName = data.workshop_Registered || 'N/A'; 
    const utrId = data.UTR_ID || 'N/A';
    const userName = data.Name || 'A user';
    const userPhone = data.Phone || 'N/A';
    
    const message = encodeURIComponent(
        `✅ *New Registration Alert! (Website)*\n\n` +
        `👤 *Name:* ${userName}\n` +
        `📞 *Phone:* ${userPhone}\n` +
        `📧 *Email:* ${data.Email || 'N/A'}\n` +
        `📚 *Workshop:* ${workshopName}\n` +
        `💳 *UTR/Transaction ID:* ${utrId}\n\n` +
        `Status: Waiting for verification.`
    );

    const whatsappUrl = `https://wa.me/919598183089?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// ---------- DOMContentLoaded ----------
document.addEventListener('DOMContentLoaded', () => {

    // Gallery modal logic
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('show.bs.modal', event => {
            const button = event.relatedTarget;
            const imageUrl = button.getAttribute('data-bs-image');
            const modalImage = imageModal.querySelector('#modalImage');
            modalImage.src = imageUrl;
        });
    }

    // Counters logic
    const counters = document.querySelectorAll('.counter');
    const speed = 200;
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const currentText = counter.innerText;
            const count = +currentText.replace('%', '').replace('+', '');
            const increment = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + increment) 
                    + (currentText.includes('%') ? '%' : '') 
                    + (currentText.includes('+') ? '+' : '');
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target 
                    + (currentText.includes('%') ? '%' : '') 
                    + (currentText.includes('+') ? '+' : '');
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

    // Form submission handler
    const handleFormSubmission = (formId, submitBtnId, successMessage, closeFn) => {
        const form = document.getElementById(formId);
        const submitBtn = document.getElementById(submitBtnId);
        const formType = (formId === 'registerForm') ? 'Registration' : 'Enquiry';
        if (!form || !GOOGLE_SHEET_URL.startsWith('http')) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            let isValid = true;
            form.querySelectorAll('[required]').forEach(input => {
                input.classList.remove('is-invalid');
                if (!input.value.trim()) { input.classList.add('is-invalid'); isValid = false; }
                if (input.type === 'email' && !input.value.includes('@')) { input.classList.add('is-invalid'); isValid = false; }
            });

            if (!isValid) { alert('⚠️ Please fill all required fields correctly.'); return; }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';

            const formData = new FormData(form);
            const data = {};
            formData.forEach((v, k) => (data[k] = v));
            data.API_KEY = SECRET_API_KEY;
            data.formType = formType;

            try {
                const response = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
                    body: new URLSearchParams(data).toString()
                });
                const result = await response.json();

                if (result.result === 'success') {
                    if (formId === 'registerForm') {
                        sendRegistrationWhatsapp(data);
                        closeFn(data);
                        alert(successMessage.replace('UTR_PLACEHOLDER', data.UTR_ID || 'N/A'));
                    } else {
                        const msg =
                            `Hello Nova Academy 👋\n📩 New Enquiry\n👤 Name: ${data.Name}\n📧 Email: ${data.Email}\n📱 Phone: ${data.Phone}\n🎯 Workshop: ${data.workshop_Registered}`;
                        window.open('https://wa.me/919598183089?text=' + encodeURIComponent(msg), '_blank');
                        alert(successMessage);
                        closeFn(data);
                    }
                    form.reset();
                } else alert('❌ Submission failed: ' + result.message);

            } catch (err) {
                console.error(err);
                alert('❌ Network / Server error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = (formId === 'enquireForm') ? 'Submit Enquiry' : 'Submit Registration & Payment';
            }
        });
    };

    handleFormSubmission('enquireForm','enquireSubmitBtn','✅ Enquiry Submitted! We will contact you shortly.', (data) => {});
    handleFormSubmission('registerForm','registerSubmitBtn','🎉 Registration Successful! Verification underway (UTR: UTR_PLACEHOLDER).', (data) => { closePopup('registerPopup'); });

});
