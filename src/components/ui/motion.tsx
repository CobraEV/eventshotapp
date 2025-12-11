'use client'

import { useInViewMotion } from '@/hooks/useInViewMotion'
import { cn } from '@/lib/utils'
import { motion, HTMLMotionProps } from 'framer-motion'

type MotionDivProps = HTMLMotionProps<'div'> & {
  children: React.ReactNode
  className?: string
}

export const FadeIn = ({ children, className, ...props }: MotionDivProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const FadeInUp = ({ children, className, ...props }: MotionDivProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const SlideInLeft = ({
  children,
  className,
  ...props
}: MotionDivProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const SlideInRight = ({
  children,
  className,
  ...props
}: MotionDivProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerContainer = ({
  children,
  className,
  ...props
}: MotionDivProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({
  children,
  className,
  ...props
}: MotionDivProps) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const ScaleOnHover = ({
  children,
  className,
  ...props
}: MotionDivProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export const ScrollReveal = ({
  children,
  className,
  ...props
}: MotionDivProps) => {
  const { ref, inView } = useInViewMotion<HTMLDivElement>()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
