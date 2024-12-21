import { motion } from "framer-motion"

interface PostHeaderProps {
  title: string
  image: string
}

export function PostHeader({ title, image }: PostHeaderProps) {
  return (
    <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <motion.div 
        className="relative h-full flex items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container max-w-4xl mx-auto px-4 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        </div>
      </motion.div>
    </div>
  )
}