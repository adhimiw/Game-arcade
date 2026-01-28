import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Pause, 
  Play, 
  RotateCcw, 
  Trophy,
  Clock,
  Zap,
  Target,
  Heart,
  Settings
} from 'lucide-react'
import { useSnakeStore } from '../../store/snakeStore'
import { useAuthStore } from '../../store/authStore'

const SnakeGame = () => {
  const {
    snake,
    food,
    score,
    level,
    speed,
    isGameOver,
    isPaused,
    gameMode,
    obstacles,
    lives,
    timeElapsed,
    initializeGame,
    changeDirection,
    moveSnake,
    pauseGame,
    resumeGame,
    resetGame
  } = useSnakeStore()

  const { user } = useAuthStore()
  const [gameStarted, setGameStarted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [direction, setDirection] = useState({ x: 0, y: 0 })

  // Game loop
  useEffect(() => {
    if (!gameStarted || isPaused || isGameOver) return

    const gameLoop = setInterval(() => {
      moveSnake()
    }, speed)

    return () => clearInterval(gameLoop)
  }, [gameStarted, isPaused, isGameOver, speed, moveSnake])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || isPaused || isGameOver) return

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction.y !== 1) {
            const newDirection = { x: 0, y: -1 }
            setDirection(newDirection)
            changeDirection(newDirection)
          }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction.y !== -1) {
            const newDirection = { x: 0, y: 1 }
            setDirection(newDirection)
            changeDirection(newDirection)
          }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction.x !== 1) {
            const newDirection = { x: -1, y: 0 }
            setDirection(newDirection)
            changeDirection(newDirection)
          }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction.x !== -1) {
            const newDirection = { x: 1, y: 0 }
            setDirection(newDirection)
            changeDirection(newDirection)
          }
          break
        case ' ':
          e.preventDefault()
          isPaused ? resumeGame() : pauseGame()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameStarted, isPaused, isGameOver, direction, changeDirection, pauseGame, resumeGame])

  const startNewGame = (mode: typeof gameMode) => {
    setGameStarted(false)
    setDirection({ x: 0, y: 0 })
    initializeGame(mode)
    setTimeout(() => setGameStarted(true), 100)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getFoodIcon = (type: string) => {
    switch (type) {
      case 'speed': return '⚡'
      case 'slow': return '🐌'
      case 'bonus': return '💎'
      default: return '🍎'
    }
  }

  const getFoodEffect = (type: string) => {
    switch (type) {
      case 'speed': return 'Speed Up!'
      case 'slow': return 'Slow Down!'
      case 'bonus': return 'Bonus Points!'
      default: return '+10 points'
    }
  }

  const gameModes = [
    { value: 'classic', label: 'Classic', description: 'Traditional Snake gameplay' },
    { value: 'speed-run', label: 'Speed Run', description: 'Fast-paced action' },
    { value: 'survival', label: 'Survival', description: 'With obstacles and limited lives' }
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
            <span className="bg-gradient-to-r from-neon-green to-neon-cyan bg-clip-text text-transparent">
              Neon Snake
            </span>
          </h1>
          <p className="text-white/60">Classic arcade action reimagined</p>
        </motion.div>

        {/* Game Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-xl p-6 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Game Mode Selection */}
            <div className="flex items-center space-x-2">
              <span className="text-white/80 font-medium">Mode:</span>
              {gameModes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => startNewGame(mode.value as typeof gameMode)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    gameMode === mode.value
                      ? 'bg-gradient-to-r from-neon-green to-neon-cyan text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                  title={mode.description}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Game Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-white font-bold">{score}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-neon-blue" />
                <span className="text-white">Level {level}</span>
              </div>
              {gameMode === 'survival' && (
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-white">{lives}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-neon-purple" />
                <span className="text-white font-mono">{formatTime(Math.floor(timeElapsed))}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
              >
                <Settings className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => gameStarted ? (isPaused ? resumeGame() : pauseGame()) : null}
                disabled={!gameStarted || isGameOver}
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
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Game Board */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="glass-dark rounded-xl p-6">
              <div className="snake-game-area w-full max-w-2xl mx-auto aspect-square relative">
                {/* Game Over Overlay */}
                {isGameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">💀</div>
                      <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
                      <p className="text-white/60 mb-4">Final Score: {score}</p>
                      <button
                        onClick={() => startNewGame(gameMode)}
                        className="btn-primary"
                      >
                        Play Again
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Pause Overlay */}
                {isPaused && !isGameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl"
                  >
                    <div className="text-center">
                      <Pause className="h-16 w-16 text-white mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white mb-2">Paused</h2>
                      <p className="text-white/60">Press SPACE to resume</p>
                    </div>
                  </motion.div>
                )}

                {/* Grid and Game Elements */}
                <div className="relative w-full h-full">
                  {/* Food */}
                  <motion.div
                    key={`food-${food.position.x}-${food.position.y}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute w-5 h-5 rounded-full flex items-center justify-center text-sm"
                    style={{
                      left: `${(food.position.x / 20) * 100}%`,
                      top: `${(food.position.y / 20) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <span className="text-lg">{getFoodIcon(food.type)}</span>
                  </motion.div>

                  {/* Obstacles */}
                  {obstacles.map((obstacle, index) => (
                    <div
                      key={`obstacle-${index}`}
                      className="absolute w-5 h-5 bg-red-500 rounded"
                      style={{
                        left: `${(obstacle.x / 20) * 100}%`,
                        top: `${(obstacle.y / 20) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}

                  {/* Snake */}
                  {snake.body.map((segment, index) => (
                    <motion.div
                      key={`segment-${index}`}
                      className={`absolute rounded ${
                        index === 0 
                          ? 'bg-gradient-to-r from-neon-green to-neon-cyan w-5 h-5' 
                          : 'bg-neon-green/70 w-4 h-4'
                      }`}
                      style={{
                        left: `${(segment.x / 20) * 100}%`,
                        top: `${(segment.y / 20) * 100}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={{
                        scale: index === 0 ? [1, 1.1, 1] : 1
                      }}
                      transition={{
                        duration: 0.2,
                        repeat: index === 0 ? Infinity : 0,
                        repeatDelay: 2
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Controls Info */}
              <div className="mt-6 text-center">
                <p className="text-white/60 text-sm">
                  Use <kbd className="bg-white/10 px-2 py-1 rounded">WASD</kbd> or{' '}
                  <kbd className="bg-white/10 px-2 py-1 rounded">Arrow Keys</kbd> to move,{' '}
                  <kbd className="bg-white/10 px-2 py-1 rounded">SPACE</kbd> to pause
                </p>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Current Food Info */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Current Food</h3>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getFoodIcon(food.type)}</div>
                <div>
                  <div className="text-white font-medium">{getFoodEffect(food.type)}</div>
                  <div className="text-white/60 text-sm">{food.value} points</div>
                </div>
              </div>
            </div>

            {/* Game Stats */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Score:</span>
                  <span className="text-yellow-400 font-bold text-lg">{score}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Level:</span>
                  <span className="text-neon-blue font-bold">{level}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Speed:</span>
                  <span className="text-neon-purple font-bold">{speed}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Length:</span>
                  <span className="text-neon-green font-bold">{snake.body.length}</span>
                </div>
                {gameMode === 'survival' && (
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Lives:</span>
                    <span className="text-red-400 font-bold">{lives}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Game Mode Info */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {gameModes.find(m => m.value === gameMode)?.label} Mode
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {gameModes.find(m => m.value === gameMode)?.description}
              </p>
              
              {gameMode === 'classic' && (
                <div className="text-xs text-white/50 space-y-1">
                  <p>• Traditional Snake gameplay</p>
                  <p>• No time limit</p>
                  <p>• Grow by eating food</p>
                </div>
              )}
              
              {gameMode === 'speed-run' && (
                <div className="text-xs text-white/50 space-y-1">
                  <p>• Faster gameplay</p>
                  <p>• Speed increases quickly</p>
                  <p>• Challenge yourself</p>
                </div>
              )}
              
              {gameMode === 'survival' && (
                <div className="text-xs text-white/50 space-y-1">
                  <p>• Obstacles on the field</p>
                  <p>• Limited lives</p>
                  <p>• Hardest mode</p>
                </div>
              )}
            </div>

            {/* Food Types Guide */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Food Types</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🍎</span>
                  <div>
                    <div className="text-white">Normal Food</div>
                    <div className="text-white/60">+10 points</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">⚡</span>
                  <div>
                    <div className="text-white">Speed Boost</div>
                    <div className="text-white/60">+20 points, faster</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">🐌</span>
                  <div>
                    <div className="text-white">Slow Down</div>
                    <div className="text-white/60">+15 points, slower</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">💎</span>
                  <div>
                    <div className="text-white">Bonus</div>
                    <div className="text-white/60">+50 points, rare!</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SnakeGame