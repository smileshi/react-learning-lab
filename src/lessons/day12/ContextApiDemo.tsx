
import {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react';

interface CurrentUser {
  id: number;
  username: string;
  permissions: string[];
}

interface AuthContextValue {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>({
    id: 101,
    username: 'Tom',
    permissions: ['USER_VIEW', 'USER_DELETE']
  });

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

function UserProfile() {
  const { currentUser } = useAuth();

  return (
    <div>
      Current User: {currentUser?.username ?? 'Guest'}
    </div>
  );
}

function PermissionMenu() {
  const { currentUser } = useAuth();

  const canDelete =
    currentUser?.permissions.includes('USER_DELETE') ?? false;

  return (
    <div>
      Delete Permission: {canDelete ? 'Allowed' : 'Denied'}
    </div>
  );
}

function BankingLayout() {
  const { setCurrentUser } = useAuth();

  return (
    <div>
      <h2>Banking System - Context API Demo</h2>

      <UserProfile />
      <PermissionMenu />

      <button onClick={() => setCurrentUser(null)}>
        Logout
      </button>
    </div>
  );
}

export default function ContextApiDemo() {
  return (
    <AuthProvider>
      <BankingLayout />
    </AuthProvider>
  );
}
