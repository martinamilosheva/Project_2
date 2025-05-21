# Safeblink_Project_MartinaMilosheva

## Table of Contents 
1. [Brief](#brief)
2. [Instructions of running the project](#run)
3. [Users for testing](#dummy-users-for-testing)
4. [Features](#features)
5. [Routing behavior](#routing)
6. [Demo](#demo)
7. [Credits](#credits)


## Brief - SafeBlink - Frontend Single Page Application
SafeBlink is a fully responsive, mobile-first approach of single-page application (SPA) built with vanilla JavaScript, HTML, and Bootstrap. It offers a video-centric interface, interactive card filtering, and a user login system (mocked with localStorage). Designed to mimic modern learning and discussion platforms, it includes modals, dynamic routing, and persistent user data, and it mirrors the design provided in a Figma prototype.


## Run Locally
1. Clone this repository:
   ```bash
   git clone https://git.brainster.co/Martina.Milosheva-FE21/project-2-safeblink.git
2. Set up the Flask REST API: (REST API is already included in the repository under the /REST API folder). To run it locally, follow these steps: Make sure you have Python 3.12.3 or later installed on your system. Open your terminal or  command prompt, navigate to the REST API folder inside the project directory:
cd "REST API"
Install the required Python packages:
pip install flask
pip install  flask_cors
Run the API:
python '.\REST API\authenticator.py'
3. If everything works correctly, you should see a message in the terminal indicating that the Flask server is running  on http://127.0.0.1.5500.
4. When everything is set up, just open the index.html with live server.


## Dummy Users for Testing
Built with a Flask REST API running locally
Supports three sets of credentials:

| Username  | Email                  | Password |
|-----------|------------------------|----------|
| User123   | user123@yahoo.com      | Pass123  |
| User456   | user456@gmail.com      | Pass456  |
| User789   | user789@outlook.com    | Pass789  |


## Features
- ⚙️ **SPA Routing** with hash-based navigation (e.g., `#safeblink`, `#information`, `#login`, `#profile`, `#discussion`, `#contact`, `#not-found`)
- 🔐 **Authentication** using localStorage (with mock user accounts)
- 💬 **Discussions & Comments** per video (stored locally)
- 📺 **YouTube Video Integration** per card
- 🎯 **Filterable Cards** based on category preferences
- 🎡 **Custom Carousel** with active state logic
- 📱 **Responsive Design** using Bootstrap 5
-❌ **404 Error Page** with a Lottie animation when the user enters an invalid route


## Routing Behavior:
Hash-based SPA navigation using onhashchange
Only one page is visible at a time, no full reload
Unknown routes display a fully styled 404 page

-Home Page-Safeblink
-Log-In Page
-Profile Page
-Contact Page
-Discussion Page
-Information Page
-Info Page PopUp
-404 Page
   

🏠 Home Page - Safeblink
Initially displays a high-resolution image with a play icon on hover.
Once clicked, the image is replaced by a functional <video> element.


🔐 Login Functionality
Includes a password visibility toggle (show/hide).
The login button stays inactive until both email and password fields are filled.
Displays alerts for invalid credentials or server errors.
Upon successful login, a welcome pop-up modal ("Добредојде!") appears on screen.
After logging in, a logout option is shown in the header or inside the mobile menu.

Only logged-in users can:
Post comments in the "Дискусии" section.
Edit email and birth year in the Profile page.
New posts appear instantly and persist after refresh using session storage.


👤 Profile Page
Users can edit their email and birth year.
Profile changes are saved to session storage for the active user.
Updated info is retained after logging out and back in.
Access the Profile page to view or change your email and birth year (data persists per user)


🎥 “Информирај се” (Information) Page
Features 5 filter buttons for selecting video categories.
Videos are shown based on active category filters.
Each user’s selected filters are saved in session storage.
Filter preferences persist even after logging in/out or refreshing the page.


💬 “Табла за дискусии” (Discussion Board)
Shows predefined discussions and user-submitted comments.
Includes a “See more” option to reveal additional posts.
When typing in the input field, a send button becomes visible.
If an unauthenticated user tries to post, they are redirected to the login page.
Logged-in users can submit comments, which appear instantly with their name and timestamp.
Discussions are stored in session storage and remain visible after reloading the page.


❌404 Page Not Found
If a non-existent hash path is visited, a custom 404 page with a Lottie animation is shown.
 


## DEMO
OR check out the live demo:



## Credits 
Design: The design for this project was provided by Brainster.
Icons: Icons used throughout the application are from the Figma Design System and Font Awesome.
Flask REST API: The backend authentication API was built using Flask.
Third-Party Libraries:
Bootstrap for efficient styling.
JavaScript for frontend logic.
Flask for authentication.
Lottie for interactive animations.