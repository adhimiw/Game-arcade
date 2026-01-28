import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Gamepad2, 
  Zap, 
  Trophy, 
  Users, 
  Sparkles,
  ArrowRight,
  Star,
  Play
} from 'lucide-react'
import GameCard from '../components/ui/GameCard'

const Home = () => {
  const featuredGames = [
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
      isPopular: true
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
      isPopular: true
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
      isPopular: false
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
      isPopular: false
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with React 19 and optimized for smooth 60fps gameplay'
    },
    {
      icon: Users,
      title: 'Real-time Multiplayer',
      description: 'Play with friends worldwide using WebSocket technology'
    },
    {
      icon: Trophy,
      title: 'Global Leaderboards',
      description: 'Compete for the top spot and show off your skills'
    },
    {
      icon: Sparkles,
      title: 'Modern Design',
      description: 'Neon glassmorphism UI with smooth animations'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon-blue/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-neon-pink/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                GAME ARCADE
              </span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-light text-white/80 mb-8">
              The Future of Gaming is Here
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">
              Experience the next generation of web-based gaming with our cutting-edge 
              platform featuring AI-powered opponents, real-time multiplayer, and 
              stunning 3D graphics.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              to="/games"
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Start Playing</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              to="/leaderboard"
              className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <Trophy className="h-5 w-5" />
              <span>View Leaderboards</span>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {[
              { label: 'Active Players', value: '10K+', icon: Users },
              { label: 'Games Available', value: '4', icon: Gamepad2 },
              { label: 'Hours Played', value: '50K+', icon: Zap },
              { label: 'Countries', value: '25+', icon: Star }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-neon-blue" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Featured Games
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Discover our collection of carefully crafted games, each designed to provide 
              unique challenges and unforgettable experiences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredGames.map((game, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GameCard {...game} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Arcade 2026?
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Built with the latest technologies and designed for the modern gamer, 
              our platform delivers unmatched performance and features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-dark rounded-xl p-6 text-center hover:bg-white/10 transition-colors duration-300 group"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-dark rounded-2xl p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Play?
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
              Join thousands of players worldwide and experience the future of gaming. 
              Create your account now and start your journey to the top of the leaderboards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Create Account</span>
              </Link>
              <Link
                to="/games"
                className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <Gamepad2 className="h-5 w-5" />
                <span>Browse Games</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home