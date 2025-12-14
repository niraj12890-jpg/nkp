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
