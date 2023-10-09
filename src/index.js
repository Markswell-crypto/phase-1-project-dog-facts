document.addEventListener('DOMContentLoaded', () => {
    const dogBreed = document.getElementById('list');
    
// Function to fetch movie data from the server
    function fetchDogBreed() {
        fetch('https://dogapi.dog/api/v2/breeds')
            .then(response => response.json())
            .then(dog => {
                dogs.forEach(dog => {
                    const dogName = document.createElement('li');
                    dogName.textContent = dog.type.name;
                    dogName.classList.add('film', 'item');
                    movieItem.setAttribute('data-movie-id', movie.id);
                    .appendChild(dogName);

                    movieItem.addEventListener('click', (e) => {
                        e.preventDefault()
                        displayMovieDetails(movie);
                    });
                });
 })
})
