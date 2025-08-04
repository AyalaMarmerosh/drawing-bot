# Drawing Bot

A full-stack drawing application featuring a React frontend and a .NET Core backend.

## Project Structure

- `DrawingBot/` — Backend API built with .NET Core
- `drawing-bot-client/` — Frontend application built with React

## Features

- User authentication with JWT
- Generate drawing commands from text prompts using Gemini API
- Save, load, undo, and redo drawings
- Interactive canvas to display drawings
- Responsive and user-friendly interface

## Getting Started

### Prerequisites

- .NET 7 SDK or later
- Node.js (v16 or later)
- SQL Server instance (configured in backend connection string)

### Backend Setup

1. Navigate to `DrawingBot` folder
2. Update your `appsettings.json` with your connection string and JWT settings
3. Run the backend server:
   ```bash
   dotnet run


