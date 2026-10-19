alert("Submit handler is running!");
const API_URL = "http://localhost:3000/api/portfolio";

const form = document.getElementById("profile-form");
const profilesList = document.getElementById("profiles-list");
const message = document.getElementById("crud-message");
const cancelEditButton = document.getElementById("cancel-edit");

const fields = [
    "owner_name",
    "headline",
    "course_code",
    "course_name",
    "institution",
    "bio",
    "skills"
];

// Read profile data from the form
function getFormData() {
    const profile = {};

    fields.forEach((field) => {
        profile[field] = document.getElementById(field).value.trim();
    });

    return profile;
}

// Clear the form
function clearForm() {
    form.reset();
    document.getElementById("profile-id").value = "";
}

// Display a message to the user
function showMessage(text) {
    message.textContent = text;
}

// Get and display all profiles
async function loadProfiles() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Could not load profiles.");
        }

        const profiles = await response.json();

        profilesList.replaceChildren();

        profiles.forEach((profile) => {
            const card = document.createElement("article");

            const heading = document.createElement("h4");
            heading.textContent = profile.owner_name;

            const details = document.createElement("p");
            details.textContent =
                `${profile.headline || ""} | ` +
                `${profile.course_code || ""} | ` +
                `${profile.course_name || ""}`;

            const bio = document.createElement("p");
            bio.textContent = profile.bio || "";

            const skills = document.createElement("p");
            skills.textContent = `Skills: ${profile.skills || ""}`;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.type = "button";
            editButton.addEventListener("click", () => {
                editProfile(profile);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.type = "button";
            deleteButton.addEventListener("click", () => {
                deleteProfile(profile.id);
            });

            card.append(heading, details, bio, skills, editButton, deleteButton);
            profilesList.appendChild(card);
        });

    } catch (error) {
        showMessage("Error: " + error.message);
    }
}

// Put a selected profile into the form for editing
function editProfile(profile) {
    document.getElementById("profile-id").value = profile.id;

    fields.forEach((field) => {
        document.getElementById(field).value = profile[field] || "";
    });

    showMessage(`Editing profile #${profile.id}`);
    form.scrollIntoView({ behavior: "smooth" });
}

// Create a new profile or update an existing one
form.addEventListener("submit", async (event) => {
    alert("Submit handler is running!");
    event.preventDefault();

    const id = document.getElementById("profile-id").value;
    const profile = getFormData();

    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profile)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || "Save failed.");
        }

        showMessage(id ? "Profile updated!" : "Profile created!");
        clearForm();
        await loadProfiles();

    } catch (error) {
        showMessage("Error: " + error.message);
    }
});

// Delete a profile
async function deleteProfile(id) {
    if (!confirm(`Delete profile #${id}?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || result.message || "Delete failed.");
        }

        showMessage("Profile deleted.");
        await loadProfiles();

    } catch (error) {
        showMessage("Error: " + error.message);
    }
}

// Cancel editing
cancelEditButton.addEventListener("click", () => {
    clearForm();
    showMessage("Form cleared.");
});

// Load profiles when the page opens
loadProfiles();