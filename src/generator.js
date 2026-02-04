export class SudokuGenerator {
  constructor() {
    this.grid = Array.from({ length: 9 }, () => Array(9).fill(0));
  }

  // Generate a new valid Sudoku grid
  generate() {
    this.grid = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.fillGrid();
    return this.grid;
  }

  // Backtracking algorithm to fill the grid
  fillGrid() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.grid[row][col] === 0) {
          const numbers = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (let num of numbers) {
            if (this.isValid(row, col, num)) {
              this.grid[row][col] = num;
              if (this.fillGrid()) {
                return true;
              }
              this.grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  // Create a puzzle by removing numbers
  // difficulty: 0 (easy) - removes fewer numbers
  // difficulty: 1 (medium)
  // difficulty: 2 (hard)
  generatePuzzle(difficulty = 1) {
    // Generate a full valid grid first
    this.generate();

    // Create a copy for the puzzle
    let puzzle = this.grid.map(row => [...row]);

    let attempts = difficulty === 0 ? 30 : difficulty === 1 ? 40 : 50;

    while (attempts > 0) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);

      while (puzzle[row][col] === 0) {
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
      }

      // Store value in case we need to put it back (though simple removal is usually fine for basic constraint)
      // For a robust generator, we should check if uniqueness of solution is preserved, 
      // but for "simplest webapp", random removal is often acceptable initially or we check solution count.
      // Let's implement a basic uniqueness check to be "proper".

      let backup = puzzle[row][col];
      puzzle[row][col] = 0;

      // Copy puzzle to check solutions
      let copy = puzzle.map(r => [...r]);

      // If multiple solutions exist (or 0, but that shouldn't happen if we started from valid), put it back
      // Actually, checking for unique solution is computationally expensive. 
      // For "simplest", we might skip strict uniqueness or do a quick check.
      // Let's just do random removal for now as per "simplest" request, 
      // but ensure we don't remove too many to keep it playable.

      attempts--;
    }

    return { puzzle, solution: this.grid };
  }

  isValid(row, col, num, grid = this.grid) {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (grid[row][x] === num) return false;
    }

    // Check col
    for (let x = 0; x < 9; x++) {
      if (grid[x][col] === num) return false;
    }

    // Check 3x3 box
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
