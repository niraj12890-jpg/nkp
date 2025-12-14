const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwuqLR5rTuifEo0iyrfnqCMSXW6n9z-r9NDSl9DHsYuci2TliXpoAdY_KCTL2Uh_aGprg/exec';
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

// ---------- Workshop detailed data ----------
const workshopData = {
  xps: { title:"XPS Data Analysis Workshop", img:"images/w1.png", pdf:"#", desc:"Detailed info on XPS Data Analysis..." },
  electro: { title:"Electrochemical Data Analysis Workshop", img:"images/w2.png", pdf:"#", desc:"Electrochemical data analysis details..." },
  origin: { title:"OriginPro Graphing & Data Analysis Workshop", img:"images/w3.png", pdf:"#", desc:"OriginPro training details..." },
  xrd: { title:"XRD Data Analysis Workshop", img:"images/w4.png", pdf:"#", desc:"XRD analysis info..." },
  chemdraw: { title:"ChemDraw Hands-on Workshop", img:"images/w5.png", pdf:"#", desc:"ChemDraw training info..." },
  dwsim: { title:"DWSIM Chemical Simulation Workshop", img:"images/w6.png", pdf:"#", desc:"DWSIM simulation details..." }
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

  // WhatsApp auto message
  const msg = encodeURIComponent(
    `Hello Nova Academy 👋\nमैं *${data.title}* workshop में interested हूँ।\nPlease details, fees & schedule share करें।`
  );
  document.getElementById("popupWhatsappBtn").href = `https://wa.me/919598183089?text=${msg}`;
  document.getElementById("whatsappLink").href = `https://wa.me/919598183089?text=${msg}`;
}

function closeDetails(){
  document.getElementById('workshopInfo').style.display = 'none';
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
}

// Close popup on outside click
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

// Escape key closes all popups
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    closeDetails();
    closePopup('enquirePopup');
    closePopup('registerPopup');
  }
});

// ---------- Counters ----------
document.querySelectorAll('.counter').forEach(counter => {
  counter.innerText = '0';
  const update = () => {
    const target = +counter.getAttribute('data-target');
    let current = +counter.innerText;
    const increment = target / 200;
    if(current < target){
      counter.innerText = `${Math.ceil(current + increment)}`;
      setTimeout(update, 20);
    } else {
      counter.innerText = target;
    }
  }
  update();
});

// ---------- Google Script URL ----------
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxOq1-GYeeQoKHw4DJ3a1XEQIrq9ydS2FvUsXtqWLM3IKwCg9zEX_8Q9WOSDl7FrdE2HQ/exec";

// ---------- Enquiry submission ----------
function submitEnquiry(){
  const name = document.getElementById("enqName").value.trim();
  const mobile = document.getElementById("enqMobile").value.trim();
  const workshop = document.getElementById("enqWorkshop").value;

  if(!name || !mobile){ alert("Please fill all fields!"); return; }

  const data = { type:"enquiry", name, mobile, workshop };
  fetch(SCRIPT_URL,{
    method:"POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    alert("Enquiry submitted successfully!");
    closePopup('enquirePopup');
    window.open(`https://wa.me/919598183089?text=${encodeURIComponent("New Enquiry\nName: "+name+"\nWorkshop: "+workshop)}`,"_blank");
  });
}

// ---------- Registration submission ----------
function submitRegistration(){
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const mobile = document.getElementById("regMobile").value.trim();
  const workshop = document.getElementById("regWorkshop").value;
  const utr = document.getElementById("regUTR").value.trim();

  if(!name || !email || !mobile || !utr){ alert("Please fill all fields!"); return; }

  const data = { type:"registration", name, email, mobile, workshop, utr };
  fetch(SCRIPT_URL,{
    method:"POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    alert("Registration successful! Payment status: Pending");
    closePopup('registerPopup');
    window.open(`https://wa.me/91${mobile}?text=${encodeURIComponent("Nova Academy\nRegistration received for "+workshop+".\nPayment Status: Pending")}`,"_blank");
  });
}
// script.js (continued)

