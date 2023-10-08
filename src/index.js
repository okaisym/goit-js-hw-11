import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");

const lightbox = new SimpleLightbox('.gallery a');

loadMoreBtn.style.display = 'none';

const BASE_URL = "https://pixabay.com/api/";
let currentPage = 1;
let perPage = 20;
let currentSearchQuery = "";

let isFirstLoad = true;

async function getArray(wordRequest, page) {
    const params = {
        key: "39799921-d95d7c5f90284aad84e73693d",
        q: wordRequest,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
        page,
        per_page: perPage

    };

try {
const response = await axios.get(BASE_URL, {params});
return response.data;
} catch (error) {
    console.log(error);
    throw new Error('Failed to fetch data');
}
}

form.addEventListener('submit', onClickSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onLoadMore() {
    currentPage ++;

    try {
        const nextPageResponse = await getArray(currentSearchQuery, currentPage);
        if (nextPageResponse.hits.length > 0) {
            displayImages(nextPageResponse.hits);
            updateLoadMoreBtn(nextPageResponse.totalHits);
            if (!isFirstLoad) {
                Notiflix.Notify.success("Hooray! We found some more images for you.");
            }
            lightbox.refresh();
            
        } else {
            loadMoreBtn.style.display = 'none';
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
    }
} catch (error) {
    console.log(error);
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.failure('An error occurred while fetching data. Please try again later.');
}
}

async function onClickSearch(event) {
       event.preventDefault();
       const searchQuery = event.target.searchQuery.value;
    
       if(!searchQuery) {
        return;
       }

       currentPage = 1;
       currentSearchQuery = searchQuery;

       try {
        const initResponse = await getArray(searchQuery, currentPage);
        if (initResponse.hits.length === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtn.style.display = 'none';
    } else {
        displayImages(initResponse.hits);
        updateLoadMoreBtn(initResponse.totalHits);
        Notiflix.Notify.success("Hooray! We found these images by your request.");
        lightbox.refresh();
    }
    } catch (error) {
        console.log(error);
        Notiflix.Notify.failure('An error occurred while fetching data. Please try again later.');
       }
    }


function displayImages(images) {
   gallery.innerHTML = '';
    images.forEach((image) => {
       const imgEl = document.createElement('img');
        const divEl = document.createElement('div');
        divEl.classList.add("photo-card");
        divEl.innerHTML = `
        <a href=${image.largeImageURL} data-lighbox="gallery">
<img src="${image.webformatURL}" alt="${image.tags}" width="300" height="150" loading="lazy" /></a>
<div class="info">
<p class="info-item"><br><b>Likes: </b></br>${image.likes}</p> 
<p class="info-item"><br><b>Views: </b></br>${image.views}</p>
<p class="info-item"><br><b>Comments: </b></br>${image.comments}</p>
<p class="image.downloads info-item"><br><b>Downloads: </b></br>${image.comments}</p>
        </div>`;
        gallery.appendChild(divEl);
        imgEl.addEventListener('click', () => {
            openLargeImg(image.largeImgeURL, image.tags);
        });
    });    

    // Notiflix.Notify.success("Hooray! We found these images by your request.")
    };

function openLargeImg(imageURL, altText) {
    Notiflix.Modal.image(imageURL, altText);
}

function updateLoadMoreBtn(totalHits) {
    if (currentPage * perPage >= totalHits) {
        loadMoreBtn.style.display = 'none';
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
        loadMoreBtn.style.display = 'block';
        // Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
    }
}


