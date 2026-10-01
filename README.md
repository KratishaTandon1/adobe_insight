# PDF Insight 📄✨

**Live Demo:** [adobe-insight-app.vercel.app](https://adobe-insight-app.vercel.app/)

---

## 📖 About The Project

PDF Insight is an intelligent document analysis platform designed to transform static PDFs into an interactive and dynamic experience. Powered by the Gemini LLM, this application allows users to not only manage their documents but also to "connect the dots" between them, uncovering hidden insights, generating contextual recommendations, and even creating on-demand audio summaries.

This project was built for the Adobe Hackathon, focusing on creating a rich, AI-powered user experience for document interaction.

---

## ✨ Key Features

* **📄 PDF Management & Cloud Storage**: Upload multiple PDFs at once with a simple drag-and-drop interface. All files are securely stored in the cloud, and a persistent database keeps track of your library.

* **🧠 AI-Powered Recommendations**: Define a "Persona" and a "Task" to receive context-aware snippets from across all your documents. This feature helps you find relevant information instantly without manual searching.

* **💡 Insights Bulb**: Go beyond simple search. The Insights Bulb uses an LLM to generate a high-level analysis of your documents, providing key takeaways, interesting facts, and potential counterpoints.

* **🎙️ Contextual Podcast Mode**: Generate on-demand audio summaries with a single click. Create a podcast for your recommendations, your insights, or even the current page you're reading in the PDF viewer.

* **💬 Interactive Chatbot**: Have a conversation with your documents. Ask questions in natural language, and the AI chatbot will find and deliver answers based on the content of your uploaded PDFs.

* **📝 Multi-Document Summarizer**: Select one or more PDFs from your library to generate beautiful, concise summaries (max 10 lines each), perfect for getting a quick overview of your content.

* **⚖️ AI Debate Generator**: Uncover nuance in your documents. This innovative feature identifies a debatable topic within your content and generates two opposing arguments, "For" and "Against," complete with evidence cited directly from the text.

* **⚡ On-Demand Insights**: While viewing a PDF, simply select a piece of text to get an instant, AI-generated insight about that specific selection, turning passive reading into an active analysis session.

---

## 🚀 Local Setup & Running with Docker

Follow these steps to run the entire application locally using Docker.

### Prerequisites

* Docker installed.
* A `.env` file created in the `backend` directory.

### 1. Set Up Your Environment

Create a file named `.env` inside the `backend` folder and add your secret keys:

```
# backend/.env

GEMINI_API_KEY=your-gemini-api-key
LLM_PROVIDER=gemini
GEMINI_MODEL=gemini-2.5-flash
TTS_PROVIDER=azure
AZURE_TTS_KEY=  
AZURE_TTS_ENDPOINT= 
```

### 2. Build and Run the Application

From the project's **root directory** (the one containing `frontend` and `backend`), run the following command:

```bash
 docker build -t adobe-round3 . 
```
```bash
 docker run -p 8080:8080 --env-file backend/.env adobe-round3 
```
These commands will:

1.  Build the Docker image for your backend server.
2.  Start the backend container, making it available at `http://localhost:8080`.

To run the frontend :
```bash
 cd frontend
 npm install
 npm start
```
 This will start the frontend React development server, making it available at `http://localhost:3000`.

The application will now be fully running on your local machine.
