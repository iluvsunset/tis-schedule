import React from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div';
}

const makeContainerVariants = (stagger: number, delay: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
});

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 420,
      damping: 26,
    },
  },
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  stagger = 0.02,
  delay = 0.02,
  as = 'span',
}) => {
  const words = text.split(' ');
  const Component = motion[as] as any;

  return (
    <Component
      key={text}
      variants={makeContainerVariants(stagger, delay)}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap ${className}`}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0">
          {Array.from(word).map((char, cIdx) => (
            <motion.span
              key={cIdx}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Component>
  );
};
