# Something Ghoulish Photo Booth

Welcome to the Something Ghoulish Photo Booth! This is an interactive, Halloween-themed web application that leverages the power of Google's Gemini API to transform your live camera feed into spooky and hilarious creations. 

[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini-orange.svg)](https://ai.google.dev/)

---

## ✨ Key Features

- **Live Camera Transformation:** Uses your device's camera for an immersive, real-time experience.
- **Three Spooky Modes:**
  - **🎃 PUMPKIN ME!:** Transforms every person in the photo into a pumpkin-headed creature.
  - **👻 Haunting:** Places you and your friends into a creepy, haunted scene like a graveyard or a haunted house.
  - **🧛 Costume:** Instantly gives everyone in the photo a classic Halloween costume like a vampire, mummy, or Frankenstein's monster.
- **Photo Gallery:** Automatically saves all your cursed creations in a gallery at the bottom of the page.
- **Download Creations:** Save your favorite AI-transformed images directly to your device.
- **Responsive Design:** A spooky, modern UI that works beautifully on both desktop and mobile browsers.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI Model:** Google Gemini API (`gemini-2.5-flash-image`)
- **Environment:** Runs directly in the browser using ES Modules, requiring no complex build setup.

---

## ⚙️ How It Works

The application follows a simple yet powerful workflow:

1.  **Mode Selection:** The user clicks one of the three spooky transformation buttons.
2.  **Capture Sequence:** The app starts a 3-second countdown and captures a single frame from the user's camera feed.
3.  **API Request:** The captured frame is sent to the Gemini API along with a carefully constructed prompt based on the selected mode.
4.  **AI Processing:** Gemini processes the input and generates a new, transformed image.
5.  **Display & Save:** The transformed image is displayed in the "CURSED" view and simultaneously added to the photo gallery at the bottom of the screen.

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
    - GitHub will generate and display a URL for your live site. It may take a few minutes for the site to become live.

### A Note on the API Key

This project is designed to run in an environment where the Gemini `API_KEY` is securely provided as an environment variable (`process.env.API_KEY`), such as Google AI Studio.
