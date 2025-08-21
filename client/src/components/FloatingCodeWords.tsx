import { useEffect, useState } from 'react';

interface FloatingWord {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
}

const codeWords = [
  'const', 'let', 'var', 'function', 'class', 'async', 'await', 'return',
  'import', 'export', 'if', 'else', 'for', 'while', 'try', 'catch',
  'true', 'false', 'null', 'undefined', 'new', 'this', 'super',
  'extends', 'implements', 'interface', 'type', 'enum', 'module',
  'React', 'useState', 'useEffect', 'props', 'state', 'JSX',
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Node.js', 'API',
  'JSON', 'Promise', 'Array', 'Object', 'String', 'Number',
  '{', '}', '[', ']', '()', '=>', '===', '!==', '&&', '||',
  'map', 'filter', 'reduce', 'forEach', 'find', 'includes',
  'push', 'pop', 'shift', 'slice', 'splice', 'join'
];

const colors = [
  '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
  '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1',
  '#14B8A6', '#F59E0B', '#8B5CF6', '#10B981', '#3B82F6'
];

export default function FloatingCodeWords() {
  const [words, setWords] = useState<FloatingWord[]>([]);

  useEffect(() => {
    // Initialize floating words
    const initialWords: FloatingWord[] = [];
    for (let i = 0; i < 25; i++) {
      initialWords.push({
        id: i,
        text: codeWords[Math.floor(Math.random() * codeWords.length)],
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5, // Slow horizontal movement
        vy: (Math.random() - 0.5) * 0.5, // Slow vertical movement
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 20 + 12, // 12px to 32px
        opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5 opacity
      });
    }
    setWords(initialWords);

    // Animation loop
    const animate = () => {
      setWords(prevWords => 
        prevWords.map(word => {
          let newX = word.x + word.vx;
          let newY = word.y + word.vy;
          let newVx = word.vx;
          let newVy = word.vy;

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth - 100) {
            newVx = -word.vx;
            newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - 50) {
            newVy = -word.vy;
            newY = Math.max(0, Math.min(window.innerHeight - 50, newY));
          }

          return {
            ...word,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );
    };

    const interval = setInterval(animate, 50); // 20fps for smooth animation
    return () => clearInterval(interval);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWords(prevWords => 
        prevWords.map(word => ({
          ...word,
          x: Math.min(word.x, window.innerWidth - 100),
          y: Math.min(word.y, window.innerHeight - 50),
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {words.map(word => (
        <div
          key={word.id}
          className="absolute font-mono font-semibold select-none transition-all duration-75 ease-linear"
          style={{
            left: `${word.x}px`,
            top: `${word.y}px`,
            color: word.color,
            fontSize: `${word.size}px`,
            opacity: word.opacity,
            transform: 'translate3d(0, 0, 0)', // Hardware acceleration
          }}
        >
          {word.text}
        </div>
      ))}
    </div>
  );
}