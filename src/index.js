import axios from 'axios';
import Notiflix from 'notiflix';
import { createGalleryCards } from "./gallery-card.js";

const input = document.querySelector('[name="searchQuery"]');
const searchBtn = document.querySelector('[type="submit"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

function onBtnSearch(e) {
    e.preventDefault();
    
    getCard().then(cardData => {
        gallery.innerHTML = createGalleryCards(cardData);
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
    }
    });
      
    const cardData = response.data.hits; 
    if (cardData.length === 0) {
        return Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
      
    return cardData;
  } catch (error) {
    console.error(error);
  }
}