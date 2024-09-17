'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';

interface BackgroundContextProps {
  backgroundUrl: string;
  setBackgroundUrl: (url: string) => void;
  backgroundSize: string;
  setBackgroundSize: (size: string) => void;
  positionX: string;
  setPositionX: (x: string) => void;
  positionY: string;
  setPositionY: (y: string) => void;
}

const BackgroundContext = createContext<BackgroundContextProps | undefined>(undefined);

export const BackgroundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');
  const [backgroundSize, setBackgroundSize] = useState<string>('cover');
  const [positionX, setPositionX] = useState<string>('50%');
  const [positionY, setPositionY] = useState<string>('50%');

  useEffect(() => {
    const savedUrl = localStorage.getItem('backgroundUrl');
    const savedSize = localStorage.getItem('backgroundSize');
    const savedPositionX = localStorage.getItem('positionX');
    const savedPositionY = localStorage.getItem('positionY');

    if (savedUrl) {
      setBackgroundUrl(savedUrl);
    }
    if (savedSize) {
      setBackgroundSize(savedSize);
    }
    if (savedPositionX) {
      setPositionX(savedPositionX);
    }
    if (savedPositionY) {
      setPositionY(savedPositionY);
    }
  }, []);

  const saveBackgroundUrl = (url: string) => {
    setBackgroundUrl(url);
    localStorage.setItem('backgroundUrl', url);
  };

  const saveBackgroundSize = (size: string) => {
    setBackgroundSize(size);
    localStorage.setItem('backgroundSize', size);
  };

  const savePositionX = (x: string) => {
    setPositionX(x);
    localStorage.setItem('positionX', x);
  };

  const savePositionY = (y: string) => {
    setPositionY(y);
    localStorage.setItem('positionY', y);
  };

  return (
    <BackgroundContext.Provider value={{ 
      backgroundUrl, 
      setBackgroundUrl: saveBackgroundUrl,
      backgroundSize,
      setBackgroundSize: saveBackgroundSize,
      positionX,
      setPositionX: savePositionX,
      positionY,
      setPositionY: savePositionY,
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackground = () => {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
};
