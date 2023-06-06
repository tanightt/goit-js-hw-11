import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { createGalleryCards } from "./gallery-card.js";

const input = document.querySelector('[name="searchQuery"]');
const searchBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const observEl = document.querySelector('.js-observEl');

let cardPage = null;
let totalHits = null;
const lightbox = new SimpleLightbox('.gallery a');

const observerGallery = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
        cardPage += 1;

    getCard().then(cardData => {
        gallery.insertAdjacentHTML('beforeend', createGalleryCards(cardData));
        lightbox.refresh(); 

        if (cardPage === Math.ceil(totalHits / 40)) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            observer.unobserve(observEl);
        }
    });
    }
}, {
    root: null,
    rootMargin: '0px 0px 400px 0px',
    threshold: 1.0
}
);

function onBtnSearch(e) {
    e.preventDefault();
    cardPage = 1;
    getCard().then(cardData => {
        setTimeout(() => {
          observerGallery.observe(observEl);
        }, 1000);

        gallery.innerHTML = createGalleryCards(cardData);
        lightbox.refresh(); 

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
    });
} 
searchBtn.addEventListener('click', onBtnSearch);

async function getCard() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
    params: {
        key: '37045693-8aefe551e2e8551a000bf542b',
        q: `${input.value}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: `${cardPage}`,
        per_page: 40,
    }
    });
    const cardData = response.data.hits; 
    totalHits = response.data.totalHits;
    if (cardData.length === 0) {
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }      
    return cardData;
  } catch (error) {
    console.error(error);
  }
}