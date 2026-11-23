
import {
  createContext,
  useContext,
  useState,
  memo,
  type ReactNode
} from 'react';

interface AppContextValue {
  username: string;
  theme: string;
}

const AppContext = createContext<AppContextValue | null>(null);

function AppProvider({ children }: { children: ReactNode }) {
  const [username] = useState('Tom');
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ username, theme }}>
      <button
        onClick={() =>
          setTheme(previous =>
            previous === 'light' ? 'dark' : 'light'
          )
        }
      >
        Change Theme
      </button>

      {children}
    </AppContext.Provider>
  );
}

const UserProfile = memo(function UserProfile() {
  console.log('UserProfile rendered');

  const context = useContext(AppContext);

  return <p>Username: {context?.username}</p>;
});

const ThemeDisplay = memo(function ThemeDisplay() {
  console.log('ThemeDisplay rendered');

  const context = useContext(AppContext);

  return <p>Theme: {context?.theme}</p>;
});

function ContextPerformanceDemo() {
  return (
    <AppProvider>
      <UserProfile />
      <ThemeDisplay />
    </AppProvider>
  );
}

export default ContextPerformanceDemo;
