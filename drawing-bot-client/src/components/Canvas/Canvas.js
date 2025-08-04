import { useEffect, useRef } from 'react';
import './Canvas.css';

const Canvas = ({ commands, width = 800, height = 500 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    commands.forEach(cmd => {
      ctx.fillStyle = cmd.color;

      switch (cmd.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.radius || 10, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'rect':
          ctx.fillRect(cmd.x, cmd.y, cmd.width || 50, cmd.height || 50);
          break;
        case 'line':
          ctx.beginPath();
          ctx.moveTo(cmd.x, cmd.y);
          ctx.lineTo((cmd.width ?? 0) + cmd.x, (cmd.height ?? 0) + cmd.y);
          ctx.strokeStyle = cmd.color;
          ctx.stroke();
          break;
        default:
          break;
      }
    });
  }, [commands]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="canvas"
    />
  );
};

export default Canvas;
