# LokKatha AI - Teammate Setup Guide 🚀

Welcome to the team! This guide will help you pull the code, set it up on your computer, run it, and capture the best parts of our project for the hackathon submission. Don't worry if you are a beginner, just follow these steps!

---

## 🛠️ Step 1: Get the Code & Install Dependencies

1. **Pull the latest code** from GitHub. Open your terminal (or Command Prompt/Git Bash) and run:
   ```bash
   git pull origin main
   ```
   *(If you haven't cloned it yet, use `git clone <repository-url>`)*

2. **Install the required packages.** Make sure you are inside the `LokKatha-AI` folder in your terminal, then run:
   ```bash
   npm install
   ```
   *This might take a minute or two to download everything.*

---

## 🔑 Step 2: Set Up Environment Variables

Our AI and database need secret keys to work. 

1. Create a new file in the root folder (right next to `package.json`) and name it **exactly**: `.env.local`
2. **I will send you the keys separately.** Copy and paste the keys I give you into this `.env.local` file. It will look something like this:
   ```env
   GOOGLE_API_KEY="your_api_key_here"
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url_here"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key_here"
   ```
3. Save the file.

---

## 🚀 Step 3: Run the Project

1. In your terminal, run the following command to start the development server:
   ```bash
   npm run dev
   ```
2. Open your web browser (Chrome is recommended) and go to: **[http://localhost:3000](http://localhost:3000)**
3. You should see our beautiful LokKatha AI landing page!

---

## 📸 Step 4: What to Showcase for the Submission (The "Wow" Factors)

For our submission, we need to show the judges the absolute best parts of our project. Here is what you should focus on interacting with and taking screenshots of:

1. **The Hero/Landing Page**: Show the gorgeous Bengali manuscript design and the cinematic intro.
2. **The "Ask LokKatha" Chat**: Scroll down to the chat section.
   - Click one of the suggested chips like *"Who is Lalkamal?"* or *"Tell me a fairy tale"*.
   - **Screenshot 1**: Capture the AI streaming the response with the little quill icon (🪶).
   - **Screenshot 2**: Capture the final response showing the **Curated Image** (if you asked about Behula or Lalkamal) and the **Source Cards** at the bottom.
3. **The Story Preview Drawer**: 
   - Click on one of the **Source Cards** (e.g., *Thakurmar Jhuli*). A side drawer will slide in!
   - **Screenshot 3**: Capture this drawer showing the story title, book, and characters.
4. **The Audio/Toolbar Features**:
   - Show the toolbar under the chat which has the **Share**, **Print/Save**, and **Story Narration** buttons. Click the Narration button to hear the story!

---

## ✂️ How to Take Good Screenshots

- **Windows**: Press `Windows Key + Shift + S`. You can click and drag to select the exact part of the screen you want.
- **Mac**: Press `Command + Shift + 4`. Click and drag to select the area.
- **Tip**: Try to capture the beautiful terracotta borders and the paper-textured backgrounds. Don't crop too tightly!

---

**You're all set! Let me know if you run into any errors or need the `.env` keys. Let's win this! 🏆**
