// Types for framer-motion animations
type Direction = "left" | "right" | "up" | "down";
type TransitionType = "spring" | "tween" | "just" | "keyframes" | "inertia";

interface TransitionConfig {
  type?: TransitionType | string;
  delay?: number;
  duration?: number;
  ease?: string;
  staggerChildren?: number;
  delayChildren?: number;
}

interface AnimationState {
  x?: number | string;
  y?: number | string;
  opacity?: number;
  scale?: number;
  transition?: TransitionConfig;
}

interface MotionVariant {
  hidden: AnimationState;
  show: AnimationState;
}

export const textVariant = (delay: number): MotionVariant => {
  return {
    hidden: {
      y: -50,
      opacity: 0,
    },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.25,
        delay: delay,
      },
    },
  };
};

export const fadeIn = (direction: Direction, type: TransitionType, delay: number, duration: number): MotionVariant => {
  return {
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const zoomIn = (delay: number, duration: number): MotionVariant => {
  return {
    hidden: {
      scale: 0,
      opacity: 0,
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "tween",
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const slideIn = (direction: Direction, type: TransitionType, delay: number, duration: number): MotionVariant => {
  return {
    hidden: {
      x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
      y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

export const staggerContainer = (staggerChildren: number, delayChildren?: number): MotionVariant => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: staggerChildren,
        delayChildren: delayChildren || 0,
      },
    },
  };
};