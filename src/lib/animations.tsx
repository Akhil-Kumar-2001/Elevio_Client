'use client';

export function initAnimations() {
  // Add any global animation initialization here
  
  // Add animation classes for CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes float-slow {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes pulse-slow {
      0% { opacity: 0.5; }
      50% { opacity: 0.8; }
      100% { opacity: 0.5; }
    }

    @keyframes fade-in-up {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fade-in-left {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes fade-in-right {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    
    .animate-float-slow {
      animation: float-slow 6s ease-in-out infinite;
    }
    
    .animate-pulse-slow {
      animation: pulse-slow 6s ease-in-out infinite;
    }

    .animate-fade-in-up {
      opacity: 0;
      animation: fade-in-up 0.8s ease-out forwards;
    }

    .animate-fade-in-up-delay-1 {
      opacity: 0;
      animation: fade-in-up 0.8s ease-out 0.2s forwards;
    }

    .animate-fade-in-up-delay-2 {
      opacity: 0;
      animation: fade-in-up 0.8s ease-out 0.4s forwards;
    }

    .animate-fade-in-up-delay-3 {
      opacity: 0;
      animation: fade-in-up 0.8s ease-out 0.6s forwards;
    }

    .animate-fade-in-left {
      opacity: 0;
      animation: fade-in-left 0.8s ease-out 0.3s forwards;
    }

    .animate-fade-in-right {
      opacity: 0;
      animation: fade-in-right 0.8s ease-out 0.3s forwards;
    }
  `;
  
  document.head.appendChild(style);
}

// Intersection Observer utility for scroll animations
export function createScrollObserver(callback: IntersectionObserverCallback) {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  });
}