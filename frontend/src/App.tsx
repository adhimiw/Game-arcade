import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/ui/Navbar'
import Home from './pages/Home'
import Games from './pages/Games'
import SudokuGame from './games/sudoku/SudokuGame'
import SnakeGame from './games/snake/SnakeGame'
import ChessGame from './games/chess/ChessGame'
import Arcade3D from './games/arcade3d/Arcade3D'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import './index.css'

function App() {
  const { initializeAuth } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <Navbar />
        
        <main className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games" element={<Games />} />
                <Route path="/games/sudoku" element={<SudokuGame />} />
                <Route path="/games/snake" element={<SnakeGame />} />
                <Route path="/games/chess" element={<ChessGame />} />
                <Route path="/games/arcade-3d" element={<Arcade3D />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App