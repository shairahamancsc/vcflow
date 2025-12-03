'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SplashScreen = () => {
  const [isFading, setIsFading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
    }, 2500); // Start fading out after 2.5s

    const redirectTimer = setTimeout(() => {
      router.push('/login');
    }, 3500); // Redirect after 3.5s (allowing 1s for fade out)

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-background transition-opacity duration-1000 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-center text-4xl md:text-6xl font-bold overflow-hidden">
        <div className="flex">
          <span className="text-destructive animate-slide-in-left opacity-0" style={{ animationDelay: '0.2s' }}>
            V
          </span>
          <span className="text-destructive animate-slide-in-left opacity-0" style={{ animationDelay: '0.4s' }}>
            C
          </span>
        </div>
        <span className="ml-4 text-primary animate-slide-in-right opacity-0" style={{ animationDelay: '0.6s' }}>
          TechFlow
        </span>
      </div>
    </div>
  );
};

export default function Home() {
  return <SplashScreen />;
}
