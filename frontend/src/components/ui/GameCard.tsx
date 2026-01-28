import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, Clock, Trophy, Users } from 'lucide-react'

interface GameCardProps {
  title: string
  description: string
  image: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  players: '1 Player' | '2 Players' | 'Online'
  duration: string
  category: string
  href: string
  isNew?: boolean
  isPopular?: boolean
}

const GameCard = ({ 
  title, 
  description, 
  difficulty, 
  players, 
  duration, 
  category, 
  href,
  isNew = false,
  isPopular = false 
}: GameCardProps) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'text-green-400'
      case 'Medium': return 'text-yellow-400'
      case 'Hard': return 'text-red-400'
      default: return 'text-white/80'
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'puzzle': return 'from-purple-500 to-pink-500'
      case 'action': return 'from-red-500 to-orange-500'
      case 'strategy': return 'from-blue-500 to-cyan-500'
      case 'arcade': return 'from-green-500 to-teal-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <motion.div
      className="game-card tilt group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={href} className="block">
        {/* Game Image */}
        <div className="relative overflow-hidden rounded-t-xl h-48">
          <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category)} opacity-80`} />
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Game Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex space-x-2">
            {isNew && (
              <span className="px-2 py-1 bg-neon-green text-black text-xs font-bold rounded-full">
                NEW
              </span>
            )}
            {isPopular && (
              <span className="px-2 py-1 bg-neon-pink text-white text-xs font-bold rounded-full">
                HOT
              </span>
            )}
          </div>

          {/* Difficulty */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-black/50 ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          </div>
        </div>

        {/* Game Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors duration-200">
              {title}
            </h3>
            <span className="text-sm text-white/60 bg-white/10 px-2 py-1 rounded-full">
              {category}
            </span>
          </div>

          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {description}
          </p>

          {/* Game Stats */}
          <div className="flex items-center justify-between text-xs text-white/60">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{players}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="h-3 w-3" />
              <span>Score</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default GameCard