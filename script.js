
const workshopData = {
  xps:{
    title:"XPS Data Analysis Workshop",
    img:"images/XPSIMAGE.png",
    desc:`Comprehensive training on XPS fundamentals,
instrumentation, peak fitting and surface chemistry.`
  },
  electro:{
    title:"Electrochemical Data Analysis",
    img:"images/w2.png",
    desc:"CV, EIS, GCD, Nyquist & battery analysis."
  },
  origin:{
    title:"OriginPro Training",
    img:"images/w3.png",
    desc:"Scientific graphing, curve fitting & reports."
  },
  xrd:{
    title:"XRD Analysis",
    img:"images/w4.png",
    desc:"Phase identification & Rietveld refinement."
  },
  chemdraw:{
    title:"ChemDraw Workshop",
    img:"images/w5.png",
    desc:"Chemical structure drawing & publication export."
  },
  dwsim:{
    title:"DWSIM Simulation",
    img:"images/w6.png",
    desc:"Process simulation & chemical modeling."
  }
};

function openDetails(key){
  const d = workshopData[key];
  if(!d) return;

  document.getElementById("workshopTitle").innerText = d.title;
  document.getElementById("workshopImg").src = d.img;
  document.getElementById("workshopDesc").innerText = d.desc;

  const msg =
    `Hello Nova Academy 👋%0AInterested in ${d.title}`;
  document.getElementById("popupWhatsappBtn").href =
    `https://wa.me/919598183089?text=${msg}`;

  document.getElementById("workshopInfo").style.display="flex";
  document.body.style.overflow="hidden";
}

function closeDetails(){
  document.getElementById("workshopInfo").style.display="none";
  document.body.style.overflow="";
}

document.addEventListener("keydown",e=>{
  if(e.key==="Escape") closeDetails();
});
