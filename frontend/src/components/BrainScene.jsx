import { useEffect, useRef, useState } from 'react';

export default function BrainScene() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Parallax mouse position handler
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);
      setMousePos({ x: normX, y: normY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Neural particles canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      if (canvas && canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle setup
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (canvas.width || 500),
      y: Math.random() * (canvas.height || 500),
      size: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4 - 0.15,
      alpha: Math.random() * 0.7 + 0.3,
      isGold: Math.random() > 0.65,
      pulseSpeed: Math.random() * 0.03 + 0.01,
    }));

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(t + p.y * 0.01) * 0.2;
        p.y += p.vy;
        p.alpha = 0.3 + Math.sin(t * p.pulseSpeed * 10) * 0.35;

        // Wrap around bounds
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isGold
          ? `rgba(226, 180, 78, ${p.alpha})`
          : `rgba(115, 201, 255, ${p.alpha})`;
        ctx.shadowColor = p.isGold ? '#e2b44e' : '#73c9ff';
        ctx.shadowBlur = p.size * 4;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Compute 3D rotation based on mouse coordinates
  const rotateY = mousePos.x * 14;
  const rotateX = -mousePos.y * 14;
  const translateX = mousePos.x * 18;
  const translateY = mousePos.y * 14;

  return (
    <div
      className="brain-scene-wrapper"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-hidden="true"
    >
      {/* Background Neural Particles */}
      <canvas ref={canvasRef} className="brain-particles-canvas" />

      {/* Pulsing Backlight Glow */}
      <div className="brain-neural-glow" />
      <div className="brain-gold-ring-glow" />

      {/* 3D Floating Brain Visual */}
      <div
        className="brain-3d-stage"
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="brain-image-container">
          <img
            src="/assets/mindxray-brain.png"
            alt="MindXray Neural AI Brain Visual"
            className="brain-render-image"
          />
          {/* Subtle Neural Scanning Light Pulse Overlay */}
          <div className="brain-scanline" />
        </div>
      </div>
    </div>
  );
}
