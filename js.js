const acceskey = "IcVtEE9OJ2snq5yTuaoL475FnpJGHpLOPSW6v3wj0FU";
const accessurl = "https://api.unsplash.com/photos/?page=";

const serachinput = document.getElementById("Search");
const searchbtn = document.getElementById("btn");
const resultSection = document.querySelector(".image-grid");
const FormEL = document.querySelector("form");
const showMoreBtn = document.getElementById("showMore");
const loader = document.getElementById("loader");

let page = 1;

async function getImages() {
    const keyword = serachinput.value;
    loader.style.display = "block"; // Show loader

    const response = await fetch(`https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${acceskey}&per_page=12`);
    const data = await response.json();
    console.log(data);

    const results = data.results;

    if (page === 1) {
        resultSection.innerHTML = "";
    }

    results.map((result) => {
        const imageLink = document.createElement("a");
        const image = document.createElement("img");
        image.src = result.urls.small;
        imageLink.href = result.links.html;
        imageLink.target = "_blank"; // Open in new tab
        imageLink.appendChild(image);
        resultSection.appendChild(imageLink);
    });

    loader.style.display = "none"; // Hide loader
    showMoreBtn.style.display = "block";
}

FormEL.addEventListener("submit", (event) => {
    event.preventDefault();
    page = 1; // Reset page to 1 on new search
    getImages();
});

showMoreBtn.addEventListener("click", (e) => {
    page++;
    getImages();
});
