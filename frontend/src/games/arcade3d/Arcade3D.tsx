import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { 
  OrbitControls, 
  Text, 
  Box, 
  Sphere, 
  Environment,
  useAnimations,
  Html
} from '@react-three/drei'
import { motion } from 'framer-motion'
import { 
  Play, 
  RotateCcw, 
  Settings,
  Gamepad2,
  Zap,
  Trophy,
  Star
} from 'lucide-react'
import * as THREE from 'three'

// Animated arcade machine component
const ArcadeMachine = ({ 
  position, 
  rotation, 
  gameType, 
  onClick, 
  isActive,
  isHovered 
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  gameType: string
  onClick: () => void
  isActive: boolean
  isHovered: boolean
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  const getGameColor = (game: string) => {
    switch (game) {
      case 'sudoku': return '#00D4FF'
      case 'snake': return '#00FF88'
      case 'chess': return '#B86FFF'
      default: return '#FF0080'
    }
  }

  return (
    <group position={position} rotation={rotation}>
      {/* Machine body */}
      <Box
        ref={meshRef}
        args={[1, 2, 0.5]}
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? '#ffffff' : '#333333'}
          metalness={0.8}
          roughness={0.2}
          emissive={isActive ? getGameColor(gameType) : '#000000'}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </Box>

      {/* Screen */}
      <Box
        args={[0.8, 1.2, 0.05]}
        position={[0, 0.3, 0.26]}
      >
        <meshStandardMaterial 
          color={isActive ? '#00ffff' : '#001122'}
          emissive={isActive ? '#00ffff' : '#000011'}
          emissiveIntensity={isActive ? 0.5 : 0.1}
        />
      </Box>

      {/* Game title on screen */}
      {isActive && (
        <Text
          position={[0, 0.3, 0.28]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-bold.woff"
        >
          {gameType.toUpperCase()}
        </Text>
      )}

      {/* Control panel */}
      <Box
        args={[0.9, 0.3, 0.1]}
        position={[0, -0.6, 0.2]}
      >
        <meshStandardMaterial 
          color={hovered ? '#555555' : '#444444'}
          metalness={0.6}
          roughness={0.4}
        />
      </Box>

      {/* Joystick */}
      <Box
        args={[0.1, 0.4, 0.1]}
        position={[-0.2, -0.4, 0.3]}
      >
        <meshStandardMaterial 
          color={getGameColor(gameType)}
          emissive={getGameColor(gameType)}
          emissiveIntensity={0.3}
        />
      </Box>

      {/* Buttons */}
      {[-0.05, 0.15, 0.35].map((x, index) => (
        <Sphere
          key={index}
          args={[0.05]}
          position={[x, -0.4, 0.3]}
        >
          <meshStandardMaterial 
            color={['#ff0000', '#00ff00', '#0000ff'][index]}
            emissive={['#ff0000', '#00ff00', '#0000ff'][index]}
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}

      {/* Glow effect */}
      {(hovered || isActive) && (
        <Box
          args={[1.2, 2.2, 0.1]}
          position={[0, 0, -0.3]}
        >
          <meshBasicMaterial 
            color={getGameColor(gameType)}
            transparent
            opacity={0.2}
          />
        </Box>
      )}
    </group>
  )
}

// Floating neon elements
const NeonElement = ({ position, color, rotation }: {
  position: [number, number, number]
  color: string
  rotation: [number, number, number]
}) => {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + Math.sin(state.clock.elapsedTime) * 0.1
      meshRef.current.rotation.y = rotation[1] + Math.cos(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  return (
    <Box ref={meshRef} args={[0.5, 0.5, 0.5]} position={position} rotation={rotation}>
      <meshBasicMaterial 
        color={color}
        transparent
        opacity={0.7}
        wireframe
      />
    </Box>
  )
}

// Particles
const Particles = ({ count = 100 }: { count?: number }) => {
  const pointsRef = useRef<THREE.Points>(null)
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3] = (Math.random() - 0.5) * 20
    positions[i3 + 1] = (Math.random() - 0.5) * 20
    positions[i3 + 2] = (Math.random() - 0.5) * 20

    colors[i3] = Math.random()
    colors[i3 + 1] = Math.random()
    colors[i3 + 2] = Math.random()
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors />
    </points>
  )
}

const Arcade3D = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  const [hoveredGame, setHoveredGame] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  const games = [
    { 
      id: 'sudoku', 
      name: 'Sudoku Master', 
      position: [-3, 0, 0] as [number, number, number],
      color: '#00D4FF'
    },
    { 
      id: 'snake', 
      name: 'Neon Snake', 
      position: [0, 0, 0] as [number, number, number],
      color: '#00FF88'
    },
    { 
      id: 'chess', 
      name: 'AI Chess', 
      position: [3, 0, 0] as [number, number, number],
      color: '#B86FFF'
    }
  ]

  const handleGameSelect = (gameId: string) => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setSelectedGame(gameId)
    setShowWelcome(false)
    
    // Navigate to game after animation
    setTimeout(() => {
      window.location.href = `/games/${gameId}`
    }, 2000)
  }

  const neonColors = ['#FF0080', '#00D4FF', '#B86FFF', '#00FF88', '#FFDD00']

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
            <span className="bg-gradient-to-r from-neon-pink to-neon-purple bg-clip-text text-transparent">
              3D Arcade
            </span>
          </h1>
          <p className="text-white/60">Step into the future of gaming</p>
        </motion.div>

        {/* Welcome Message */}
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center mb-8"
          >
            <div className="glass-dark rounded-xl p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">
                Welcome to the Neon Arcade!
              </h2>
              <p className="text-white/80 mb-4">
                Click on any arcade machine to start playing. Each game offers a unique challenge 
                with stunning visuals and smooth gameplay.
              </p>
              <div className="flex justify-center space-x-4 text-sm text-white/60">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span>Interactive 3D</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-neon-blue" />
                  <span>Real-time Effects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-neon-green" />
                  <span>Leaderboards</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3D Scene */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-dark rounded-xl p-6 mb-8"
          style={{ height: '600px' }}
        >
          <Canvas
            camera={{ position: [0, 5, 10], fov: 60 }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff0080" />
            <pointLight position={[10, -10, -10]} intensity={0.5} color="#00d4ff" />

            {/* Environment */}
            <Environment preset="night" />

            {/* Arcade Machines */}
            {games.map((game, index) => (
              <ArcadeMachine
                key={game.id}
                position={game.position}
                rotation={[0, (index - 1) * 0.3, 0]}
                gameType={game.id}
                onClick={() => handleGameSelect(game.id)}
                isActive={selectedGame === game.id}
                isHovered={hoveredGame === game.id}
              />
            ))}

            {/* Floating neon elements */}
            {neonColors.map((color, index) => (
              <NeonElement
                key={index}
                position={[
                  Math.sin(index * 2) * 6,
                  Math.cos(index * 1.5) * 3 + 2,
                  Math.sin(index * 3) * 6
                ]}
                color={color}
                rotation={[
                  Math.random() * Math.PI,
                  Math.random() * Math.PI,
                  Math.random() * Math.PI
                ]}
              />
            ))}

            {/* Particles */}
            <Particles count={200} />

            {/* Camera Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              autoRotate={!selectedGame}
              autoRotateSpeed={0.5}
              minDistance={5}
              maxDistance={20}
            />
          </Canvas>
        </motion.div>

        {/* Game Selection Panel */}
        {!selectedGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass-dark rounded-xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                onClick={() => handleGameSelect(game.id)}
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="text-center">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      backgroundColor: game.color + '20',
                      border: `2px solid ${game.color}`
                    }}
                  >
                    <Gamepad2 
                      className="h-8 w-8" 
                      style={{ color: game.color }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">
                    {game.name}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    {game.id === 'sudoku' && 'Challenge your mind with numbers'}
                    {game.id === 'snake' && 'Classic arcade action reimagined'}
                    {game.id === 'chess' && 'Battle against AI or friends'}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Play className="h-4 w-4" style={{ color: game.color }} />
                    <span style={{ color: game.color }}>Play Now</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loading Animation */}
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="glass-dark rounded-xl p-8 max-w-md mx-auto">
              <div className="animate-spin w-16 h-16 border-4 border-white/20 border-t-neon-blue rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Loading {games.find(g => g.id === selectedGame)?.name}...
              </h3>
              <p className="text-white/60">
                Preparing your gaming experience
              </p>
            </div>
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="glass-dark rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">How to Navigate</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/60">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-blue rounded-full" />
                <span>Click arcade machines to play games</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-green rounded-full" />
                <span>Drag to rotate the camera</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-neon-purple rounded-full" />
                <span>Scroll to zoom in and out</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Arcade3D