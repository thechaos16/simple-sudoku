# Simple Sudoku Webapp

A clean, responsive, and lightweight Sudoku web application containing a built-in puzzle generator. This project demonstrates a pure Vanilla JavaScript implementation using Vite.

## Features

- **Sudoku Generator**: Generates valid, unique Sudoku puzzles on the fly.
- **Difficulty Levels**: Choose from Easy, Medium, and Hard difficulties.
- **Interactive UI**: Clean grid interface with input validation (numbers 1-9 only).
- **Responsive Design**: Works on desktop and mobile.
- **Fast & Minimal**: Built with Vanilla JS and Vite for optimal performance.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (usually comes with Node.js)

### Installation

1.  Clone the repository (if applicable) or navigate to the project directory:
    ```bash
    cd simple-sudoku
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

## Tech Stack

- **Framework**: None (Vanilla JavaScript)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: CSS (Grid & Flexbox)

## Project Structure

- `src/generator.js`: Contains the `SudokuGenerator` class with backtracking algorithm.
- `src/main.js`: Handles UI logic, event listeners, and board rendering.
- `src/style.css`: Styles for the application.
- `index.html`: Main HTML entry point.
