import "./style.css";
import "/components/GetPhotos/GetPhotos.css";
import Header from "/components/Header/Header";
import Hero from "/components/Hero/Hero";
import Cards from "/components/Cards/Cards";

const ACCESS_KEY = import.meta.env.VITE_ACCESS_KEY;

document.addEventListener("DOMContentLoaded", () => {
  document.body.innerHTML = `
  ${Header()}
  ${Hero()}
 `;
});

let currentPage = 1;
let currentKeyword = "";

const body = document.querySelector("body");

const getPhotos = async (keyword, pageNum = 1, append = false) => {
  currentPage = pageNum;
  currentKeyword = keyword;

  let url = `https://api.unsplash.com/search/photos?page=${pageNum}&per_page=10&query=${keyword}&client_id=${ACCESS_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    mapPhotos(data.results, append);
  } catch (error) {
    alert("No funciona la API: " + error.message);
  }
};

const mapPhotos = (photos, append) => {
  const mappedPhotos = photos.map((photo) => ({
    alt: photo.alt_description,
    photo: photo.urls.regular,
    original_photo: photo.urls.raw,
  }));
  printPhotos(mappedPhotos, append);
};


const printPhotos = (photos, append) => {
  const container = document.querySelector("#images-cont");

  if (!append) {
    container.innerHTML = "";
  }

  if (photos.length) {
    
    for (const photo of photos) {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="${photo.original_photo}" target="_blank"> 
          <img src="${photo.photo}" alt="${photo.alt}" class="images"/>
        </a>
        `;
      container.appendChild(li);
    }

  } else {
    const oldSection = document.querySelector(".not-found");
    const oldButtonContainer = document.querySelector(".not-found-btn");

    if (oldSection) oldSection.remove();
    if (oldButtonContainer) oldButtonContainer.remove();

    const section = document.createElement("section");
    section.classList.add("not-found");
    section.innerHTML = `<h2 class='error'>Imágenes no encontradas, prueba estas sugerencias</h2>`;
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("not-found-btn");
    buttonContainer.innerHTML = `${Cards}`;
    body.appendChild(section);
    body.appendChild(buttonContainer);

    const buttons = buttonContainer.querySelectorAll(".card");
    
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const keyword = button.querySelector("h3").textContent.trim();
        currentPage = 1;

        const oldSection = document.querySelector(".not-found");
        const oldButtonContainer = document.querySelector(".not-found-btn");

        if (oldSection) oldSection.remove();
        if (oldButtonContainer) oldButtonContainer.remove();
        getPhotos(keyword);
      });
    });
  }
};


// EVENTS

document.addEventListener("keydown", (ev) => {
  if (ev.target.matches("#search") && ev.key === "Enter") {
    currentPage = 1;
    getPhotos(ev.target.value);
    ev.target.value = "";
  }
});

window.addEventListener("DOMContentLoaded", () => {
  getPhotos("cars");
});

let Loaded = false;

window.addEventListener("scroll", () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 200 && !Loaded) {
    Loaded = true;
    currentPage++;
    getPhotos(currentKeyword, currentPage, true).finally(() => {
      Loaded = false;
    });
  }
});
