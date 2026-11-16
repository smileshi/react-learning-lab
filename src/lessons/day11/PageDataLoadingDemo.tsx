
import { useState } from 'react';

// ==============================
// 1. Types
// ==============================

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface Role {
  code: string;
  name: string;
}

interface Permission {
  code: string;
  description: string;
}

interface ApiError {
  source: 'users' | 'roles' | 'permissions';
  message: string;
}

type PermissionStatus = 'loading' | 'loaded' | 'failed';

// ==============================
// 2. Mock APIs
// ==============================

const mockGetUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    {
      id: 101,
      username: 'Tom',
      email: 'tom@example.com',
      role: 'ADMIN'
    },
    {
      id: 102,
      username: 'Jerry',
      email: 'jerry@example.com',
      role: 'BANK_USER'
    }
  ];
};

const mockGetRoles = async (): Promise<Role[]> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return [
    { code: 'ADMIN', name: 'Administrator' },
    { code: 'BANK_USER', name: 'Bank User' },
    { code: 'APPROVER', name: 'Approver' }
  ];
};

const mockGetPermissions = async (): Promise<Permission[]> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  // 模拟 HTTP 403
  throw new Error('403 Forbidden: Access denied');
};

// ==============================
// 3. Component
// ==============================

function PageDataLoadingDemo() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [errors, setErrors] = useState<ApiError[]>([]);

  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>('loading');

  // ==============================
  // 4. Load Page Data
  // ==============================

  const loadPageData = async () => {
    setIsInitialLoading(true);
    setPageError('');
    setErrors([]);
    setPermissionStatus('loading');

    try {
      const results = await Promise.allSettled([
        mockGetUsers(),
        mockGetRoles(),
        mockGetPermissions()
      ]);

      const [usersResult, rolesResult, permissionsResult] = results;

      // 4.1 Users: Core Business Data

      if (usersResult.status === 'rejected') {
        setPageError('Failed to load users.');
        return;
      }

      setUsers(usersResult.value);

      // 4.2 Roles: Supporting Data

      if (rolesResult.status === 'fulfilled') {
        setRoles(rolesResult.value);
      } else {
        setRoles([]);

        setErrors(prev => [
          ...prev,
          {
            source: 'roles',
            message: 'Failed to load roles.'
          }
        ]);
      }

      // 4.3 Permissions: Security Data

      if (permissionsResult.status === 'fulfilled') {
        setPermissions(permissionsResult.value);
        setPermissionStatus('loaded');
      } else {
        setPermissions([]);
        setPermissionStatus('failed');

        setErrors(prev => [
          ...prev,
          {
            source: 'permissions',
            message: 'Failed to load permissions.'
          }
        ]);
      }

    } catch (error) {
      console.error('Unexpected page loading error:', error);
      setPageError('Unexpected error occurred.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  // ==============================
  // 5. Permission Check
  // ==============================

  const canDelete =
    permissionStatus === 'loaded' &&
    permissions.some(
      permission => permission.code === 'USER_DELETE'
    );

  // ==============================
  // 6. Render
  // ==============================

  if (isInitialLoading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Banking System - User Management</h2>
        <p>Loading page data...</p>
        <button onClick={() => void loadPageData()}>
          Load Data
        </button>
      </div>
    );
  }

  if (pageError) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Banking System - User Management</h2>

        <p role="alert" style={{ color: 'red' }}>
          {pageError}
        </p>

        <button onClick={() => void loadPageData()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h2>Banking System - User Management</h2>

      <button onClick={() => void loadPageData()}>
        Reload
      </button>

      {/* API Errors */}

      {errors.map(error => (
        <p
          key={error.source}
          role="alert"
          style={{ color: 'red' }}
        >
          {error.source}: {error.message}
        </p>
      ))}

      {/* Users */}

      <section>
        <h3>Users</h3>

        {users.map(user => (
          <div key={user.id}>
            {user.username} - {user.email} - {user.role}
          </div>
        ))}
      </section>

      {/* Roles */}

      <section>
        <h3>Roles</h3>

        {roles.length > 0 ? (
          roles.map(role => (
            <div key={role.code}>
              {role.name} ({role.code})
            </div>
          ))
        ) : (
          <p>Roles unavailable.</p>
        )}
      </section>

      {/* Permissions */}

      <section>
        <h3>Permissions</h3>

        <p>Status: {permissionStatus}</p>

        <button
          disabled={!canDelete}
          title={
            canDelete
              ? 'Delete user'
              : 'Permission unavailable'
          }
        >
          Delete User
        </button>

        {!canDelete && (
          <p style={{ color: 'red' }}>
            Permission unavailable. Action disabled.
          </p>
        )}
      </section>
    </div>
  );
}

export default PageDataLoadingDemo;
