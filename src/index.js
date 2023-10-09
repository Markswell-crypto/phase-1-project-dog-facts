document.addEventListener('DOMContentLoaded', () => {
    const breedList = document.getElementById('breedList');
    
    // Function to fetch dog breed data from the server
    function fetchDogBreeds() {
        fetch('https://dog.ceo/api/breeds/list/all')
            .then(response => response.json())
            .then(data => {
                const breeds = Object.keys(data.message); // Extract breed names
                
                // Display each breed in the list
                breeds.forEach(breed => {
                    const breedItem = document.createElement('li');
                    breedItem.textContent = breed;
                    breedList.appendChild(breedItem);
                });
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
            });
    }

    // Fetch dog breeds and initialize the page
    fetchDogBreeds();
});
