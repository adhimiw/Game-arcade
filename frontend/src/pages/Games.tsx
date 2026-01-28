import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react'
import GameCard from '../components/ui/GameCard'

const Games = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'newest'>('popularity')

  const games = [
    {
      title: 'Sudoku Master',
      description: 'Challenge your mind with our advanced Sudoku engine featuring multiple difficulty levels and smart hints.',
      image: '/api/placeholder/300/200',
      difficulty: 'Medium' as const,
      players: '1 Player' as const,
      duration: '5-15 min',
      category: 'Puzzle' as const,
      href: '/games/sudoku',
      isNew: true,
      isPopular: true,
      rating: 4.8,
      playCount: 15420
    },
    {
      title: 'Neon Snake',
      description: 'Classic Snake reimagined with power-ups, obstacles, and multiple game modes for endless fun.',
      image: '/api/placeholder/300/200',
      difficulty: 'Easy' as const,
      players: '1 Player' as const,
      duration: '3-10 min',
      category: 'Action' as const,
      href: '/games/snake',
      isNew: false,
      isPopular: true,
      rating: 4.6,
      playCount: 23150
    },
    {
      title: 'AI Chess',
      description: 'Battle against Stockfish AI or challenge friends in real-time online multiplayer chess.',
      image: '/api/placeholder/300/200',
      difficulty: 'Hard' as const,
      players: '2 Players' as const,
      duration: '10-30 min',
      category: 'Strategy' as const,
      href: '/games/chess',
      isNew: true,
      isPopular: false,
      rating: 4.9,
      playCount: 8750
    },
    {
      title: 'Arcade 3D',
      description: 'Step into a stunning 3D arcade environment built with Three.js and WebGL.',
      image: '/api/placeholder/300/200',
      difficulty: 'Easy' as const,
      players: '1 Player' as const,
      duration: '5-20 min',
      category: 'Arcade' as const,
      href: '/games/arcade-3d',
      isNew: true,
      isPopular: false,
      rating: 4.7,
      playCount: 5230
    }
  ]

  const categories = ['All', 'Puzzle', 'Action', 'Strategy', 'Arcade']
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']
  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ]

  const filteredGames = games
    .filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'All' || game.category === selectedCategory) &&
      (selectedDifficulty === 'All' || game.difficulty === selectedDifficulty)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return Number(b.isNew) - Number(a.isNew)
        case 'popularity':
        default:
          return b.playCount - a.playCount
      }
    })

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
              Game Collection
            </span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover our carefully curated selection of games designed to challenge, 
            entertain, and push the boundaries of web gaming.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-dark rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-white/60" />
                <span className="text-white/60 text-sm">Filters:</span>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="bg-gray-800">
                    {difficulty}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-neon-blue"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-gray-800">
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors duration-200 ${
                    viewMode === 'grid' ? 'bg-neon-blue text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors duration-200 ${
                    viewMode === 'list' ? 'bg-neon-blue text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-white/60">
            Showing {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }
        >
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {viewMode === 'grid' ? (
                <GameCard {...game} />
              ) : (
                <div className="glass-dark rounded-xl p-6 flex items-center space-x-6 hover:bg-white/10 transition-colors duration-300">
                  <div className="w-24 h-24 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-white text-2xl">🎮</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">{game.title}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-white/80 text-sm">{game.rating}</span>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mb-3">{game.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-white/40">
                      <span className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{game.players}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{game.duration}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{game.playCount.toLocaleString()} plays</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-xs rounded-full">
                      {game.category}
                    </span>
                    <a
                      href={game.href}
                      className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white text-sm font-semibold rounded-lg hover:scale-105 transition-transform duration-200"
                    >
                      Play Now
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredGames.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold text-white mb-2">No games found</h3>
            <p className="text-white/60">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Games