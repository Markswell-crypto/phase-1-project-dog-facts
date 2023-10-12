//Ensuring the script loads after the HTML has successfully been displayed
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    
    // Getting elements by their ID
    const breedList = document.getElementById('breedList');
    const displayFact = document.getElementById('displayfact');
    const subscribeButton = document.getElementById('subscribeButton');
    const commentInput = document.getElementById('comment-input');
    const commentList = document.getElementById('comment-list');
    const commentSubmitButton = document.getElementById('comment-submit');
    // Initialize selected breed item and fetched breeds data
    let selectedBreedItem = null;
    let breedsData = null;
    // using fetch to GET the dog breeds from the public API
    function fetchDogBreeds() {
        fetch('https://dogapi.dog/api/v2/breeds?page[number]=1')
            .then(response => response.json())
            .then(data => {
                breedsData = data.data;
                // Display each breed in the list
                breedsData.forEach(breedData => {
                    const breedItem = document.createElement('ul');
                    breedItem.textContent = breedData.attributes.name;
                    breedList.appendChild(breedItem);

                    // Event listeners for mouse hover
                    breedItem.addEventListener('mouseenter', (e) => {
                        e.preventDefault()
                        breedItem.style.backgroundColor = 'lightgray';
                    });
                    breedItem.addEventListener('mouseleave', (e) => {
                        e.preventDefault()
                        if (breedItem !== selectedBreedItem) {
                            breedItem.style.backgroundColor = 'transparent';
                        }
                    });
                    //Event listener for clicking a certain breed
                    breedItem.addEventListener('click', (e) => {
                        e.preventDefault()
                        if (selectedBreedItem !== null) {
                            selectedBreedItem.style.backgroundColor = 'transparent';
                        }
                        //Adding a style color to the clicked breed
                        selectedBreedItem = breedItem;
                        breedItem.style.backgroundColor = 'lightblue';
                        //Invoke the fetchBreedDescription to display facts for a selected breed
                        fetchBreedDescription(breedData.attributes.name);
                    });
                });
            })
            //When the fetch is not successful from the server, this is displayed.
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
            });
    }

    // Function to Fetch and display breed facts
    function fetchBreedDescription(selectedBreedName) {
        const selectedBreedData = breedsData.find(breedData => breedData.attributes.name === selectedBreedName);
        if (selectedBreedData) {
            const breedAttributes = selectedBreedData.attributes;
            displayFact.innerHTML = `
                <h2 id="title">${breedAttributes.name}</h2>
                <p id="description">Description: ${breedAttributes.description}</p>
                <p id="maxage"> Maximum age: ${breedAttributes.life.max} years</p>
                <p id="minage"> Minimum age: ${breedAttributes.life.min} years</p>
                <p id="maleweight"> Male Weight: ${breedAttributes.male_weight.min} - ${breedAttributes.male_weight.max} kg</p>
                <p id="femaleweight"> Female Weight: ${breedAttributes.female_weight.min} - ${breedAttributes.female_weight.max} kg</p>
            `;
        } else {
            console.error('Breed not found in the stored data.');
        }
    }
    //Adding a classlist to the subscribe button
    subscribeButton.classList.add('btn', 'btn-primary');
    // Subscribe button event listener
    subscribeButton.addEventListener('click', (e) => {
        e.preventDefault()
        const emailInput = document.getElementById('emailInput');
        const userEmail = emailInput.value;
        if (!userEmail) {
            alert('Please enter your email.');
            return;
        }
        const emailData = { email: userEmail };
        fetch("http://localhost:3000/emails", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
        })
        .then(response => response.json())
        .then(message => {
            alert('Thank You For Subscribing!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while subscribing. Please try again later.');
        });
        //clears input box
        emailInput.value = '';
    });

    // Function to create a new comment element
    function createCommentElement(commentData) {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');

        const commentText = document.createElement('p');
        commentText.textContent = commentData.text;

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        //Edit comment actions
        editButton.addEventListener('click', (e) => {
            e.preventDefault()
            editInput.classList.remove('hidden');
            editInput.value = commentData.text;
            editInput.addEventListener('keydown', (event) => {
                event.preventDefault()
                if (event.key === 'Enter') {
                    const editedText = editInput.value;
                    const commentId = commentData.id;
                    fetch(`http://localhost:3000/comments/${commentId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: editedText }),
                    })
                    .then(response => response.json())
                    .then(data => {
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                    commentText.textContent = editedText;
                    editInput.classList.add('hidden');
                }
            });
        });
        //Delete button actions
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault()
            commentElement.remove();
            const commentId = commentData.id;
            fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'DELETE',
            })
            .then(response => {
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });

        const editInput = document.createElement('input');
        editInput.classList.add('edit-input', 'hidden');
        editInput.setAttribute('type', 'text');
        editInput.setAttribute('placeholder', 'Edit your comment');
       
        //Adding the items to the elements
        actionsDiv.appendChild(editButton);
        actionsDiv.appendChild(deleteButton);
        commentElement.appendChild(commentText);
        commentElement.appendChild(actionsDiv);
        commentElement.appendChild(editInput);
        return commentElement;
    }

    // Load comments from the server when the page loads
    function loadComments() {
        fetch('http://localhost:3000/comments')
        .then(response => response.json())
        .then(data => {
            data.forEach(commentData => {
                const commentElement = createCommentElement(commentData);
                commentList.appendChild(commentElement);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Event listener for submitting a comment
    commentSubmitButton.classList.add('btn', 'btn-primary');
    commentSubmitButton.addEventListener('click', (e) => {
        
        e.preventDefault()
        //I used trim() to remove whitespace characters from the beginning and end of a string 
        const commentText = commentInput.value.trim();
        if (commentText !== '') {
            fetch('http://localhost:3000/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: commentText }),
            })
            .then(response => response.json())
            .then(commentData => {
                const commentElement = createCommentElement(commentData);
                commentList.appendChild(commentElement);
            })
            .catch(error => {
                console.error('Error:', error);
            });
            commentInput.value = '';
        }
    });

    // Fetch dog breeds and initialize the page
    fetchDogBreeds();
    // Load comments from the server
    loadComments();
});
