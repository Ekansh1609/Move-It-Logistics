const input = inputField.value;
  const url = `https://google-maps-api-free.p.rapidapi.com/google-autocomplete?input=${encodeURIComponent(input)}`;
  const options = {
      method: 'GET',
      headers: {
          'X-RapidAPI-Key': '4383b5f8bcmsh52504d26a8b91aep1d1525jsn0ec73ee188a9',
          'X-RapidAPI-Host': 'google-maps-api-free.p.rapidapi.com'
      }
  };

  try {
      const response = await fetch(url, options);
      const data = await response.json();
      showAutocompleteResults(data.predictions, resultsContainer, inputField); // Pass inputField to showAutocompleteResults
  } catch (error) {
      console.error(error);
  }


function showAutocompleteResults(predictions, resultsContainer, inputField) {
  const autocompleteResults = resultsContainer;
  autocompleteResults.innerHTML = '';

  predictions.forEach(prediction => {
      const suggestion = document.createElement('div');
      suggestion.classList.add('autocompleteItem');
      suggestion.textContent = prediction.description;
      suggestion.addEventListener('click', () => {
          inputField.value = prediction.description;
          autocompleteResults.style.display = 'none';
      });
      autocompleteResults.appendChild(suggestion);
  });

  autocompleteResults.style.display = 'block';
}

const pickupInputField = document.getElementById('pickupLocation');
const pickupResultsContainer = document.getElementById('pickupResults');
pickupInputField.addEventListener('input', () => fetchAutocomplete(pickupInputField, pickupResultsContainer));

const dropInputField = document.getElementById('dropLocation');
const dropResultsContainer = document.getElementById('dropResults');
dropInputField.addEventListener('input', () => fetchAutocomplete(dropInputField, dropResultsContainer));