document.addEventListener('DOMContentLoaded', function () {
    // Check if credentials are already stored in local storage
    let storedUsername = localStorage.getItem('username');
    let storedPassword = localStorage.getItem('password');

    // If not, prompt the user to set a username and password for the first time
    if (!storedUsername || !storedPassword) {
        storedUsername = prompt('Set your username:', 'user1');
        storedPassword = prompt('Set your password:', 'pass1');
        localStorage.setItem('username', storedUsername);
        localStorage.setItem('password', storedPassword);
    }

    // Handle the login form submission if the loginForm element exists
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');

            // Validate the username and password
            if (username === storedUsername && password === storedPassword) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'resume.html';  // Redirect to the resume page
            } else {
                document.getElementById('error-message').textContent = 'Invalid username or password';
            }
        });

        // Restrict going back to the login page if already logged in
        if (localStorage.getItem('isLoggedIn') === 'true') {
            window.history.pushState(null, null, window.location.href);
            window.onpopstate = function () {
                window.history.go(1);
            };
        }
    }
});

let resumes = [];
let filteredResumes = [];
let currentIndex = 0;

// Fetch data from JSON if on the resume page
if (document.getElementById('resumeContent')) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            resumes = data.resume;
            filteredResumes = resumes;
            displayResume(currentIndex);
            updateButtonVisibility();
        })
        .catch(error => console.error('Error fetching resume data:', error));
}

// Display the resume based on the current index
function displayResume(index) {
    const resume = filteredResumes[index];
    const resumeContainer = document.getElementById('resume-container');
    const errorImage = document.getElementById('error-image');

    if (resume && resumeContainer) {
        document.querySelector('.header-details h1').textContent = resume.basics.name;
        document.querySelector('.header-details p').textContent = `Applied For: ${resume.basics.AppliedFor}`;
        document.getElementById('phone').textContent = resume.basics.phone;
        document.getElementById('email').textContent = resume.basics.email;
        document.getElementById('linkedin').href = resume.basics.profiles.url;

        document.getElementById('skills').innerHTML = resume.skills.keywords.join(', ');
        document.getElementById('hobbies').innerHTML = resume.interests.hobbies.join(', ');

        let resumeContentHTML = `
            <div class="section">
                <h3>Work Experience in previous company</h3>
                <p>Company Name: ${resume.work["Company Name"]}</p>
                <p>Position: ${resume.work.Position}</p>
                <p>Start Date: ${resume.work["Start Date"]}</p>
                <p>End Date: ${resume.work["End Date"]}</p>
                <p>Summary: ${resume.work.Summary}</p>
            </div>
            <div class="section">
                <h3>Projects</h3>
                <p>${resume.projects.name}: ${resume.projects.description}</p>
            </div>
            <div class="section">
                <h3>Education</h3>
                <p>UG: ${resume.education.UG.institute}, ${resume.education.UG.course}, ${resume.education.UG.cgpa}</p>
                <p>PU: ${resume.education["Senior Secondary"].institute}, ${resume.education["Senior Secondary"].cgpa}</p>
                <p>High School: ${resume.education["High School"].institute}, ${resume.education["High School"].cgpa}</p>
            </div>
            <div class="section">
                <h3>Internship</h3>
                <p>Company Name: ${resume.Internship["Company Name"]}</p>
                <p>Position: ${resume.Internship.Position}</p>
                <p>Start Date: ${resume.Internship["Start Date"]}</p>
                <p>End Date: ${resume.Internship["End Date"]}</p>
                <p>Summary: ${resume.Internship.Summary}</p>
            </div>
            <div class="section">
                <h3>Achievements</h3>
                <p>${resume.achievements.Summary.join(', ')}</p>
            </div>
        `;
        document.getElementById('resumeContent').innerHTML = resumeContentHTML;

        resumeContainer.style.display = 'block';
        if (errorImage) errorImage.style.display = 'none';
    } else {
        showErrorMessage();
    }
    updateButtonVisibility();
}

// Update visibility of Next and Previous buttons
function updateButtonVisibility() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn && nextBtn) {
        prevBtn.style.display = currentIndex === 0 ? 'none' : 'inline-block';
        nextBtn.style.display = currentIndex === filteredResumes.length - 1 ? 'none' : 'inline-block';
    }
}

// Handle search functionality
function searchResumes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredResumes = resumes.filter(resume => resume.basics.AppliedFor.toLowerCase().includes(searchTerm));

    if (filteredResumes.length > 0) {
        currentIndex = 0;
        displayResume(currentIndex);
    } else {
        showErrorMessage();
    }
    updateButtonVisibility();
}

// Show error message and hide resume content
function showErrorMessage() {
    const resumeContainer = document.getElementById('resume-container');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const errorImage = document.getElementById('error-image');

    if (resumeContainer) resumeContainer.style.display = 'none';
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (errorImage) errorImage.style.display = 'block';  // Show the error image
}

// Event Listeners
const searchInput = document.getElementById('searchInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (searchInput) {
    searchInput.addEventListener('input', searchResumes);
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayResume(currentIndex);
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex < filteredResumes.length - 1) {
            currentIndex++;
            displayResume(currentIndex);
        }
    });
}
