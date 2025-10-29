# Real-Time AI Camera Transformation

Welcome to the Real-Time AI Camera Transformation project! This is an interactive web application that leverages the power of Google's Gemini API to transform your live camera feed based on your creative inputs. From applying artistic styles to swapping backgrounds or generating one-frame stories, this app showcases real-time, on-the-fly image manipulation with generative AI.

[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini-blue.svg)](https://ai.google.dev/)

---

## 🚀 Live Demo

You can view the live deployed application here:

**[https://&lt;YOUR_GITHUB_USERNAME&gt;.github.io/&lt;YOUR_REPOSITORY_NAME&gt;/](https://<YOUR_GITHUB_USERNAME>.github.io/<YOUR_REPOSITORY_NAME>/)**

*(Replace the placeholders with your GitHub username and repository name after deploying)*

---

## ✨ Key Features

- **Live Camera Transformation:** Uses your device's camera for an immersive, real-time experience.
- **Three Creative Modes:**
  - **Manual Prompt:** You're the artist. Describe any transformation you can imagine (e.g., "make it a vibrant cartoon," "turn the scene into a watercolor painting").
  - **One Frame Story:** Provide a theme (e.g., "a forgotten memory") and let the AI create both a transformed visual and a short, imaginative narrative to go with it.
  - **Background Swap:** Seamlessly replace your background with any image you choose, keeping people in the foreground perfectly segmented.
- **Instant Results:** See the AI-generated image appear moments after you capture a photo.
- **Download Creations:** Save your favorite AI-transformed images directly to your device.
- **Responsive Design:** A clean, modern UI that works beautifully on both desktop and mobile browsers.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI Model:** Google Gemini API (`gemini-2.5-flash-image`)
- **Environment:** Runs directly in the browser using ES Modules, requiring no complex build setup.

---

## ⚙️ How It Works

The application follows a simple yet powerful workflow:

1.  **Mode Selection:** The user chooses one of the three creative modes.
2.  **Input:** Depending on the mode, the user either types a text prompt or uploads a background image.
3.  **Capture Sequence:** The app starts a 3-second countdown and captures a single frame from the user's camera feed.
4.  **API Request:** The captured frame (and background image, if applicable) is sent to the Gemini API along with a carefully constructed prompt.
5.  **AI Processing:** Gemini processes the input and generates a new, transformed image (and a narrative in 'Director' mode).
6.  **Display:** The transformed image is displayed in the "AI Transformed" view, ready for the user to download.

---

## 🌐 Deploying to GitHub Pages

This project is configured for a simple, no-build-step deployment, which is perfect for GitHub Pages.

### Step-by-Step Instructions:

1.  **Create a GitHub Repository:**
    - Make sure all the project files (`index.html`, `index.tsx`, `App.tsx`, etc.) are pushed to a GitHub repository.

2.  **Enable GitHub Pages:**
    - Navigate to your repository on GitHub.
    - Click on the **Settings** tab.
    - In the left sidebar, click on **Pages**.
    - Under the "Build and deployment" section, for the **Source**, select **Deploy from a branch**.
    - Choose the branch your code is on (e.g., `main` or `master`) and select the `/ (root)` folder.
    - Click **Save**.

3.  **Access Your Site:**
    - GitHub will generate and display a URL for your live site (e.g., `https://<your-username>.github.io/<your-repo-name>/`).
    - It may take a few minutes for the site to become live. If you see a 404 error, wait a few minutes and refresh.

### A Note on the API Key

This project is designed to run in an environment where the Gemini `API_KEY` is securely provided as an environment variable (`process.env.API_KEY`).

When deploying to a static hosting service like GitHub Pages, there is no backend to securely store keys. This project is best suited for platforms (like Google AI Studio) that handle the injection of this key for you. If you are running this outside of such an environment, you will need to manage the API key's availability to the client-side code yourself.
