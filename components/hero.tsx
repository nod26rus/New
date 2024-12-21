"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

export function Hero() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative h-[60vh] min-h-[600px] w-full overflow-hidden">
      {/* Фоновое изображение будет загружаться из настроек сайта */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background" />
      </div>

      <motion.div 
        className="relative h-full flex items-center justify-center text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {/* Название сайта будет загружаться из настроек */}
            Современный AI-блог
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Исследуйте мир через призму искусственного интеллекта
          </p>
        </div>
      </motion.div>
    </div>
  )
}