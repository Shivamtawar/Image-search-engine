// 🔑 Unsplash API Access Key
const accessKey = "IcVtEE9OJ2snq5yTuaoL475FnpJGHpLOPSW6v3wj0FU";

const searchInput = document.getElementById("Search");
const resultSection = document.querySelector(".image-grid");
const formEl = document.querySelector("form");
const loader = document.getElementById("loader");
const darkModeToggle = document.getElementById("darkModeToggle");

let page = 1;
let currentQuery = "";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// 🖼️ Fetch Images
async function getImages() {
    const keyword = currentQuery.trim();
    if (keyword === "") {
        alert("Please enter a search term!");
        return;
    }

    loader.style.display = "block";

    const response = await fetch(
        `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=12`
    );
    const data = await response.json();
    const results = data.results;

    if (page === 1) resultSection.innerHTML = "";

    if (results.length === 0) {
        loader.style.display = "none";
        resultSection.innerHTML = `<p style="text-align:center; color:#777;">No images found. Try a different keyword!</p>`;
        return;
    }

    results.forEach((result) => createImageCard(result));

    loader.style.display = "none";
}

// 🖼️ Create Image Card
function createImageCard(result) {
    const card = document.createElement("div");
    card.classList.add("image-card");

    const image = document.createElement("img");
    image.src = result.urls.small;
    image.alt = result.alt_description || "Image";

    const link = document.createElement("a");
    link.href = result.links.html;
    link.target = "_blank";
    link.appendChild(image);

    // ⬇️ Download Button
    const downloadBtn = document.createElement("button");
    downloadBtn.classList.add("download-btn");
    downloadBtn.innerText = "Download";
    downloadBtn.addEventListener("click", (e) => {
        e.preventDefault();
        downloadImage(result.urls.full);
    });

    // ❤️ Favorite Button
    const favoriteBtn = document.createElement("button");
    favoriteBtn.classList.add("fav-btn");
    favoriteBtn.innerText = favorites.includes(result.id) ? "💖 Added" : "🤍 Favorite";
    favoriteBtn.addEventListener("click", () => toggleFavorite(result.id, favoriteBtn));

    card.appendChild(link);
    card.appendChild(downloadBtn);
    card.appendChild(favoriteBtn);
    resultSection.appendChild(card);
}

// 💾 Download Image
async function downloadImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "unsplash-image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ❤️ Add or Remove Favorite
function toggleFavorite(id, btn) {
    if (favorites.includes(id)) {
        favorites = favorites.filter((fav) => fav !== id);
        btn.innerText = "🤍 Favorite";
    } else {
        favorites.push(id);
        btn.innerText = "💖 Added";
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

// 🔍 Form Submit
formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    currentQuery = searchInput.value;
    page = 1;
    getImages();
});

// 🌙 Dark Mode
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    darkModeToggle.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// ♾️ Infinite Scroll
window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        page++;
        getImages();
    }
});
