document.addEventListener('DOMContentLoaded', () => {
    const breedList = document.getElementById('breedList');
    const displayFact = document.getElementById('displayfact');
    
    // Function to fetch dog breed data from the server
    function fetchDogBreeds() {
        fetch('https://dog.ceo/api/breeds/list/all')
            .then(response => response.json())
            .then(data => {
                const breeds = Object.keys(data.message); 
                
                // Display each breed in the list
                breeds.forEach(breed => {
                    const breedItem = document.createElement('li');
                    breedItem.textContent = breed;
                    breedList.appendChild(breedItem);

                    // Add a click event listener to each breed item
                    breedItem.addEventListener('click', () => {
                        // Get the breed name when clicked
                        const selectedBreed = breedItem.textContent;
                        
                        // Call a function to display dog facts
                        displayDogFacts(selectedBreed);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
            });
    }

    // Function to display dog facts
    function displayDogFacts(breed) {
        // You can fetch dog facts for the selected breed here or use predefined data
        // For this example, I'll use predefined data
        const dogFacts = {
            'Breed 1': 'Description for Breed 1',
            'Breed 2': 'Description for Breed 2',
            // Add more breeds and descriptions as needed
        };

        // Display the selected breed's fact in the displayfact div
        displayFact.innerHTML = `
            <h2 id="title">BREED: ${breed}</h2>
            <p id="description">Description: ${dogFacts[breed]}</p>
        `;
    }

    // Fetch dog breeds and initialize the page
    fetchDogBreeds();
});
