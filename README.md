# 🚀 Developer Portfolio Template

Welcome to the Developer Portfolio Template! This is a super cool, futuristic, terminal-style website built for developers. 

Don't worry if you are completely new to coding—this guide is written so simply that anyone can follow it! Let's get your new portfolio up and running.

---

## 🛠️ Step 1: Get the Tools You Need
Before we start, your computer needs a special program to understand the website's code.
1. Go to [Node.js](https://nodejs.org/) and download the "Recommended for Most Users" version.
2. Install it just like a normal program (click next, next, finish).

## 📥 Step 2: Download This Website
1. Click the big green **"Code"** button at the top of this GitHub page.
2. Click **"Download ZIP"**.
3. Once downloaded, extract (unzip) the folder and open it in a code editor like [Visual Studio Code](https://code.visualstudio.com/).

## 🧩 Step 3: Download the Missing Puzzle Pieces
Websites use lots of background files to work. Instead of making you download them all manually, we can tell your computer to fetch them automatically!
1. Open your code editor (like VS Code).
2. Open the **Terminal** inside your editor (In VS Code, go to the top menu: `Terminal > New Terminal`).
3. Type this exact command and hit Enter:
   ```bash
   npm install
   ```
   *(Wait a minute or two while your computer downloads all the background files!)*

## ✏️ Step 4: Add Your Own Information
Right now, the website belongs to "John Doe". Let's make it yours!
1. Go into the `src` folder.
2. Find the file named `config.template.ts`.
3. **Right-click** the file and select **Rename**.
4. Change the name to exactly: `config.ts` (remove the ".template" part).
5. Open your new `config.ts` file! You will see John Doe's name, skills, and projects. Just delete his text and type yours instead! 

## 💻 Step 5: See Your Website Live!
Want to see what it looks like on your own computer?
1. Go back to your Terminal.
2. Type this command and hit Enter:
   ```bash
   npm run dev
   ```
3. It will give you a web link that looks like `http://localhost:5173`. Hold `Ctrl` (or `Cmd` on Mac) and click that link. Your brand new portfolio will open in your browser!

## 🚀 Step 6: Put It On The Internet For Free!
When you are ready to show the world, you can host it online for free using Vercel.
1. Go to [Vercel.com](https://vercel.com/) and create a free account.
2. Click **"Add New Project"**.
3. You can either link your own GitHub account to import your code, OR just drag-and-drop the entire folder from your computer straight into Vercel!
4. Vercel will give you a live `.vercel.app` link that you can share with anyone!

---
*Enjoy your awesome new portfolio!* 🎈
