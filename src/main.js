import './style.css'
import { SudokuGenerator } from './generator.js'

const generator = new SudokuGenerator();
const boardElement = document.querySelector('#sudoku-board');
const generateBtn = document.querySelector('#generate-btn');
const difficultySelect = document.querySelector('#difficulty');

// Constants
const STORAGE_KEY = 'simple_sudoku_save_v1';

generateBtn.addEventListener('click', () => {
  if (confirm('Start a new game? Current progress will be lost.')) {
    localStorage.removeItem(STORAGE_KEY);
    startNewGame();
  }
});


// State
let currentPuzzle = []; // The initial puzzle state
let currentSolution = [];
let selectedCell = null;

// Timer State
let startTime;
let timerInterval;
let accumulatedTime = 0; // Time from previous sessions

function saveGame() {
  const userGrid = [];
  const cells = document.querySelectorAll('.cell');

  // Capture current board state (user inputs)
  cells.forEach((cell, index) => {
    // We only care about user inputs, not the given numbers (which are in currentPuzzle)
    // But to be safe and simple, let's just save the full grid state as we see it
    // Actually, distinct separation is better. Let's save the user inputs separately.
    // Optimization: Just save the full 81 text values.
    userGrid.push(cell.textContent || '');
  });

  // Calculate current elapsed time to save
  const currentSessionTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const totalTime = accumulatedTime + currentSessionTime;

  const gameState = {
    puzzle: currentPuzzle,
    solution: currentSolution,
    userGrid: userGrid,
    difficulty: difficultySelect.value,
    elapsedTime: totalTime,
    timestamp: Date.now()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
}

function loadGame() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return false;

  try {
    const gameState = JSON.parse(saved);

    // Restore state
    currentPuzzle = gameState.puzzle;
    currentSolution = gameState.solution;
    accumulatedTime = gameState.elapsedTime || 0;
    difficultySelect.value = gameState.difficulty;

    // Render board with original puzzle
    renderBoard(currentPuzzle);

    // Apply saved user inputs
    const cells = document.querySelectorAll('.cell');
    gameState.userGrid.forEach((value, index) => {
      if (value && cells[index] && !cells[index].classList.contains('given')) {
        cells[index].textContent = value;
      }
    });

    // Start timer with accumulated time
    startTimer(true);

    return true;
  } catch (e) {
    console.error('Failed to load game', e);
    return false;
  }
}

function startTimer(isResuming = false) {
  clearInterval(timerInterval);
  startTime = Date.now();
  const timerElement = document.getElementById('timer');

  // If we are starting a fresh game, reset accumulated time
  if (!isResuming) {
    accumulatedTime = 0;
  }

  const updateTimer = () => {
    const currentSessionTime = Math.floor((Date.now() - startTime) / 1000);
    const totalTime = accumulatedTime + currentSessionTime;
    timerElement.textContent = formatTime(totalTime);
  };

  timerInterval = setInterval(updateTimer, 1000);
  updateTimer(); // Initial call
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function startNewGame() {
  const difficulty = parseInt(difficultySelect.value);
  const { puzzle, solution } = generator.generatePuzzle(difficulty);

  currentPuzzle = puzzle;
  currentSolution = solution;
  selectedCell = null; // Reset selection

  renderBoard(puzzle);
  startTimer(false); // Start fresh timer
  saveGame(); // Save initial state
}

function checkWin() {
  const cells = document.querySelectorAll('.cell');
  let isFull = true;
  let isCorrect = true;

  for (let i = 0; i < 81; i++) {
    const cell = cells[i];
    const row = Math.floor(i / 9);
    const col = i % 9;

    let value;
    if (cell.textContent) {
      value = parseInt(cell.textContent);
    } else {
      isFull = false;
      // Continue to check correctness of filled cells
    }

    // Only check correctness if there is a value
    if (value && value !== currentSolution[row][col]) {
      isCorrect = false;
    }
  }

  if (isFull && isCorrect) {
    stopTimer();
    const elapsedTime = document.getElementById('timer').textContent;
    // Clear save on win
    localStorage.removeItem(STORAGE_KEY);

    // Small delay to let the UI update the last number
    setTimeout(() => {
      alert(`Congratulations! You solved the Sudoku in ${elapsedTime}!`);
    }, 100);
  } else {
    // Save state for all other cases (in-progress or full-but-wrong)
    saveGame();

    if (isFull && !isCorrect) {
      setTimeout(() => {
        alert('Keep trying! Something is not quite right.');
      }, 100);
    }
  }
}

function renderBoard(puzzle) {
  boardElement.innerHTML = '';

  puzzle.forEach((row, rIndex) => {
    row.forEach((num, cIndex) => {
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Add thick borders for visual separation of 3x3 boxes
      if ((cIndex + 1) % 3 === 0 && cIndex < 8) {
        cell.classList.add('border-right');
      }
      if ((rIndex + 1) % 3 === 0 && rIndex < 8) {
        cell.classList.add('border-bottom');
      }

      if (num !== 0) {
        cell.textContent = num;
        cell.classList.add('given'); // Mark as part of the puzzle (not user input)
      } else {
        // Make cell clickable for selection
        cell.addEventListener('click', () => {
          if (selectedCell) {
            selectedCell.classList.remove('selected');
          }
          selectedCell = cell;
          cell.classList.add('selected');
        });
      }
      boardElement.appendChild(cell);
    });
  });
}

// Global Input Handling (Numpad buttons)
document.querySelectorAll('.num-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (!selectedCell) return;

    // Check if it's a clear button or number
    const value = e.target.getAttribute('data-value');
    if (value === 'clear') {
      selectedCell.textContent = '';
    } else {
      selectedCell.textContent = value;
    }
    checkWin();
  });
});

// Global Keyboard Handling
document.addEventListener('keydown', (e) => {
  if (!selectedCell) return;

  const key = e.key;
  if (/^[1-9]$/.test(key)) {
    selectedCell.textContent = key;
    checkWin();
  } else if (key === 'Backspace' || key === 'Delete') {
    selectedCell.textContent = '';
    checkWin();
  }
});

// Initialization Logic
// Try to load saved game, otherwise start new
if (!loadGame()) {
  startNewGame();
}

