import { useRef, useState } from 'react';
import { userService } from '../../services/userService';
import type { User } from '../../types/user';
import { ApiError } from '../../api/apiError';

function AxiosInterceptorDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const controllerRef = useRef<AbortController | null>(null);

  const loadUsers = async () => {
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setErrorMessage('');

    try {
      const data = await userService.getUsers(
        undefined,
        controller.signal
      );

      if (!controller.signal.aborted) {
        setUsers(data);
      }
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setErrorMessage('Unexpected error.');
        return;
      }

      switch (error.type) {
        case 'CANCELLED':
          return;

        case 'UNAUTHORIZED':
          setErrorMessage('Please login again.');
          break;

        case 'FORBIDDEN':
          setErrorMessage('You do not have permission.');
          break;

        case 'NOT_FOUND':
          setErrorMessage('Requested resource not found.');
          break;

        case 'VALIDATION_ERROR':
          setErrorMessage(error.message);
          break;

        case 'CONFLICT':
          setErrorMessage(error.message);
          break;

        case 'SERVER_ERROR':
        case 'NETWORK_ERROR':
        case 'UNKNOWN_ERROR':
          setErrorMessage(error.message);
          break;
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Axios Interceptor - Real API</h2>

      <button
        onClick={() => void loadUsers()}
        disabled={loading}
      >
        Load Users
      </button>

      <button
        onClick={() => controllerRef.current?.abort()}
        disabled={!loading}
        style={{ marginLeft: 12 }}
      >
        Cancel Request
      </button>

      {loading && <p>Loading...</p>}

      {errorMessage && (
        <p role="alert" style={{ color: 'red' }}>
          {errorMessage}
        </p>
      )}

      <h3>Users</h3>

      {users.map(user => (
        <div key={user.id}>
          {user.username} - {user.email} - {user.role}
        </div>
      ))}
    </div>
  );
}

export default AxiosInterceptorDemo;