// 🔑 Unsplash API Access Key
const acceskey = "IcVtEE9OJ2snq5yTuaoL475FnpJGHpLOPSW6v3wj0FU";

const serachinput = document.getElementById("Search");
const searchbtn = document.getElementById("btn");
const resultSection = document.querySelector(".image-grid");
const FormEL = document.querySelector("form");
const showMoreBtn = document.getElementById("showMore");
const loader = document.getElementById("loader");
const clearBtn = document.getElementById("clearBtn");
const darkModeToggle = document.getElementById("darkModeToggle");

let page = 1;

// 🖼️ Fetch Images
async function getImages() {
    const keyword = serachinput.value.trim();
    if (keyword === "") {
        alert("Please enter a search term!");
        return;
    }

    loader.style.display = "block"; // Show loader

    const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${acceskey}&per_page=12`);
    const data = await response.json();
    const results = data.results;

    if (page === 1) {
        resultSection.innerHTML = "";
    }

    if (results.length === 0) {
        loader.style.display = "none";
        resultSection.innerHTML = `<p style="text-align:center; color:#777;">No images found. Try a different keyword!</p>`;
        return;
    }

    // 🖼️ Create image cards
    results.forEach((result) => {
        const card = document.createElement("div");
        card.classList.add("image-card");

        const image = document.createElement("img");
        image.src = result.urls.small;
        image.alt = result.alt_description || "Image";

        const link = document.createElement("a");
        link.href = result.links.html;
        link.target = "_blank";
        link.appendChild(image);

        // ⬇️ Download button
        const downloadBtn = document.createElement("button");
        downloadBtn.classList.add("download-btn");
        downloadBtn.innerText = "Download";
        downloadBtn.addEventListener("click", (e) => {
            e.preventDefault();
            downloadImage(result.urls.full);
        });

        card.appendChild(link);
        card.appendChild(downloadBtn);
        resultSection.appendChild(card);
    });

    loader.style.display = "none";
    showMoreBtn.style.display = "block";
}

// 💾 Download Image Function
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

// 🔍 Form Submit
FormEL.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1;
    getImages();
});

// ➕ Show More Button
showMoreBtn.addEventListener("click", () => {
    page++;
    getImages();
});

// 🧹 Clear Button
clearBtn.addEventListener("click", () => {
    serachinput.value = "";
    resultSection.innerHTML = "";
    showMoreBtn.style.display = "none";
});

// 🌙 Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        darkModeToggle.textContent = "🌙 Dark Mode";
    }
});
