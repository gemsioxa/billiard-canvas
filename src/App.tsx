import React, { useRef, useEffect, useState } from "react";
import ColorMenu from "./components/colorMenu";
import "./App.css";

interface Ball {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocityX: number;
  velocityY: number;
  mass: number;
}

const initialBalls: Ball[] = [
  {
    x: 100,
    y: 100,
    radius: 20,
    color: "red",
    velocityX: 0,
    velocityY: 0,
    mass: 10,
  },
];

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null);
  const [showColorMenu, setShowColorMenu] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      initialBalls.forEach(ball => {
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < ball.radius) {
          const vx2 = 1; 
          const vy2 = 1; 

          const finalVelocityX1 = vx2; 
          const finalVelocityY1 = vy2; 

          ball.velocityX = finalVelocityX1;
          ball.velocityY = finalVelocityY1;
        }
      });
    };

    const handleMouseClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      initialBalls.forEach((ball) => {
        const distance = Math.sqrt(
          (mouseX - ball.x) ** 2 + (mouseY - ball.y) ** 2
        );
        if (distance <= ball.radius) {
          setSelectedBall(ball);
          setShowColorMenu(true);
        } else {
          setSelectedBall(null);
          setShowColorMenu(false);
        }
      });
    };

    const updateGame = () => {
      handleCollisions(initialBalls, canvas);
      updateBallsPosition(initialBalls, canvas);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      initialBalls.forEach((ball) => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
      });

      requestAnimationFrame(draw);
    };

    draw();

    setInterval(updateGame, 1000 / 60);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleMouseClick);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleMouseClick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, []);

  const changeBallColor = (color: string) => {
    if (selectedBall) {
      selectedBall.color = color;
      setShowColorMenu(false);
    }
  };

  return (
    <div className="billiards-game">
      <canvas ref={canvasRef} width={800} height={600} />
      {showColorMenu && (
        <ColorMenu
          colors={["red", "green", "blue", "yellow"]}
          onSelectColor={changeBallColor}
        />
      )}
    </div>
  );
};

export default App;

const handleCollisions = (balls: Ball[], canvas: HTMLCanvasElement) => {
  balls.forEach((ball) => {
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
      ball.velocityX *= -1;
    }
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
      ball.velocityY *= -1;
    }
  });
};


const updateBallsPosition = (balls: Ball[], canvas: HTMLCanvasElement) => {
  balls.forEach((ball) => {
    if (ball.velocityX !== 0 && ball.velocityX < 0) {
      ball.velocityX += 0.001;
    }
    if (ball.velocityX !== 0 && ball.velocityX > 0) {
      ball.velocityX -= 0.001;
    }
    if (ball.velocityY !== 0 && ball.velocityY < 0) {
      ball.velocityY += 0.001;
    }
    if (ball.velocityY !== 0 && ball.velocityY > 0) {
      ball.velocityY -= 0.001;
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
  });
};
