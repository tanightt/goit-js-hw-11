export function createGalleryCards(cardInfo) {
    const imgCards = cardInfo.map(cardData => {
        return `<div class="photo-card">
        <img src="${cardData.webformatURL}" data-source="${cardData.largeImageURL}" alt="${cardData.tags}" loading="lazy" />
        <div class="info">
            <p class="info-item"><b>Likes</b>${cardData.likes}</p>
            <p class="info-item"><b>Views</b>${cardData.views}</p>
            <p class="info-item"><b>Comments</b>${cardData.comments}</p>
            <p class="info-item"><b>Downloads</b>${cardData.downloads}</p>
        </div>
        </div> `;
    })
    return imgCards.join('');
}