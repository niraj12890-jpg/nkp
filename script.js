/* ---------- SEARCH ---------- */
document.getElementById("searchBtn").addEventListener("click", function () {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? "" : "none";
  });
});

/* ---------- WORKSHOP DATA ---------- */
const workshopData = {
  xps: {
    title: "XPS Data Analysis Workshop",
    desc: "Hands-on training on XPS peak fitting, interpretation, and real research examples."
  },
  ai: {
    title: "AI with Python Workshop",
    desc: "Learn AI fundamentals, Python libraries, and applications in science & engineering."
  },
  origin: {
    title: "OriginPro Training Workshop",
    desc: "Scientific plotting, curve fitting, and publication-quality graph preparation."
  }
};

/* ---------- POPUP FUNCTIONS ---------- */
function openDetails(key) {
  const data = workshopData[key];
  if (!data) return;

  document.getElementById("popupTitle").innerText = data.title;
  document.getElementById("popupDesc").innerText = data.desc;

  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
