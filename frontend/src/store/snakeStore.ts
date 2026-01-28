import { create } from 'zustand'

export interface Position {
  x: number
  y: number
}

export interface Food {
  position: Position
  type: 'normal' | 'speed' | 'slow' | 'bonus'
  value: number
  color: string
}

export interface Snake {
  body: Position[]
  direction: Position
}

export interface SnakeGameState {
  snake: Snake
  food: Food
  score: number
  level: number
  speed: number
  isGameOver: boolean
  isPaused: boolean
  gameMode: 'classic' | 'speed-run' | 'survival'
  obstacles: Position[]
  powerUps: Food[]
  timeElapsed: number
  lives: number
}

interface SnakeActions {
  initializeGame: (mode: 'classic' | 'speed-run' | 'survival') => void
  changeDirection: (direction: Position) => void
  moveSnake: () => void
  eatFood: () => void
  checkCollision: () => boolean
  pauseGame: () => void
  resumeGame: () => void
  resetGame: () => void
  updateScore: (points: number) => void
  increaseLevel: () => void
}

const GRID_SIZE = 20
const INITIAL_SNAKE = {
  body: [{ x: 10, y: 10 }],
  direction: { x: 0, y: 0 }
}

const createRandomFood = (obstacles: Position[], snakeBody: Position[]): Food => {
  let position: Position
  let attempts = 0
  
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    attempts++
  } while (
    attempts < 100 &&
    (obstacles.some(obs => obs.x === position.x && obs.y === position.y) ||
     snakeBody.some(seg => seg.x === position.x && seg.y === position.y))
  )

  // Random food type
  const rand = Math.random()
  if (rand < 0.7) {
    return { position, type: 'normal', value: 10, color: '#FF6B6B' }
  } else if (rand < 0.85) {
    return { position, type: 'speed', value: 20, color: '#4ECDC4' }
  } else if (rand < 0.95) {
    return { position, type: 'slow', value: 15, color: '#45B7D1' }
  } else {
    return { position, type: 'bonus', value: 50, color: '#FFA07A' }
  }
}

const createObstacles = (count: number): Position[] => {
  const obstacles: Position[] = []
  
  while (obstacles.length < count) {
    const position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    }
    
    if (!obstacles.some(obs => obs.x === position.x && obs.y === position.y)) {
      obstacles.push(position)
    }
  }
  
  return obstacles
}

export const useSnakeStore = create<SnakeGameState & SnakeActions>((set, get) => ({
  // Initial state
  snake: INITIAL_SNAKE,
  food: createRandomFood([], []),
  score: 0,
  level: 1,
  speed: 150,
  isGameOver: false,
  isPaused: false,
  gameMode: 'classic',
  obstacles: [],
  powerUps: [],
  timeElapsed: 0,
  lives: 3,

  // Actions
  initializeGame: (mode) => {
    const obstacles = mode === 'classic' ? [] : createObstacles(mode === 'survival' ? 8 : 4)
    
    set({
      snake: INITIAL_SNAKE,
      food: createRandomFood(obstacles, INITIAL_SNAKE.body),
      score: 0,
      level: 1,
      speed: 150,
      isGameOver: false,
      isPaused: false,
      gameMode: mode,
      obstacles,
      powerUps: [],
      timeElapsed: 0,
      lives: mode === 'survival' ? 3 : 1
    })
  },

  changeDirection: (direction) => {
    const { snake } = get()
    
    // Prevent reversing into itself
    const opposite = {
      x: -snake.direction.x,
      y: -snake.direction.y
    }
    
    if (direction.x !== opposite.x || direction.y !== opposite.y) {
      set({
        snake: {
          ...snake,
          direction
        }
      })
    }
  },

  moveSnake: () => {
    const { snake, food, obstacles, isPaused, isGameOver } = get()
    
    if (isPaused || isGameOver) return
    
    const newBody = [...snake.body]
    const head = { ...newBody[0] }
    
    // Move head
    head.x += snake.direction.x
    head.y += snake.direction.y
    
    // Check bounds
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      set({ isGameOver: true })
      return
    }
    
    // Check self collision
    if (newBody.some(segment => segment.x === head.x && segment.y === head.y)) {
      set({ isGameOver: true })
      return
    }
    
    // Check obstacle collision
    if (obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
      set({ isGameOver: true })
      return
    }
    
    // Check food collision
    const ateFood = head.x === food.position.x && head.y === food.position.y
    
    newBody.unshift(head)
    
    if (ateFood) {
      // Don't remove tail if eating food
      get().eatFood()
    } else {
      // Remove tail
      newBody.pop()
    }
    
    set({
      snake: {
        ...snake,
        body: newBody
      }
    })
  },

  eatFood: () => {
    const { food, score, level, speed } = get()
    
    let newScore = score + food.value
    let newSpeed = speed
    let newLevel = level
    
    // Special food effects
    switch (food.type) {
      case 'speed':
        newSpeed = Math.max(50, speed - 10)
        break
      case 'slow':
        newSpeed = Math.min(300, speed + 20)
        break
      case 'bonus':
        newScore += 25 // Bonus points for rare food
        break
    }
    
    // Level up every 100 points
    if (newScore >= newLevel * 100) {
      newLevel++
      newSpeed = Math.max(50, newSpeed - 5) // Speed up each level
    }
    
    set({
      score: newScore,
      level: newLevel,
      speed: newSpeed,
      food: createRandomFood(get().obstacles, get().snake.body)
    })
  },

  checkCollision: () => {
    const { snake } = get()
    const head = snake.body[0]
    
    // Check bounds
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true
    }
    
    // Check self collision
    return snake.body.slice(1).some(segment => 
      segment.x === head.x && segment.y === head.y
    )
  },

  pauseGame: () => {
    set({ isPaused: true })
  },

  resumeGame: () => {
    set({ isPaused: false })
  },

  resetGame: () => {
    const { gameMode } = get()
    get().initializeGame(gameMode)
  },

  updateScore: (points) => {
    set(state => ({
      score: state.score + points
    }))
  },

  increaseLevel: () => {
    set(state => ({
      level: state.level + 1,
      speed: Math.max(50, state.speed - 5)
    }))
  }
}))