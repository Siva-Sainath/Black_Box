import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const StreamingText: React.FC<{ text: string; isStreaming: boolean }> = ({ text, isStreaming }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    setCurrentIndex(0);
  }, [text, isStreaming]);

  useEffect(() => {
    if (isStreaming && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, Math.random() * 30 + 10); // Random typing delay
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, isStreaming, text]);

  return (
    <span>
      {displayedText}
      {isStreaming && currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-1.5 h-3 ml-0.5 bg-white align-middle"
        />
      )}
    </span>
  );
};
