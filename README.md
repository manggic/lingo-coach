# 🎙️ LingoCoach AI

LingoCoach AI is a modern, voice-first language learning and grammar correction tool. It allows users to speak naturally in a target language, receive instant grammatical feedback, understand the "why" behind corrections, and see translations across English, Hindi, and Marathi.

## ✨ Features

* **Voice-to-Text Integration**: Uses the Web Speech API for real-time transcription of spoken phrases.
* **AI-Powered Grammar Coaching**: Leverages Google Gemini 2.5 Flash to analyze syntax, tense, and tone.
* **Editable Transcripts**: Fix misheard words manually before submitting for analysis.
* **Cross-Language Translation**: Automatically translates corrected text between English, Hindi, and Marathi.
* **Linguistic Explanations**: Provides "Coaching Notes" to help users understand their mistakes for long-term learning.
* **Responsive Dashboard**: A clean, two-column UI built with Tailwind CSS that adapts to mobile and desktop screens.

## 🛠️ Tech Stack

* **Frontend**: React (Vite)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Voice Engine**: Web Speech API (Browser Native)
* **AI Engine**: Google Gemini 2.5 Flash API

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher)
* A Google AI Studio API Key ([Get one here](https://aistudio.google.com/))

### Installation

1. **Clone the repository or download the files.**
2. **Install dependencies**:
   ```bash
   npm install
   # or
   npm install lucide-react