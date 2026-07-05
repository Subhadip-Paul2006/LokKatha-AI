# LokKatha AI - Teammate Setup & Submission Guide

Welcome to LokKatha AI! This guide is specifically written for you to pull the repository, run the project locally, and take the correct screenshots for the hackathon submission.

---

## 1. Getting Started (Installation & Setup)

1. **Pull the Repository**
   Make sure you have pulled the latest changes from the `main` branch:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Install Dependencies**
   Run the following command in the root folder to install all required packages:
   ```bash
   npm install
   # or if using pnpm
   # pnpm install
   ```

3. **Set Up Environment Variables**
   Ask your teammate for the `.env` (or `.env.local`) file. It contains the Supabase and Google Gemini API keys.
   Place this `.env.local` file directly in the root of the project folder (next to `package.json`).

4. **Run the Project**
   Start the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## 2. Taking Screenshots for Submission

For the hackathon submission, the judges want to see the key features. Here is what you need to capture:

### Screenshot 1: The Landing Page (Hero Section)
- **How to capture**: Open the site and take a full-screen screenshot of the top section with the title "India's Living Cultural Memory".
- **Why**: Shows the theme and the immediate UI polish.

### Screenshot 2: Ask LokKatha (The AI Chat Interface)
- **How to capture**: Scroll down to the "Ask LokKatha" section (or click it in the nav). Type a question like *"Tell me the story of Lalkamal and Nilkamal"* and let the AI generate the response.
- **What to include in the shot**: The typed question, the generated response (showing markdown formatting), and most importantly, the **Source Cards** at the bottom of the response.

### Screenshot 3: Interactive Features
- **How to capture**: Hover over the "Play Audio" or "Voice Input" buttons to show the tooltips, or capture the "Suggested Follow-up Questions" at the bottom of a response.
- **Why**: Proves that the platform is accessible and fully featured.

### Screenshot 4: Heritage Timeline / Story Grid
- **How to capture**: Scroll down to the visual sections (Timeline and Grid). Take a screenshot showing the terracotta/traditional imagery.

---

## 3. Important Notes for the Submission Video / Demo
If you are recording a video demo, follow this flow:
1. **Start** on the beautiful landing page.
2. **Scroll** to the chat interface.
3. **Use Voice Input** (if your mic is working) to ask a question. This is a massive "wow" factor for the judges.
4. **Show the Sources**: When the AI answers, point out how it cites real books and PDFs using the RAG architecture.
5. **Click a Source**: Show how you can click a source card to open the original story context.

---

## 4. Troubleshooting

- **Deployment Error (`Missing getServerSnapshot`)**: If you see Vercel deployment errors from earlier today, **don't worry!** We have already fixed the `useSyncExternalStore` hydration bug. Just push the latest code and Vercel will build it successfully.
- **Blank Chat / API Errors**: Make sure your `.env.local` is correct and you have restarted the dev server (`Ctrl + C` then `npm run dev`) after adding the environment variables.

Good luck with the submission! You've got this! 🚀
