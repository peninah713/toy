// DOM Elements
const toyCollection = document.getElementById('toy-collection');
const toyForm = document.querySelector('.add-toy-form');
const toyFormContainer = document.querySelector('.container');

// Toggle form visibility
document.querySelector('#new-toy-btn').addEventListener('click', () => {
  toyFormContainer.style.display = toyFormContainer.style.display === 'none' ? 'block' : 'none';
});

// Fetch and render toys
function fetchToys() {
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toyCollection.innerHTML = '';
      toys.forEach(renderToy);
    });
}

// Render a single toy
function renderToy(toy) {
  const toyCard = document.createElement('div');
  toyCard.className = 'card';
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar">
    <p>${toy.likes} Likes</p>
    <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
  `;
  toyCollection.appendChild(toyCard);
}

// Add new toy
toyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const image = e.target.image.value;
  
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ name, image, likes: 0 })
  })
    .then(response => response.json())
    .then(newToy => {
      renderToy(newToy);
      toyForm.reset();
    });
});

// Like a toy
toyCollection.addEventListener('click', (e) => {
  if (e.target.className === 'like-btn') {
    const id = e.target.dataset.id;
    const likeCount = parseInt(e.target.previousElementSibling.textContent) + 1;
    
    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: likeCount })
    })
      .then(response => response.json())
      .then(updatedToy => {
        e.target.previousElementSibling.textContent = `${updatedToy.likes} Likes`;
      });
  }
});

// Initial fetch of toys
fetchToys();