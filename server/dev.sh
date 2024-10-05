#!/bin/bash

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Start Ngrok and expose port 3000
echo "Starting Ngrok on port 3000..."
if command_exists ngrok; then
  ngrok http 3000 &
else
  echo "Error: Ngrok not found. Please ensure it's installed globally and in your path."
  exit 1
fi

# Wait for Ngrok to initialize
sleep 5

# Check if Ngrok started successfully
if pgrep -f "ngrok" >/dev/null; then
  echo "Ngrok is running."
else
  echo "Error: Ngrok failed to start."
  exit 1
fi

# Run the NestJS development server
echo "Starting NestJS server in development mode..." 
if command_exists yarn; then
  yarn start:dev
else
  echo "Error: Yarn not found. Please ensure Yarn is installed."
  exit 1
fi
