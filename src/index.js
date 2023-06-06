import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { createGalleryCards } from "./gallery-card.js";

const input = document.querySelector('[name="searchQuery"]');
const searchBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let cardPage = null;
let totalHits = null;
const lightbox = new SimpleLightbox('.gallery a');

function onBtnSearch(e) {
    e.preventDefault();
    if (input.value.trim() === '') {
        return;
    }
    cardPage = 1;
    getCard().then(cardData => {
        
        gallery.innerHTML = createGalleryCards(cardData);
        lightbox.refresh(); 

        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`)
        loadMoreBtn.style.display = 'block';

        if (totalHits <= 40) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.style.display = 'none';
        }
    });
} 
searchBtn.addEventListener('click', onBtnSearch);

function onLoadMoreCards(e) {
    cardPage += 1;

    getCard().then(cardData => {
        gallery.insertAdjacentHTML('beforeend', createGalleryCards(cardData));
        lightbox.refresh(); 

        const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
        window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
        });

        if (cardPage === Math.ceil(totalHits / 40)) {
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.style.display = 'none';
        }
    });
}
loadMoreBtn.addEventListener('click', onLoadMoreCards);

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