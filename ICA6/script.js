//selects all gallery nav buttons
const filterButtons = document.querySelectorAll('.gallery-nav button');
//selects all photo cards
const photoCards = document.querySelectorAll('.photo-card');

//attaching click event handlers to buttons
filterButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    //takes text from button to filterPhotos()
    const filterValue = event.target.textContent.toLowerCase();
    filterPhotos(filterValue);
  });
});

function filterPhotos(category) {
    //for each card, see if category matches with button text
  photoCards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
