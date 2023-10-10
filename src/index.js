document.addEventListener('DOMContentLoaded', () => {
    const breedList = document.getElementById('breedList');
    const displayFact = document.getElementById('displayfact');
    let selectedBreedItem = null; // Store the selected breed item
    
    // Function to fetch dog breed data from the server
    function fetchDogBreeds() {
        fetch('https://dogapi.dog/api/v2/breeds?page[number]=1')
            .then(response => response.json())
            .then(data => {
                // Extract the breeds data from the response
                const breeds = data.data;                
                // Display each breed in the list
                breeds.forEach(breedData => {
                    const breedItem = document.createElement('ul');
                    breedItem.textContent = breedData.attributes.name; 
    
                    breedList.appendChild(breedItem);
    
                    // Add a mouse hover effect
                    breedItem.addEventListener('mouseenter', () => {
                        breedItem.style.backgroundColor = 'lightgray';
                    });
    
                    // Remove the mouse hover effect
                    breedItem.addEventListener('mouseleave', () => {
                        if (breedItem !== selectedBreedItem) {
                            breedItem.style.backgroundColor = 'transparent';
                        }
                    });
    
                    // Add a click event listener to each breed item
                    breedItem.addEventListener('click', () => {
                        // Remove the mouse hover effect from previously selected breed item
                        if (selectedBreedItem !== null) {
                            selectedBreedItem.style.backgroundColor = 'transparent';
                        }
    
                        // Get the breed name when clicked
                        let selectedBreed = breedData.attributes.name;
    
                        // Store the selected breed item
                        selectedBreedItem = breedItem;
    
                        // Change the color of the selected breed item
                        breedItem.style.backgroundColor = 'lightblue';
    
                        // Call a function to fetch and display dog facts
                        fetchBreedDescription(selectedBreed);
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
            });
    }
    
   // Function to fetch breed description and image
   function fetchBreedDescription(breed) {
    fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
        .then(response => response.json())
        .then(data => {
    console.log(data)
            const imageUrl = data.message;

            // Fetch additional dog facts or description from another source
            // For now, let's assume you have a dogFacts object with descriptions
            const dogFacts = {
                // Define descriptions for different breeds
                'breed1': 'Description for breed 1',
                'breed2': 'Description for breed 2',
                // Add descriptions for other breeds here
            };

            // Display the breed image and description
            displayFact.innerHTML = `
            <img src="${imageUrl}" alt="${breed}" width="500" height="500">
            <h2 id="title">BREED: ${breed}</h2>
            <p id="description">Description: ${dogFacts[breed]}</p>
            `;
        })
        .catch(error => {
            console.error('Error fetching breed description:', error);
        });
}

    // Fetch dog breeds and initialize the page
    fetchDogBreeds();
});
