// ---------- Search ----------
document.getElementById('searchBtn').addEventListener('click', function(){
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if(!q) return;
  const all = document.querySelectorAll('.card');
  all.forEach(item => {
    item.style.display = item.innerText.toLowerCase().includes(q) ? '' : 'none';
  });
});

// ---------- Popup helpers ----------
function openPopup(id){ document.getElementById(id).style.display = 'flex'; }
function closePopup(id){ document.getElementById(id).style.display = 'none'; }

// ---------- Workshop Data ----------
const workshopData = {
  xps: {
    title: "XPS Data Analysis Workshop",
    img: "XPSIMAGE.png",
    desc: "Full workshop description..."
  }
  // बाकी data SAME रहेगा
};

// ---------- Open Details ----------
function openDetails(key){
  const d = workshopData[key];
  if(!d) return;
  document.getElementById('workshopTitle').innerText = d.title;
  document.getElementById('workshopImg').src = d.img;
  document.getElementById('workshopDesc').innerText = d.desc;
  document.getElementById('workshopInfo').style.display = 'flex';
}

// ---------- Close ----------
function closeDetails(){
  document.getElementById('workshopInfo').style.display = 'none';
}
