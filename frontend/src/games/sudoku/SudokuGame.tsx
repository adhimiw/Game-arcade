import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Pause, 
  Play, 
  RotateCcw, 
  Lightbulb, 
  Trophy,
  Clock,
  Target,
  Star
} from 'lucide-react'
import { useSudokuStore } from '../../store/sudokuStore'
import { useAuthStore } from '../../store/authStore'

const SudokuGame = () => {
  const {
    board,
    selectedCell,
    isCompleted,
    startTime,
    endTime,
    difficulty,
    mistakes,
    score,
    initializeBoard,
    selectCell,
    setCellValue,
    clearCell,
    getHint,
    resetGame,
    calculateScore
  } = useSudokuStore()

  const { user } = useAuthStore()
  const [isPaused, setIsPaused] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !isPaused && !isCompleted && startTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, isPaused, isCompleted, startTime])

  // Victory effect
  useEffect(() => {
    if (isCompleted && !showVictory) {
      setShowVictory(true)
      calculateScore()
    }
  }, [isCompleted, showVictory, calculateScore])

  const handleCellClick = (row: number, col: number) => {
    if (!board.isFixed[row][col]) {
      selectCell(row, col)
      if (!gameStarted) {
        setGameStarted(true)
      }
    }
  }

  const handleNumberInput = (number: number) => {
    if (selectedCell && !board.isFixed[selectedCell.row][selectedCell.col]) {
      setCellValue(selectedCell.row, selectedCell.col, number)
    }
  }

  const handleClearCell = () => {
    if (selectedCell && !board.isFixed[selectedCell.row][selectedCell.col]) {
      clearCell(selectedCell.row, selectedCell.col)
    }
  }

  const startNewGame = (newDifficulty: typeof difficulty) => {
    setGameStarted(false)
    setIsPaused(false)
    setShowVictory(false)
    setTimeElapsed(0)
    initializeBoard(newDifficulty)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (diff: typeof difficulty) => {
    switch (diff) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-red-400'
    }
  }

  const renderCell = (row: number, col: number) => {
    const cellValue = board.current[row][col]
    const isSelected = selectedCell?.row === row && selectedCell?.col === col
    const isFixed = board.isFixed[row][col]
    const hasMistake = board.mistakes[row][col]

    return (
      <motion.div
        key={`${row}-${col}`}
        className={`
          sudoku-cell relative cursor-pointer select-none
          ${isSelected ? 'selected' : ''}
          ${hasMistake ? 'bg-red-500/20 border-red-500' : ''}
          ${isFixed ? 'prefilled' : ''}
          ${!isFixed && cellValue !== 0 ? 'bg-white/10' : ''}
        `}
        onClick={() => handleCellClick(row, col)}
        whileHover={{ scale: isFixed ? 1 : 1.02 }}
        whileTap={{ scale: isFixed ? 1 : 0.98 }}
      >
        {cellValue !== 0 && (
          <span className={`text-lg font-bold ${isFixed ? 'prefilled' : 'text-white'}`}>
            {cellValue}
          </span>
        )}
        
        {/* Highlight related cells */}
        {selectedCell && !isSelected && (
          (selectedCell.row === row || 
           selectedCell.col === col || 
           (Math.floor(selectedCell.row / 3) === Math.floor(row / 3) && 
            Math.floor(selectedCell.col / 3) === Math.floor(col / 3))) && (
            <div className="absolute inset-0 bg-neon-blue/10" />
          )
        )}
      </motion.div>
    )
  }

  const difficultyButtons = [
    { value: 'easy', label: 'Easy', color: 'from-green-500 to-emerald-500' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-500 to-orange-500' },
    { value: 'hard', label: 'Hard', color: 'from-red-500 to-pink-500' }
  ]

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Sudoku Master
            </span>
          </h1>
          <p className="text-white/60">Challenge your mind with numbers</p>
        </motion.div>

        {/* Game Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-xl p-6 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Difficulty Selection */}
            <div className="flex items-center space-x-2">
              <span className="text-white/80 font-medium">Difficulty:</span>
              {difficultyButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => startNewGame(btn.value as typeof difficulty)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    difficulty === btn.value
                      ? `bg-gradient-to-r ${btn.color} text-white`
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Game Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-neon-blue" />
                <span className="text-white font-mono">{formatTime(timeElapsed)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-red-400" />
                <span className="text-white">{mistakes} mistakes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className={`font-bold ${getDifficultyColor(difficulty)}`}>
                  {difficulty.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                disabled={!gameStarted || isCompleted}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPaused ? <Play className="h-4 w-4 text-white" /> : <Pause className="h-4 w-4 text-white" />}
              </button>
              <button
                onClick={resetGame}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={getHint}
                disabled={!selectedCell || isCompleted}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lightbulb className="h-4 w-4 text-yellow-400" />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Board */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="glass-dark rounded-xl p-6">
              <div className="sudoku-grid">
                {board.current.map((_, rowIndex) =>
                  board.current[rowIndex].map((_, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        relative
                        ${colIndex % 3 === 0 && colIndex !== 0 ? 'border-l-2 border-white/40' : ''}
                        ${rowIndex % 3 === 0 && rowIndex !== 0 ? 'border-t-2 border-white/40' : ''}
                        ${rowIndex === 8 ? 'border-b-2 border-white/40' : ''}
                        ${colIndex === 8 ? 'border-r-2 border-white/40' : ''}
                      `}
                    >
                      {renderCell(rowIndex, colIndex)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Number Pad & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Number Pad */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 text-center">Number Pad</h3>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                  <button
                    key={number}
                    onClick={() => handleNumberInput(number)}
                    disabled={!selectedCell || board.isFixed[selectedCell.row][selectedCell.col]}
                    className="aspect-square bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={handleClearCell}
                  disabled={!selectedCell || board.isFixed[selectedCell.row][selectedCell.col]}
                  className="aspect-square bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 col-span-3"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Game Info */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Game Info</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Status:</span>
                  <span className={`font-bold ${isCompleted ? 'text-green-400' : isPaused ? 'text-yellow-400' : 'text-neon-blue'}`}>
                    {isCompleted ? 'Completed' : isPaused ? 'Paused' : 'Playing'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Time:</span>
                  <span className="text-white font-mono">{formatTime(timeElapsed)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Mistakes:</span>
                  <span className="text-red-400 font-bold">{mistakes}</span>
                </div>
                {isCompleted && (
                  <>
                    <hr className="border-white/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-white/80">Final Score:</span>
                      <span className="text-yellow-400 font-bold text-lg">{score}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">How to Play</h3>
              <div className="text-sm text-white/60 space-y-2">
                <p>• Click a cell to select it</p>
                <p>• Use the number pad to fill in numbers</p>
                <p>• Each row, column, and 3×3 box must contain all digits 1-9</p>
                <p>• No duplicates allowed in any row, column, or box</p>
                <p>• Use hints wisely - they reduce your score</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Victory Modal */}
        <AnimatePresence>
          {showVictory && isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowVictory(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="glass-dark rounded-2xl p-8 max-w-md mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6">
                  <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">Congratulations!</h2>
                  <p className="text-white/60">You've completed the Sudoku puzzle!</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Time:</span>
                    <span className="text-white font-mono">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Mistakes:</span>
                    <span className="text-red-400 font-bold">{mistakes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Difficulty:</span>
                    <span className={`font-bold ${getDifficultyColor(difficulty)}`}>
                      {difficulty.toUpperCase()}
                    </span>
                  </div>
                  <hr className="border-white/20" />
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Final Score:</span>
                    <span className="text-yellow-400 font-bold text-xl">{score}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => startNewGame(difficulty)}
                    className="flex-1 btn-primary"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setShowVictory(false)}
                    className="flex-1 btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SudokuGame