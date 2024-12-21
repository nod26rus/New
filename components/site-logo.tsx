import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SiteLogoProps {
  src: string
  name: string
  className?: string
}

export function SiteLogo({ src, name, className }: SiteLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src={src}
        alt={name}
        width={32}
        height={32}
        className="object-contain"
      />
      <span className="font-bold text-xl">{name}</span>
    </Link>
  )
}