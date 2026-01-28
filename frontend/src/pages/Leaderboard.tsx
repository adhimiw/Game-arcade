import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp,
  Calendar,
  Filter,
  Search,
  Crown,
  Zap
} from 'lucide-react'

interface LeaderboardEntry {
  id: string
  username: string
  avatar?: string
  game: string
  score: number
  rank: number
  difficulty?: string
  time?: number
  date: string
}

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const games = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'sudoku', name: 'Sudoku', icon: '🔢' },
    { id: 'snake', name: 'Neon Snake', icon: '🐍' },
    { id: 'chess', name: 'AI Chess', icon: '♟️' },
    { id: 'arcade-3d', name: 'Arcade 3D', icon: '🎯' }
  ]

  const periods = [
    { id: 'all', name: 'All Time' },
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'year', name: 'This Year' }
  ]

  // Mock leaderboard data
  const mockLeaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      username: 'GameMaster2024',
      game: 'sudoku',
      score: 2450,
      rank: 1,
      difficulty: 'hard',
      time: 420,
      date: '2024-01-15'
    },
    {
      id: '2',
      username: 'SudokuPro',
      game: 'sudoku',
      score: 2380,
      rank: 2,
      difficulty: 'hard',
      time: 445,
      date: '2024-01-14'
    },
    {
      id: '3',
      username: 'NumberNinja',
      game: 'sudoku',
      score: 2320,
      rank: 3,
      difficulty: 'medium',
      time: 380,
      date: '2024-01-13'
    },
    {
      id: '4',
      username: 'SnakeKing',
      game: 'snake',
      score: 18750,
      rank: 1,
      date: '2024-01-15'
    },
    {
      id: '5',
      username: 'NeonSlither',
      game: 'snake',
      score: 18200,
      rank: 2,
      date: '2024-01-14'
    },
    {
      id: '6',
      username: 'PixelWorm',
      game: 'snake',
      score: 17850,
      rank: 3,
      date: '2024-01-13'
    },
    {
      id: '7',
      username: 'ChessMaster',
      game: 'chess',
      score: 1200,
      rank: 1,
      difficulty: 'hard',
      date: '2024-01-15'
    },
    {
      id: '8',
      username: 'CheckmatePro',
      game: 'chess',
      score: 1180,
      rank: 2,
      difficulty: 'medium',
      date: '2024-01-14'
    },
    {
      id: '9',
      username: 'KnightSlayer',
      game: 'chess',
      score: 1150,
      rank: 3,
      difficulty: 'easy',
      date: '2024-01-13'
    },
    {
      id: '10',
      username: 'ArcadeHero',
      game: 'arcade-3d',
      score: 5600,
      rank: 1,
      date: '2024-01-15'
    }
  ]

  const filteredLeaderboard = mockLeaderboard
    .filter(entry => selectedGame === 'all' || entry.game === selectedGame)
    .filter(_entry => {
      if (selectedPeriod === 'all') return true
      // In a real app, you'd filter by date here
      return true
    })
    .filter(entry => 
      entry.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.score - a.score)
    .map((entry, index) => ({ ...entry, rank: index + 1 }))

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-300" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-white/60">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/50'
      case 2:
        return 'from-gray-300/20 to-gray-500/20 border-gray-300/50'
      case 3:
        return 'from-amber-600/20 to-amber-800/20 border-amber-600/50'
      default:
        return 'from-white/10 to-white/5 border-white/20'
    }
  }

  const getGameIcon = (game: string) => {
    const gameObj = games.find(g => g.id === game)
    return gameObj?.icon || '🎮'
  }

  const formatScore = (score: number, game: string) => {
    switch (game) {
      case 'sudoku':
        return score.toLocaleString()
      case 'snake':
        return score.toLocaleString()
      case 'chess':
        return score.toString()
      case 'arcade-3d':
        return score.toLocaleString()
      default:
        return score.toLocaleString()
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400'
      case 'medium':
        return 'text-yellow-400'
      case 'hard':
        return 'text-red-400'
      default:
        return 'text-white/60'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
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
              Leaderboards
            </span>
          </h1>
          <p className="text-white/60">Compete with players worldwide</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200"
              />
            </div>

            {/* Game Filter */}
            <div className="flex flex-wrap gap-2">
              {games.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedGame === game.id
                      ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span>{game.icon}</span>
                  <span className="hidden sm:inline">{game.name}</span>
                </button>
              ))}
            </div>

            {/* Period Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-white/60" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
              >
                {periods.map((period) => (
                  <option key={period.id} value={period.id} className="bg-gray-800">
                    {period.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="glass-dark rounded-xl p-6 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {filteredLeaderboard.length}
            </div>
            <div className="text-white/60 text-sm">Active Players</div>
          </div>
          <div className="glass-dark rounded-xl p-6 text-center">
            <Star className="h-8 w-8 text-neon-blue mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {filteredLeaderboard[0]?.score.toLocaleString() || '0'}
            </div>
            <div className="text-white/60 text-sm">Top Score</div>
          </div>
          <div className="glass-dark rounded-xl p-6 text-center">
            <TrendingUp className="h-8 w-8 text-neon-green mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">
              {games.filter(g => selectedGame === 'all' || g.id === selectedGame).length}
            </div>
            <div className="text-white/60 text-sm">Games Tracked</div>
          </div>
          <div className="glass-dark rounded-xl p-6 text-center">
            <Calendar className="h-8 w-8 text-neon-purple mx-auto mb-3" />
            <div className="text-2xl font-bold text-white mb-1">24/7</div>
            <div className="text-white/60 text-sm">Live Updates</div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          {filteredLeaderboard.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className={`glass-dark rounded-xl p-6 border ${getRankColor(entry.rank)} hover:bg-white/10 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                {/* Rank and Player Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {entry.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{entry.username}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="text-white/60">{getGameIcon(entry.game)}</span>
                        <span className="text-white/60 capitalize">{entry.game.replace('-', ' ')}</span>
                        {entry.difficulty && (
                          <>
                            <span className="text-white/40">•</span>
                            <span className={getDifficultyColor(entry.difficulty)}>
                              {entry.difficulty}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score and Stats */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatScore(entry.score, entry.game)}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    {entry.time && (
                      <div className="flex items-center space-x-1">
                        <Zap className="h-3 w-3" />
                        <span>{Math.floor(entry.time / 60)}:{(entry.time % 60).toString().padStart(2, '0')}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredLeaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-2">No scores found</h3>
            <p className="text-white/60">
              {searchQuery 
                ? `No players found matching "${searchQuery}"`
                : 'Be the first to set a high score!'
              }
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        {selectedGame !== 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-12 text-center"
          >
            <div className="glass-dark rounded-xl p-8 max-w-2xl mx-auto">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to climb the leaderboard?
              </h3>
              <p className="text-white/60 mb-6">
                Play {games.find(g => g.id === selectedGame)?.name} and see if you can make it to the top!
              </p>
              <a
                href={`/games/${selectedGame}`}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Play Now</span>
                <Trophy className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard