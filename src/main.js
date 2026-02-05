import './style.css'
import { SudokuGenerator } from './generator.js'

const generator = new SudokuGenerator();
const boardElement = document.querySelector('#sudoku-board');
const generateBtn = document.querySelector('#generate-btn');
const difficultySelect = document.querySelector('#difficulty');

generateBtn.addEventListener('click', startNewGame);


// State
let currentSolution = [];
let selectedCell = null;

function startNewGame() {
  const difficulty = parseInt(difficultySelect.value);
  const { puzzle, solution } = generator.generatePuzzle(difficulty);
  currentSolution = solution;
  selectedCell = null; // Reset selection
  renderBoard(puzzle);
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
    // Small delay to let the UI update the last number
    setTimeout(() => {
      alert('Congratulations! You solved the Sudoku!');
    }, 100);
  } else if (isFull && !isCorrect) {
    setTimeout(() => {
      alert('Keep trying! Something is not quite right.');
    }, 100);
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

// Start a game immediately
startNewGame();
