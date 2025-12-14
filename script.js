  <!-- scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

      // ---------- Search logic (fixed) ----------
    document.getElementById('searchBtn').addEventListener('click', function(){
      const q = document.getElementById('searchInput').value.trim().toLowerCase();
      if(!q) return;
      // Search workshop cards and trainer cards
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
    function openPopup(id){ document.getElementById(id).style.display = 'flex'; }
    function closePopup(id){ document.getElementById(id).style.display = 'none'; }

    // ---------- Workshop detailed data (images + full text) ----------
    const workshopData = {
  xps: {
    title: "XPS Data Analysis Workshop",
    img: "XPSIMAGE.png",
    pdf: "#",
    desc: `About the Workshop

This Online Workshop on XPS Data Analysis is designed to offer a comprehensive understanding and practical exposure to X-ray Photoelectron Spectroscopy (XPS), one of the most powerful and widely used surface analytical techniques in materials science.

Tailored for students, researchers, faculty members, and professionals, the workshop aims to strengthen participants’ knowledge of XPS fundamentals, instrumentation, data acquisition, and advanced interpretation skills.

Through a carefully structured set of sessions, participants will understand:
• The basic physics of photoemission
• Key components of an XPS instrument
• Survey and high-resolution scan analysis
• Peak fitting and background correction
• Elemental identification and chemical state analysis

Each module combines theoretical explanations with live practical demonstrations, ensuring participants gain hands-on experience with real XPS datasets. A dedicated interactive session will allow attendees to analyze their own data or provided examples under the supervision of experts.`
      },
 electro: {
    title: "Electrochemical Data Analysis Workshop",
    img: "images/w2.png",
    pdf: "#",
    desc: `About the Workshop

This workshop provides a comprehensive introduction to Electrochemical Data Analysis for professionals and researchers working with batteries, supercapacitors, and electrocatalysis. Participants will learn key principles, data interpretation methods, and practical applications essential for modern energy storage and conversion research.

Through a carefully structured set of sessions, participants will understand:
• Fundamental and advanced concepts in electrochemical measurements
• Data processing and interpretation techniques
• Analysis of CV, EIS, LSV, GCD, Tafel, Nyquist, and more
• Case studies from batteries, supercapacitors, and electrocatalytic systems

Hands-on sessions with real datasets ensure practical understanding.`
      },
      origin: {
    title: "OriginPro Graphing & Data Analysis Workshop",
    img: "images/w3.png",   // ✅ FIXED
    pdf: "#",
    desc: `About the Workshop

This workshop is designed to equip participants with practical, hands-on skills in OriginPro for scientific data analysis and graphing.

Participants will learn:
• Practical workflows for efficient data analysis
• Use of templates and multi-layer graphing
• Peak analysis, curve fitting & batch processing
• Exporting high-quality images and reports

Suitable for both beginners and advanced users.`
      },
xrd: {
    title: "XRD Data Analysis Workshop",
    img: "images/w4.png",
    pdf: "#",
    desc: `About the Workshop

This workshop introduces participants to X-ray Diffraction (XRD) data analysis: phase identification, Rietveld refinement, peak indexing, and crystal structure interpretation with practical sessions using real datasets.`
      },
      chemdraw: {
    title: "ChemDraw Hands-on Workshop",
    img: "images/w5.png",
    pdf: "#",
    desc: `About the Workshop

Hands-on training in ChemDraw interface and tools, drawing chemical structures, reactions, stereochemistry, templates, and exporting publication-ready diagrams.`
      },
      dwsim: {
    title: "DWSIM Chemical Simulation Workshop",
    img: "images/w6.png",
    pdf: "#",
    desc: `About the Workshop

Practical training on DWSIM: process flowsheets, thermodynamic property analysis, unit operation modeling (reactors, distillation, heat exchangers), and case-study simulations.`
      }
    };

    // open workshop details
    function openDetails(key){
      const data = workshopData[key];
      if(!data) return;
      document.getElementById('workshopTitle').innerText = data.title;
      document.getElementById('workshopImg').src = data.img;
      document.getElementById('workshopDesc').innerText = data.desc;
      document.getElementById('syllabusBtn').href = data.pdf || '#';
      document.getElementById('workshopInfo').style.display = 'flex';
      // prevent background scroll while popup open
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
        // WhatsApp auto message (Nova Academy)
  const msg =
    `Hello Nova Academy 👋%0A` +
    `मैं *${data.title}* workshop में interested हूँ।%0A` +
    `Please details, fees & schedule share करें।`;
document.getElementById("popupWhatsappBtn").href =
  `https://wa.me/919598183089?text=${msg}`;
  document.getElementById("whatsappLink").href =
    `https://wa.me/919598183089?text=${msg}`;

    }

    function closeDetails(){
      document.getElementById('workshopInfo').style.display = 'none';
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    // close popups when clicking outside the box (optional)
    document.addEventListener('click', function(e){
      const overlay = document.getElementById('workshopInfo');
      if(overlay.style.display === 'flex' && e.target === overlay) closeDetails();
      if(document.getElementById('enquirePopup').style.display === 'flex' && e.target === document.getElementById('enquirePopup')) closePopup('enquirePopup');
      if(document.getElementById('registerPopup').style.display === 'flex' && e.target === document.getElementById('registerPopup')) closePopup('registerPopup');
    });

    // ---------- Counters (unchanged) ----------
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      counter.innerText = '0';
      const updateCounter = () => {
        const target = +counter.getAttribute('data-target');
        const current = +counter.innerText;
        const increment = target / 200;
        if(current < target){
          counter.innerText = `${Math.ceil(current + increment)}`;
          setTimeout(updateCounter, 20);
        } else {
          counter.innerText = target;
        }
      }
      updateCounter();
    });
document.addEventListener("keydown", function(e){
  if(e.key === "Escape"){
    closeDetails();
    closePopup('enquirePopup');
    closePopup('registerPopup');
  }
});
    
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxOq1-GYeeQoKHw4DJ3a1XEQIrq9ydS2FvUsXtqWLM3IKwCg9zEX_8Q9WOSDl7FrdE2HQ/exec";

function submitEnquiry(){
  const data = {
    type: "enquiry",
    name: document.getElementById("enqName").value,
    mobile: document.getElementById("enqMobile").value,
    workshop: document.getElementById("enqWorkshop").value
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    alert("Enquiry submitted successfully!");
    closePopup('enquirePopup');

    // WhatsApp auto message
    window.open(
      `https://wa.me/919598183089?text=New Enquiry%0AName: ${data.name}%0AWorkshop: ${data.workshop}`,
      "_blank"
    );
  });
}
    function submitRegistration(){
  const data = {
    type: "registration",
    name: document.getElementById("regName").value,
    email: document.getElementById("regEmail").value,
    mobile: document.getElementById("regMobile").value,
    workshop: document.getElementById("regWorkshop").value,
    utr: document.getElementById("regUTR").value
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    alert("Registration successful! Payment status: Pending");
    closePopup('registerPopup');

    // WhatsApp confirmation to student
    window.open(
      `https://wa.me/91${data.mobile}?text=Nova Academy%0ARegistration received for ${data.workshop}.%0APayment Status: Pending`,
      "_blank"
    );
  });
}
