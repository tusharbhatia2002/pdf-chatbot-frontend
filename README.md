# ChatBuddy - Frontend

## Overview
ChatBuddy is a user-friendly web application that allows users to upload PDF documents and interact with a chatbot. The chatbot can answer questions based on the content of the uploaded PDFs and survey data from a backend database.

## Features
- **PDF Uploading**: Users can drag and drop PDF files or select them from their device.
- **Chat Interface**: Users can interact with the chatbot, which provides responses based on the uploaded PDFs and survey data.
- **Chat Suggestions**: Users receive suggestions for common queries to enhance their interaction experience.
- **Responsive Design**: The application is designed to be responsive and user-friendly across devices.

## Technologies Used
- **React**: For building the user interface.
- **Next.js**: For server-side rendering and routing.
- **Tailwind CSS**: For styling the application.
- **Shadcn UI**: For pre-built UI components that enhance the design and user experience.
- **Axios**: For making API calls to the backend.

## Installation
1. Clone the repository:
   git clone <repository-url>
   cd frontend
   
3. Install dependencies:
bash npm install

4. Start the development server:
bash npm run dev

5. Open your browser and navigate to `http://localhost:3000`.

## Usage
- **Upload PDFs**: Drag and drop a PDF file into the designated area or click to select a file.
- **Interact with the Chatbot**: Use the chat interface to ask questions or click on suggestions to populate the input field.
- **Receive Responses**: The chatbot will respond based on the content of the uploaded PDFs and survey data.

## API Integration
The frontend communicates with the following backend APIs:
- **POST /upload-pdf/**: Upload a PDF file.
- **POST /chat/**: Send a message to the chatbot.
- **POST /extract-key-points/**: Extract key points from a specified PDF.
- **GET /pdf-files/**: Retrieve a list of uploaded PDFs.
- **DELETE /delete-pdf/{filename}**: Delete a specified PDF.
