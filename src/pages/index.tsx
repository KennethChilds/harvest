import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const LiquidGradient = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const loop = () => {
      time += 0.1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${time % 360}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${(time + 60) % 360}, 100%, 50%)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      
      for (let i = 0; i <= canvas.width; i++) {
        ctx.lineTo(i, canvas.height / 2 + Math.sin(i * 0.01 + time) * 50);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();
      
      requestAnimationFrame(loop);
    };
    
    loop();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />;
};

const Star = ({ x, y, size }: { x: number; y: number; size: number }) => (
  <div 
    className="absolute bg-white rounded-full animate-twinkle"
    style={{
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
    }}
  />
);

const RandomStars = ({ count }: { count: number }) => {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <Star key={star.id} x={star.x} y={star.y} size={star.size} />
      ))}
    </div>
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Harvest - Tax-Compliant NFT Service</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Monument+Sans&display=swap" />
      </Head>
      <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-white font-monument-sans">
        <LiquidGradient />
        <RandomStars count={50} />
        <div className="z-10 text-center">
          <h1 className="text-6xl font-bold mb-4">Harvest</h1>
          <p className="text-xl mb-8">Tax-Compliant NFT Service</p>
          <Link href="/sell-nft">
            <button className="bg-white text-purple-600 font-bold py-2 px-4 rounded-full hover:bg-purple-100 transition-colors">
              Sell Your NFT
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}