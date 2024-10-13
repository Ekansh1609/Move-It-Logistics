async function calculateAndStoreDistance() {
    console.log("Calculating distance...");
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropLocation = document.getElementById('dropLocation').value;

    if (pickupLocation && dropLocation) {
        console.log("Both pickup and drop locations are filled");
        const url = `https://distance-api3.p.rapidapi.com/distance?location1=${encodeURIComponent(pickupLocation)}&location2=${encodeURIComponent(dropLocation)}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '4383b5f8bcmsh52504d26a8b91aep1d1525jsn0ec73ee188a9',
                'X-RapidAPI-Host': 'distance-api3.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const distance = result.distance;
            console.log("Distance calculated:", distance);
            // Assign the calculated distance to the hidden input field
            const distanceInputField = document.getElementById('distance');
            distanceInputField.value = distance; // This line sets the value of the hidden input field

            // Here you can store the distance in the database using an AJAX request
            // Example:
            await fetch('/store-distance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ distance })
            });

            console.log("Distance stored in the database.");
            

        } catch (error) {
            console.error(error);
        }
    } else {
        console.log("Both pickup and drop locations are not filled");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded");
    const pickupInputField = document.getElementById('pickupLocation');
    const dropInputField = document.getElementById('dropLocation');

    // Calculate distance when pickup or drop location changes
    pickupInputField.addEventListener('input', calculateAndStoreDistance);
    dropInputField.addEventListener('input', calculateAndStoreDistance);
});
