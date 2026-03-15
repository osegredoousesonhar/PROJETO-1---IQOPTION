"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function NeuralNetworkVisualizer() {
  const [nodes, setNodes] = useState<{ x: number, y: number, id: number }[]>([]);
  
  useEffect(() => {
    const newNodes = Array.from({ length: 15 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      id: i
    }));
    setNodes(newNodes);
  }, []);

  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <svg className="w-full h-full">
        {nodes.map((node, i) => (
          <g key={node.id}>
            {nodes.slice(i + 1, i + 4).map((target, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="rgba(255, 184, 0, 0.2)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
            <motion.circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r="2"
              fill="#ffb800"
              animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
              transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
