document.addEventListener("DOMContentLoaded", function () {
    const petList = document.getElementById("pet-list");
    const addPetForm = document.getElementById("add-pet-form");
    const adoptionForm = document.getElementById("adoption-form");
    const historyList = document.getElementById("history-list");
    const clearHistoryBtn = document.getElementById("clear-history-btn");

    // 🐾 Load available pets
    if (petList) {
        let pets = JSON.parse(localStorage.getItem("pets")) || [];
        petList.innerHTML = pets.length === 0
            ? `<tr><td colspan="4">No pets available for adoption.</td></tr>`
            : "";

        pets.forEach((pet, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${pet.image}" class="pet-img" alt="Pet Image"></td>
                <td><strong>${pet.name}</strong></td>
                <td>${pet.description}</td>
                <td><a href="adopt.html?petIndex=${index}" class="btn">Adopt</a></td>
            `;
            petList.appendChild(row);
        });
    }

    // 🐾 Handle adding a new pet
    if (addPetForm) {
        addPetForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const nameInput = document.getElementById("pet-name");
            const descriptionInput = document.getElementById("pet-description");
            const imageInput = document.getElementById("pet-image");

            if (!nameInput || !descriptionInput || !imageInput) {
                console.error("One or more input fields are missing in the DOM.");
                return;
            }

            const name = nameInput.value.trim();
            const description = descriptionInput.value.trim();
            const imageFile = imageInput.files[0];

            if (!name || !description || !imageFile) {
                alert("Please fill in all fields and select an image.");
                return;
            }

            // Convert image to Base64 and store
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result; 

                let pets = JSON.parse(localStorage.getItem("pets")) || [];
                pets.push({ name, description, image: imageUrl });
                localStorage.setItem("pets", JSON.stringify(pets));

                alert("Pet added successfully!");
                window.location.href = "available-pets.html";
            };

            reader.readAsDataURL(imageFile); // Read the image as Base64
        });
    }

    // 🐾 Display pet info on adoption page
    if (adoptionForm) {
        const urlParams = new URLSearchParams(window.location.search);
        const petIndex = urlParams.get("petIndex");
        let pets = JSON.parse(localStorage.getItem("pets")) || [];

        if (petIndex !== null && pets[petIndex]) {
            document.getElementById("pet-info").innerHTML = `
                <img src="${pets[petIndex].image}" class="pet-img" alt="Pet Image">
                <h3>${pets[petIndex].name}</h3>
                <p>${pets[petIndex].description}</p>
            `;
        } else {
            document.getElementById("pet-info").innerHTML = "<p>Invalid pet selection.</p>";
        }

        // 🐾 Handle adoption form submission
        adoptionForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!confirm("Are you sure you want to adopt this pet?")) return;

            const adopterNameInput = document.getElementById("adopter-name");
            const adopterEmailInput = document.getElementById("adopter-email");
            const adopterPhoneInput = document.getElementById("adopter-phone");

            if (!adopterNameInput || !adopterEmailInput || !adopterPhoneInput) {
                console.error("Adopter name, email, or phone field is missing.");
                return;
            }

            const adopterName = adopterNameInput.value.trim();
            const adopterEmail = adopterEmailInput.value.trim();
            const adopterPhone = adopterPhoneInput.value.trim();

            if (!adopterName || !adopterEmail || !adopterPhone) {
                alert("Please enter all adopter details.");
                return;
            }

            let history = JSON.parse(localStorage.getItem("adoptionHistory")) || [];
            let adoptedPet = pets[petIndex];

            // Save to adoption history
            history.push({
                name: adoptedPet.name,
                image: adoptedPet.image,
                adopter: adopterName,
                contact: `${adopterEmail} | ${adopterPhone}`
            });

            localStorage.setItem("adoptionHistory", JSON.stringify(history));

            // Remove from available pets
            pets.splice(petIndex, 1);
            localStorage.setItem("pets", JSON.stringify(pets));

            alert("Your adoption is successful! The pet has been added to the history.");
            window.location.href = "history.html";
        });
    }

    // 🐾 Load and display adoption history
    function loadHistory() {
        let history = JSON.parse(localStorage.getItem("adoptionHistory")) || [];
        historyList.innerHTML = history.length === 0
            ? `<tr><td colspan="4">No pets have been adopted yet.</td></tr>`
            : "";

        history.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${entry.image}" class="pet-img" alt="Pet Image"></td>
                <td><strong>${entry.name}</strong></td>
                <td>${entry.adopter}</td>
                <td>${entry.contact}</td>
            `;
            historyList.appendChild(row);
        });
    }

    loadHistory(); // Load history when page loads

    // 🗑️ Clear history when button is clicked
    clearHistoryBtn.addEventListener("click", function () {
        if (confirm("Are you sure you want to clear the adoption history?")) {
            localStorage.removeItem("adoptionHistory");
            loadHistory(); // Refresh the table
        }
    });
});
