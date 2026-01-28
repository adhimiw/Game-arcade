import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Trophy, 
  Edit3,
  Save,
  X,
  Star,
  Target,
  Clock
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Profile = () => {
  const { user, updateProfile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: (user as any)?.firstName || '',
    lastName: (user as any)?.lastName || ''
  })

  const mockGameStats = [
    {
      game: 'Sudoku Master',
      icon: '🔢',
      bestScore: 2450,
      gamesPlayed: 127,
      totalTime: '42h 15m',
      rank: 3
    },
    {
      game: 'Neon Snake',
      icon: '🐍',
      bestScore: 18750,
      gamesPlayed: 89,
      totalTime: '15h 32m',
      rank: 7
    },
    {
      game: 'AI Chess',
      icon: '♟️',
      bestScore: 1200,
      gamesPlayed: 45,
      totalTime: '8h 45m',
      rank: 12
    },
    {
      game: '3D Arcade',
      icon: '🎯',
      bestScore: 5600,
      gamesPlayed: 32,
      totalTime: '5h 20m',
      rank: 5
    }
  ]

  const handleSave = async () => {
    try {
      await updateProfile(editForm)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    setEditForm({
      username: user?.username || '',
      email: user?.email || '',
      firstName: (user as any)?.firstName || '',
      lastName: (user as any)?.lastName || ''
    })
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

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
              My Profile
            </span>
          </h1>
          <p className="text-white/60">Manage your gaming profile and statistics</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-dark rounded-xl p-6">
              {/* Avatar and Basic Info */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-16 w-16 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>
                <p className="text-white/60 mb-1">{user.email}</p>
                <p className="text-white/40 text-sm">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Edit Profile Section */}
              <div className="border-t border-white/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-white/60 hover:text-white transition-colors duration-200"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="p-2 text-green-400 hover:text-green-300 transition-colors duration-200"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-white/60">Username:</span>
                      <p className="text-white">{user.username}</p>
                    </div>
                    <div>
                      <span className="text-sm text-white/60">Email:</span>
                      <p className="text-white">{user.email}</p>
                    </div>
                    {(user as any).firstName && (
                      <div>
                        <span className="text-sm text-white/60">Name:</span>
                        <p className="text-white">{(user as any).firstName} {(user as any).lastName}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-dark rounded-xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    <span className="text-white/80">Total Score</span>
                  </div>
                  <span className="text-yellow-400 font-bold">45,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-neon-blue" />
                    <span className="text-white/80">Games Played</span>
                  </div>
                  <span className="text-neon-blue font-bold">293</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-neon-green" />
                    <span className="text-white/80">Total Time</span>
                  </div>
                  <span className="text-neon-green font-bold">71h 52m</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-neon-purple" />
                    <span className="text-white/80">Best Rank</span>
                  </div>
                  <span className="text-neon-purple font-bold">#3</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Game Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="glass-dark rounded-xl p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Game Statistics</h3>
              
              <div className="space-y-6">
                {mockGameStats.map((game, index) => (
                  <motion.div
                    key={game.game}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{game.icon}</div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{game.game}</h4>
                          <p className="text-white/60">{game.gamesPlayed} games played</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-400">
                          {game.bestScore.toLocaleString()}
                        </div>
                        <div className="text-sm text-white/60">Best Score</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{game.totalTime}</div>
                        <div className="text-sm text-white/60">Time Played</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-neon-blue">#{game.rank}</div>
                        <div className="text-sm text-white/60">Global Rank</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-neon-green">
                          {Math.round(game.bestScore / game.gamesPlayed)}
                        </div>
                        <div className="text-sm text-white/60">Avg Score</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-dark rounded-xl p-6 mt-6">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Achievements</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: '🏆', title: 'First Win', desc: 'Complete your first Sudoku' },
                  { icon: '🔥', title: 'Hot Streak', desc: 'Win 5 games in a row' },
                  { icon: '⚡', title: 'Speed Demon', desc: 'Complete a game in under 1 minute' },
                  { icon: '🎯', title: 'Perfect Game', desc: 'Zero mistakes in a puzzle' }
                ].map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300"
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="text-sm font-bold text-white mb-1">{achievement.title}</div>
                    <div className="text-xs text-white/60">{achievement.desc}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile