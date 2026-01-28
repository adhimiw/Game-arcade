import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings,
  Crown,
  Clock,
  Users,
  Zap,
  Trophy
} from 'lucide-react'

interface ChessPiece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn'
  color: 'white' | 'black'
}

interface Position {
  row: number
  col: number
}

interface GameState {
  board: (ChessPiece | null)[][]
  currentPlayer: 'white' | 'black'
  selectedSquare: Position | null
  validMoves: Position[]
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
  gameMode: 'ai' | 'online' | 'local'
  aiDifficulty: 'easy' | 'medium' | 'hard'
  playerColor: 'white' | 'black'
  timeLeft: { white: number; black: number }
  capturedPieces: { white: ChessPiece[]; black: ChessPiece[] }
}

const ChessGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(8).fill(null).map(() => Array(8).fill(null)),
    currentPlayer: 'white',
    selectedSquare: null,
    validMoves: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    gameMode: 'ai',
    aiDifficulty: 'medium',
    playerColor: 'white',
    timeLeft: { white: 600, black: 600 }, // 10 minutes each
    capturedPieces: { white: [], black: [] }
  })

  const [isGameActive, setIsGameActive] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize chess board
  const initializeBoard = () => {
    const newBoard: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null))
    
    // Place pieces
    const backRank: ChessPiece['type'][] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
    
    // Black pieces
    for (let col = 0; col < 8; col++) {
      newBoard[0][col] = { type: backRank[col], color: 'black' }
      newBoard[1][col] = { type: 'pawn', color: 'black' }
    }
    
    // White pieces
    for (let col = 0; col < 8; col++) {
      newBoard[6][col] = { type: 'pawn', color: 'white' }
      newBoard[7][col] = { type: backRank[col], color: 'white' }
    }

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: 'white',
      selectedSquare: null,
      validMoves: [],
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
      timeLeft: { white: 600, black: 600 },
      capturedPieces: { white: [], black: [] }
    }))
    setIsGameActive(true)
    setGameStarted(true)
  }

  // Get piece symbol
  const getPieceSymbol = (piece: ChessPiece | null): string => {
    if (!piece) return ''
    
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    }
    
    return symbols[piece.color][piece.type]
  }

  // Check if square is valid move
  const isValidMove = (from: Position, to: Position): boolean => {
    return gameState.validMoves.some(move => 
      move.row === to.row && move.col === to.col
    )
  }

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (!isGameActive || isThinking) return

    const clickedPiece = gameState.board[row][col]
    const isCurrentPlayerPiece = clickedPiece?.color === gameState.currentPlayer

    if (!gameState.selectedSquare) {
      // Select piece
      if (isCurrentPlayerPiece) {
        const validMoves = calculateValidMoves(row, col, clickedPiece!)
        setGameState(prev => ({
          ...prev,
          selectedSquare: { row, col },
          validMoves
        }))
      }
    } else {
      // Move piece or select different piece
      if (isValidMove(gameState.selectedSquare, { row, col })) {
        // Make move
        makeMove(gameState.selectedSquare, { row, col })
      } else if (isCurrentPlayerPiece) {
        // Select different piece
        const validMoves = calculateValidMoves(row, col, clickedPiece!)
        setGameState(prev => ({
          ...prev,
          selectedSquare: { row, col },
          validMoves
        }))
      } else {
        // Deselect
        setGameState(prev => ({
          ...prev,
          selectedSquare: null,
          validMoves: []
        }))
      }
    }
  }

  // Calculate valid moves for a piece (simplified)
  const calculateValidMoves = (row: number, col: number, piece: ChessPiece): Position[] => {
    const moves: Position[] = []
    
    // Basic movement rules (simplified for demo)
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1
        const startRow = piece.color === 'white' ? 6 : 1
        
        // Forward move
        if (row + direction >= 0 && row + direction < 8 && !gameState.board[row + direction][col]) {
          moves.push({ row: row + direction, col })
          
          // Double move from starting position
          if (row === startRow && !gameState.board[row + 2 * direction][col]) {
            moves.push({ row: row + 2 * direction, col })
          }
        }
        
        // Diagonal captures
        for (const dc of [-1, 1]) {
          const newCol = col + dc
          if (row + direction >= 0 && row + direction < 8 && newCol >= 0 && newCol < 8) {
            const target = gameState.board[row + direction][newCol]
            if (target && target.color !== piece.color) {
              moves.push({ row: row + direction, col: newCol })
            }
          }
        }
        break
        
      case 'rook':
        // Horizontal and vertical moves
        const rookDirections = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        for (const [dr, dc] of rookDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break
            
            const target = gameState.board[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break
        
      case 'bishop':
        // Diagonal moves
        const bishopDirections = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
        for (const [dr, dc] of bishopDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break
            
            const target = gameState.board[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break
        
      case 'queen':
        // Combines rook and bishop moves
        const queenDirections = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
        for (const [dr, dc] of queenDirections) {
          for (let i = 1; i < 8; i++) {
            const newRow = row + dr * i
            const newCol = col + dc * i
            
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break
            
            const target = gameState.board[newRow][newCol]
            if (!target) {
              moves.push({ row: newRow, col: newCol })
            } else {
              if (target.color !== piece.color) {
                moves.push({ row: newRow, col: newCol })
              }
              break
            }
          }
        }
        break
        
      case 'king':
        // One square in any direction
        const kingDirections = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]]
        for (const [dr, dc] of kingDirections) {
          const newRow = row + dr
          const newCol = col + dc
          
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = gameState.board[newRow][newCol]
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break
        
      case 'knight':
        // L-shaped moves
        const knightMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
        for (const [dr, dc] of knightMoves) {
          const newRow = row + dr
          const newCol = col + dc
          
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const target = gameState.board[newRow][newCol]
            if (!target || target.color !== piece.color) {
              moves.push({ row: newRow, col: newCol })
            }
          }
        }
        break
    }
    
    return moves
  }

  // Make a move
  const makeMove = (from: Position, to: Position) => {
    const piece = gameState.board[from.row][from.col]
    if (!piece) return

    const capturedPiece = gameState.board[to.row][to.col]
    
    const newBoard = gameState.board.map(row => [...row])
    newBoard[to.row][to.col] = piece
    newBoard[from.row][from.col] = null

    const newCapturedPieces = {
      white: [...gameState.capturedPieces.white],
      black: [...gameState.capturedPieces.black]
    }

    if (capturedPiece) {
      newCapturedPieces[capturedPiece.color].push(capturedPiece)
    }

    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white'

    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: nextPlayer,
      selectedSquare: null,
      validMoves: [],
      capturedPieces: newCapturedPieces
    }))

    // Check for AI move if playing against AI
    if (gameState.gameMode === 'ai' && nextPlayer !== gameState.playerColor) {
      setIsThinking(true)
      setTimeout(() => {
        makeAIMove(newBoard, nextPlayer)
        setIsThinking(false)
      }, 1000) // Simulate AI thinking time
    }
  }

  // Simple AI move (placeholder)
  const makeAIMove = (board: (ChessPiece | null)[][], playerColor: 'white' | 'black') => {
    // This is a very basic AI - just picks a random valid move
    // In a real implementation, you'd integrate with Stockfish or similar
    
    const validMoves: { from: Position; to: Position; piece: ChessPiece }[] = []
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col]
        if (piece && piece.color === playerColor) {
          const moves = calculateValidMoves(row, col, piece)
          for (const move of moves) {
            validMoves.push({
              from: { row, col },
              to: move,
              piece
            })
          }
        }
      }
    }

    if (validMoves.length > 0) {
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)]
      makeMove(randomMove.from, randomMove.to)
    }
  }

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              AI Chess
            </span>
          </h1>
          <p className="text-white/60">Challenge the computer or play online</p>
        </motion.div>

        {/* Game Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-xl p-6 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Game Mode */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-white/80 font-medium">Mode:</span>
                <select
                  value={gameState.gameMode}
                  onChange={(e) => setGameState(prev => ({ ...prev, gameMode: e.target.value as any }))}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
                  disabled={gameStarted}
                >
                  <option value="ai" className="bg-gray-800">vs Computer</option>
                  <option value="online" className="bg-gray-800">Online</option>
                  <option value="local" className="bg-gray-800">Local 2P</option>
                </select>
              </div>

              {gameState.gameMode === 'ai' && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/80 font-medium">Difficulty:</span>
                  <select
                    value={gameState.aiDifficulty}
                    onChange={(e) => setGameState(prev => ({ ...prev, aiDifficulty: e.target.value as any }))}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
                    disabled={gameStarted}
                  >
                    <option value="easy" className="bg-gray-800">Easy</option>
                    <option value="medium" className="bg-gray-800">Medium</option>
                    <option value="hard" className="bg-gray-800">Hard</option>
                  </select>
                </div>
              )}
            </div>

            {/* Game Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-white" />
                <div className="text-white">
                  <div className="text-xs text-white/60">White</div>
                  <div className="font-mono">{formatTime(gameState.timeLeft.white)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-white" />
                <div className="text-white">
                  <div className="text-xs text-white/60">Black</div>
                  <div className="font-mono">{formatTime(gameState.timeLeft.black)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-400" />
                <span className="text-white capitalize">{gameState.currentPlayer}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-2">
              {!gameStarted ? (
                <button
                  onClick={initializeBoard}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Game</span>
                </button>
              ) : (
                <>
                  <button
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                    disabled={!gameStarted || isThinking}
                  >
                    <Pause className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => {
                      setGameStarted(false)
                      setIsGameActive(false)
                    }}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-200"
                  >
                    <RotateCcw className="h-4 w-4 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chess Board */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="glass-dark rounded-xl p-6">
              {/* AI Thinking Indicator */}
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-neon-blue/20 border border-neon-blue/50 rounded-lg flex items-center space-x-2"
                >
                  <Zap className="h-4 w-4 text-neon-blue animate-pulse" />
                  <span className="text-neon-blue text-sm">AI is thinking...</span>
                </motion.div>
              )}

              <div className="chess-board max-w-2xl mx-auto">
                {gameState.board.map((row, rowIndex) =>
                  row.map((piece, colIndex) => {
                    const isLight = (rowIndex + colIndex) % 2 === 0
                    const isSelected = gameState.selectedSquare?.row === rowIndex && gameState.selectedSquare?.col === colIndex
                    const isValidMove = gameState.validMoves.some(move => move.row === rowIndex && move.col === colIndex)
                    
                    return (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          chess-square ${isLight ? 'light' : 'dark'}
                          ${isSelected ? 'selected' : ''}
                          ${isValidMove ? 'bg-neon-green/30' : ''}
                          ${piece ? 'cursor-pointer' : ''}
                        `}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                        whileHover={{ scale: piece ? 1.05 : 1 }}
                        whileTap={{ scale: piece ? 0.95 : 1 }}
                      >
                        {piece && (
                          <motion.div
                            className="chess-piece"
                            animate={{ 
                              scale: isSelected ? 1.1 : 1,
                              rotateY: isSelected ? 10 : 0
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            {getPieceSymbol(piece)}
                          </motion.div>
                        )}
                        
                        {/* Valid move indicator */}
                        {isValidMove && !piece && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-neon-green rounded-full" />
                          </div>
                        )}
                      </motion.div>
                    )
                  })
                )}
              </div>

              {/* Game Status */}
              <div className="mt-6 text-center">
                {gameState.isCheckmate && (
                  <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                    <h3 className="text-xl font-bold text-yellow-400">Checkmate!</h3>
                    <p className="text-white/80">
                      {gameState.currentPlayer === 'white' ? 'Black' : 'White'} wins!
                    </p>
                  </div>
                )}
                
                {gameState.isCheck && !gameState.isCheckmate && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-400 font-bold">Check!</p>
                  </div>
                )}
                
                {gameState.isStalemate && (
                  <div className="p-3 bg-gray-500/20 border border-gray-500/50 rounded-lg">
                    <p className="text-gray-400 font-bold">Stalemate! Draw!</p>
                  </div>
                )}
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
            {/* Captured Pieces */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Captured Pieces</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-2">White Pieces</h4>
                  <div className="flex flex-wrap gap-1">
                    {gameState.capturedPieces.white.map((piece, index) => (
                      <span key={index} className="text-lg">
                        {getPieceSymbol(piece)}
                      </span>
                    ))}
                    {gameState.capturedPieces.white.length === 0 && (
                      <span className="text-white/40 text-sm">None</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-2">Black Pieces</h4>
                  <div className="flex flex-wrap gap-1">
                    {gameState.capturedPieces.black.map((piece, index) => (
                      <span key={index} className="text-lg">
                        {getPieceSymbol(piece)
                      }</span>
                    ))}
                    {gameState.capturedPieces.black.length === 0 && (
                      <span className="text-white/40 text-sm">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Game Info */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Game Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/80">Mode:</span>
                  <span className="text-white capitalize">
                    {gameState.gameMode === 'ai' ? 'vs Computer' : gameState.gameMode}
                  </span>
                </div>
                
                {gameState.gameMode === 'ai' && (
                  <div className="flex justify-between">
                    <span className="text-white/80">Difficulty:</span>
                    <span className="text-white capitalize">{gameState.aiDifficulty}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-white/80">Your Color:</span>
                  <span className="text-white capitalize">{gameState.playerColor}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-white/80">Current Player:</span>
                  <span className="text-white capitalize">{gameState.currentPlayer}</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">How to Play</h3>
              <div className="text-sm text-white/60 space-y-2">
                <p>• Click a piece to select it</p>
                <p>• Click a valid square to move</p>
                <p>• Green dots show valid moves</p>
                <p>• Capture all enemy pieces</p>
                <p>• Protect your king from check</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ChessGame