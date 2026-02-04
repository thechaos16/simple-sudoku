import './style.css'
import { SudokuGenerator } from './generator.js'

const generator = new SudokuGenerator();
const boardElement = document.querySelector('#sudoku-board');
const generateBtn = document.querySelector('#generate-btn');
const difficultySelect = document.querySelector('#difficulty');

generateBtn.addEventListener('click', startNewGame);


let currentSolution = [];

function startNewGame() {
  const difficulty = parseInt(difficultySelect.value);
  const { puzzle, solution } = generator.generatePuzzle(difficulty);
  currentSolution = solution;
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
    if (cell.classList.contains('given')) {
      value = parseInt(cell.textContent);
    } else {
      const input = cell.querySelector('input');
      if (input.value) {
        value = parseInt(input.value);
      } else {
        isFull = false;
        // Continue to check other cells if we want validation state, but for game end, full is required.
      }
    }

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
        const input = document.createElement('input');
        input.type = 'text'; // using text to allow clearing easily, or number
        input.maxLength = 1;
        input.addEventListener('input', (e) => {
          const val = e.target.value;
          if (!/^[1-9]$/.test(val)) {
            e.target.value = '';
          }
          checkWin();
        });
        cell.appendChild(input);
      }
      boardElement.appendChild(cell);
    });
  });
}

// Start a game immediately
startNewGame();
