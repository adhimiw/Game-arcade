import { create } from 'zustand'

export interface SudokuBoard {
  puzzle: number[][]
  solution: number[][]
  current: number[][]
  mistakes: number[][]
  isFixed: boolean[][]
}

export interface SudokuGameState {
  board: SudokuBoard
  selectedCell: { row: number; col: number } | null
  isCompleted: boolean
  startTime: number | null
  endTime: number | null
  difficulty: 'easy' | 'medium' | 'hard'
  difficultyMultiplier: number
  hintUsed: boolean
  mistakes: number
  score: number
}

interface SudokuActions {
  initializeBoard: (difficulty: 'easy' | 'medium' | 'hard') => void
  selectCell: (row: number, col: number) => void
  setCellValue: (row: number, col: number, value: number) => void
  clearCell: (row: number, col: number) => void
  checkMistake: (row: number, col: number, value: number) => boolean
  completeGame: () => void
  resetGame: () => void
  getHint: () => void
  calculateScore: () => number
}

const createEmptyBoard = (): number[][] => 
  Array(9).fill(null).map(() => Array(9).fill(0))

const createEmptyMistakes = (): boolean[][] => 
  Array(9).fill(null).map(() => Array(9).fill(false))

const createEmptyFixed = (): boolean[][] => 
  Array(9).fill(null).map(() => Array(9).fill(false))

const generateSudoku = (difficulty: 'easy' | 'medium' | 'hard'): SudokuBoard => {
  // This is a simplified Sudoku generator
  // In a real implementation, you'd use a proper Sudoku generation algorithm
  const solution = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
  ]

  // Create puzzle by removing numbers based on difficulty
  const difficultyConfig = {
    easy: { holes: 36 },      // 45 given numbers
    medium: { holes: 48 },    // 33 given numbers  
    hard: { holes: 54 }       // 27 given numbers
  }

  const { holes } = difficultyConfig[difficulty]
  const puzzle = solution.map(row => [...row])
  
  // Randomly remove numbers to create puzzle
  const cellsToRemove = holes
  let removed = 0
  
  while (removed < cellsToRemove) {
    const row = Math.floor(Math.random() * 9)
    const col = Math.floor(Math.random() * 9)
    
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0
      removed++
    }
  }

  // Create fixed cells mask
  const isFixed = puzzle.map((row, rowIndex) =>
    row.map((cell, colIndex) => cell !== 0)
  )

  return {
    puzzle,
    solution,
    current: puzzle.map(row => [...row]),
    mistakes: createEmptyMistakes(),
    isFixed
  }
}

const getDifficultyMultiplier = (difficulty: 'easy' | 'medium' | 'hard'): number => {
  switch (difficulty) {
    case 'easy': return 1
    case 'medium': return 1.5
    case 'hard': return 2
    default: return 1
  }
}

export const useSudokuStore = create<SudokuGameState & SudokuActions>((set, get) => ({
  // Initial state
  board: {
    puzzle: createEmptyBoard(),
    solution: createEmptyBoard(),
    current: createEmptyBoard(),
    mistakes: createEmptyMistakes(),
    isFixed: createEmptyFixed()
  },
  selectedCell: null,
  isCompleted: false,
  startTime: null,
  endTime: null,
  difficulty: 'medium',
  difficultyMultiplier: 1.5,
  hintUsed: false,
  mistakes: 0,
  score: 0,

  // Actions
  initializeBoard: (difficulty) => {
    const board = generateSudoku(difficulty)
    const difficultyMultiplier = getDifficultyMultiplier(difficulty)
    
    set({
      board,
      selectedCell: null,
      isCompleted: false,
      startTime: Date.now(),
      endTime: null,
      difficulty,
      difficultyMultiplier,
      hintUsed: false,
      mistakes: 0,
      score: 0
    })
  },

  selectCell: (row, col) => {
    const { board } = get()
    if (board.isFixed[row][col]) return
    
    set({ selectedCell: { row, col } })
  },

  setCellValue: (row, col, value) => {
    const { board, selectedCell, startTime } = get()
    if (board.isFixed[row][col]) return
    
    const newCurrent = board.current.map(r => [...r])
    newCurrent[row][col] = value
    
    const isCorrect = board.solution[row][col] === value
    const newMistakes = board.mistakes.map(r => [...r])
    newMistakes[row][col] = !isCorrect
    
    const updatedBoard = {
      ...board,
      current: newCurrent,
      mistakes: newMistakes
    }

    // Check if game is completed
    let isCompleted = false
    if (value !== 0) {
      isCompleted = updatedBoard.current.every((row, rIndex) =>
        row.every((cell, cIndex) =>
          cell === updatedBoard.solution[rIndex][cIndex]
        )
      )
    }

    const newMistakes = isCorrect ? get().mistakes : get().mistakes + 1

    set({
      board: updatedBoard,
      selectedCell: { row, col },
      mistakes: newMistakes,
      isCompleted,
      endTime: isCompleted ? Date.now() : null
    })

    // Auto-save progress
    if (startTime) {
      const progress = {
        current: newCurrent,
        mistakes: newMistakes,
        timestamp: Date.now()
      }
      localStorage.setItem(`sudoku-progress-${get().difficulty}`, JSON.stringify(progress))
    }
  },

  clearCell: (row, col) => {
    get().setCellValue(row, col, 0)
  },

  checkMistake: (row, col, value) => {
    const { board } = get()
    return board.solution[row][col] !== value
  },

  completeGame: () => {
    set({
      isCompleted: true,
      endTime: Date.now()
    })
  },

  resetGame: () => {
    set({
      board: {
        ...get().board,
        current: get().board.puzzle.map(row => [...row]),
        mistakes: createEmptyMistakes()
      },
      selectedCell: null,
      isCompleted: false,
      startTime: Date.now(),
      endTime: null,
      mistakes: 0,
      score: 0
    })
  },

  getHint: () => {
    const { board } = get()
    const { row, col } = get().selectedCell || {}
    
    if (row === undefined || col === undefined) return
    
    const solution = board.solution[row][col]
    if (solution !== 0) {
      get().setCellValue(row, col, solution)
      set({ hintUsed: true })
    }
  },

  calculateScore: () => {
    const { difficultyMultiplier, mistakes, startTime, endTime } = get()
    
    if (!startTime || !endTime) return 0
    
    const timeInSeconds = Math.floor((endTime - startTime) / 1000)
    const baseScore = difficultyMultiplier * 1000
    const timePenalty = timeInSeconds * 2
    const mistakePenalty = mistakes * 50
    const hintPenalty = get().hintUsed ? 100 : 0
    
    const score = Math.max(0, baseScore - timePenalty - mistakePenalty - hintPenalty)
    
    set({ score })
    return score
  }
}))