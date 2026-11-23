
import {
  createContext,
  useContext,
  useState,
  memo,
  type ReactNode
} from 'react';

const UserContext = createContext<string>('Tom');

const ThemeContext = createContext<string>('light');

function UserProvider({ children }: { children: ReactNode }) {
  const username = 'Tom';

  return (
    <UserContext.Provider value={username}>
      {children}
    </UserContext.Provider>
  );
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(previous =>
      previous === 'light' ? 'dark' : 'light'
    );
  };

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={toggleTheme}>Change Theme</button>
      {children}
    </ThemeContext.Provider>
  );
}

const UserProfile = memo(function UserProfile() {
  console.log('UserProfile rendered');

  const username = useContext(UserContext);

  return <p>Username: {username}</p>;
});

const ThemeDisplay = memo(function ThemeDisplay() {
  console.log('ThemeDisplay rendered');

  const theme = useContext(ThemeContext);

  return <p>Theme: {theme}</p>;
});

function ContextPerformanceOptimized() {
  return (
    <UserProvider>
      <ThemeProvider>
        <UserProfile />
        <ThemeDisplay />
      </ThemeProvider>
    </UserProvider>
  );
}

export default ContextPerformanceOptimized;
