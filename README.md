# Getting Started

Follow these instructions to set up and run the application on your local machine

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- MongoDB (v4.4 or later) or Docker

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LinasLion/tattooStudio.git
   cd tattooStudio
   ```

2. Install dependencies for Web APP:
   ```bash
   cd tattooStudio
   npm install
   ```

3. Install dependencies for API:
   ```bash
   cd tattooStudio-api
   npm install
   ```

## Setting Up MongoDB

### Use MongoDB locally

1. Install MongoDB on your machine following the [official installation guide](https://docs.mongodb.com/manual/installation/)
2. Start the MongoDB service:
   ```bash
   sudo systemctl start mongod
   ```
   On Windows, MongoDB typically runs as a service automatically after installation

3. Connect to local instance using MongoDB Compass
   
## Running the Application

Start both the API server and client application with a single command:

API: 

```bash
cd tattooStudio-api
npm run dev
```

APP:

```bash
cd tattooStudio
npm run dev
```

This will concurrently run:
- The backend API server.
- The frontend application.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
JWT_SECRET=a843cc6e-2761-4e1d-b61b-0b5332a6686f
MONGODB_URI=mongodb://localhost:27017/studioDb
```