// Function to handle enquiry form submission
document.addEventListener('DOMContentLoaded', () => {
    // 1. Existing Popup and Detail functions
    window.openDetails = function(workshopId) {
        // ... (Your existing openDetails function logic) ...
        const workshopData = {
            'xps': { title: 'XPS Data Analysis Workshop', img: 'images/w1.png', desc: 'Comprehensive XPS fundamentals, instrumentation & peak fitting with hands-on datasets.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2999.' },
            'electro': { title: 'Electrochemical Data Analysis', img: 'images/w2.png', desc: 'EIS, CV, LSV, GCD, Nyquist & case studies for batteries & catalysis.\n\nDuration: 1–2 Weeks\nMode: Online\nFees: ₹ 3999.' },
            'origin': { title: 'OriginPro Graphing & Data Analysis', img: 'images/w3.png', desc: 'Peak analysis, curve fitting, batch processing & publication-ready graphs.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2499.' },
            'xrd': { title: 'XRD Data Analysis Workshop', img: 'images/w4.png', desc: 'Rietveld refinement, peak indexing & crystal structure analysis.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2999.' },
            'chemdraw': { title: 'ChemDraw Hands-on Training', img: 'images/w5.png', desc: 'Draw chemical structures, reactions, stereochemistry & export HD images.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 1999.' },
            'dwsim': { title: 'DWSIM Chemical Simulation', img: 'images/w6.png', desc: 'Process simulation: reactors, distillation, heat exchangers & flowsheets.\n\nDuration: 1 Week\nMode: Online\nFees: ₹ 2999.' },
        };
        const data = workshopData[workshopId];
        if (data) {
            document.getElementById('workshopTitle').textContent = data.title;
            document.getElementById('workshopImg').src = data.img;
            document.getElementById('workshopDesc').textContent = data.desc;
            // Set workshop in Enquire/Register popups
            const enquireSelect = document.getElementById('enquiryWorkshop');
            if (enquireSelect) {
                for (let i = 0; i < enquireSelect.options.length; i++) {
                    if (enquireSelect.options[i].text === data.title) {
                        enquireSelect.value = enquireSelect.options[i].value;
                        break;
                    }
                }
            }
            document.getElementById('workshopInfo').style.display = 'flex';
        }
    };

    window.closeDetails = function() {
        document.getElementById('workshopInfo').style.display = 'none';
    };

    window.openPopup = function(popupId) {
        document.getElementById(popupId).style.display = 'flex';
    };

    window.closePopup = function(popupId) {
        document.getElementById(popupId).style.display = 'none';
    };

    // 2. Counter function (optional)
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

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
        // Add Intersection Observer to only start when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(counter); // Stop observing once started
                }
            });
        }, { threshold: 0.5 });
        observer.observe(counter);
    });

    // 3. Enquiry Form Submission Logic (NEW)
    const enquireForm = document.getElementById('enquireForm');
    const submitBtn = document.getElementById('enquireSubmitBtn');

    if (enquireForm && GOOGLE_SHEET_URL.startsWith('http')) {
        enquireForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => (data[key] = value));

            try {
                const response = await fetch(GOOGLE_SHEET_URL, {
                    method: 'POST',
                    mode: 'cors', // Crucial for cross-origin requests
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString(),
                });

                const result = await response.json();

                if (result.result === 'success') {
                    alert('✅ Enquiry Submitted! We will contact you shortly.');
                    this.reset(); // Clear the form
                    closePopup('enquirePopup');
                } else {
                    alert('❌ Submission Failed! Error: ' + result.message);
                }
            } catch (error) {
                console.error('Submission Error:', error);
                alert('❌ An error occurred during submission. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Enquiry';
            }
        });
    } else if (enquireForm) {
        // Fallback if URL is missing/incorrect: show alert and allow manual follow-up
        enquireForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Google Sheet Integration is not configured. Please contact info@novaacademy.com manually.");
        });
    }
});
// script.js (continued, inside DOMContentLoaded)

    // 4. Registration Form Submission Logic (NEW)
    const registerForm = document.getElementById('registerForm');
    const registerSubmitBtn = document.getElementById('registerSubmitBtn');

    if (registerForm && GOOGLE_SHEET_URL.startsWith('http')) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

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
                    this.reset(); // Clear the form
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
