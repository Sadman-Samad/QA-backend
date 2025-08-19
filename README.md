# Document Q&A Backend

A Node.js/Express backend for an AI-powered document question-answering system. Processes uploaded documents and provides AI-generated answers based on document content.

## Features

- File upload support (PDF, DOCX, TXT)
- AI-powered question answering using OpenAI
- MongoDB integration for document storage
- RESTful API endpoints
- File processing and text extraction
- CORS enabled for frontend integration

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Cohere API** - AI integration
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (cloud)
- Cohere API account
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd document-qa-app/server
