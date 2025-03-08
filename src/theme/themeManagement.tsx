import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

// Define the shape of the context value
interface ThemeContextProps {
  theme: 'light' | 'dark' | 'automatic';
  toggleTheme: (selectedTheme: 'light' | 'dark' | 'automatic') => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'automatic'>('automatic');

  useEffect(() => {
    if (theme === 'automatic') {
      const systemTheme = Appearance.getColorScheme();
      setTheme(systemTheme === 'dark' ? 'dark' : 'light');
    }
  }, [theme]);

  const toggleTheme = (selectedTheme: 'light' | 'dark' | 'automatic') => {
    setTheme(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

