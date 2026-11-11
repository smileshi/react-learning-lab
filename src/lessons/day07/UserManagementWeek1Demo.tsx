
import {useEffect, useState, useCallback, useRef} from 'react';
import { userService } from '../../services/userService';
import type { CreateUserRequest, User } from '../../types/user';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserFilter from './components/UserFilter';
import { USER_ROLES } from '../../constants/userRoles';


function UserManagementWeek1Demo() {
  console.log('Parent rendered');

  // User list states
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  

   const [submitting, setSubmitting] = useState(false);
   const [submitError, setSubmitError] = useState('');
   const [successMessage, setSuccessMessage] = useState('');



  const [keyword, setKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const deleteInFlight = useRef(false);


  const requestId = useRef(0);

  const loadUsers = useCallback(async (signal?: AbortSignal) => {
  const currentRequest = ++requestId.current;

  try {
    setLoading(true);
    setLoadError('');

    const data = await userService.getUsers(
      {
        keyword: keyword.trim() || undefined,
        role: roleFilter || undefined
      },
      signal
    );

    if (currentRequest === requestId.current && !signal?.aborted) {
      setUsers(data);
    }
  } catch (err) {
    if (signal?.aborted) {
      return;
    }

    console.error('Load users failed:', err);

    if (currentRequest === requestId.current) {
      setLoadError('Failed to load users.');
    }
  } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
  }
}, [keyword, roleFilter]);

  useEffect(() => {
  const controller = new AbortController();

  const timer = window.setTimeout(() => {
    void loadUsers(controller.signal);
  }, 800);

  return () => {
    window.clearTimeout(timer);
    controller.abort();
  };
}, [loadUsers]);

// POST /api/users
  const handleCreateUser = useCallback(async (
    form: CreateUserRequest
  ) => {
    setSubmitError('');
    setSuccessMessage('');
    try {
      // 2. 设置 submitting = true
      setSubmitting(true);

      // 3. 调用 userService.createUser(data)
      await userService.createUser({
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role
      });

      // 4. 创建成功，设置 successMessag
      setSuccessMessage('User created successfully!');      

      // 5. 调用 loadUsers() 刷新列表
      await loadUsers();
    } catch (err) {
      // 6. catch 捕获异常
      console.error('Create user failed:', err);
      setSubmitError('Failed to create user.');
      throw err; // Let UserForm preserve its input on failure.
    } finally {
      // 7. finally 设置 submitting = false
      setSubmitting(false);
    }
  }, [loadUsers]);

  const handleDelete = useCallback(async (id: number) => {
    if (deleteInFlight.current || loading || submitting) return;
    deleteInFlight.current = true;
    setDeletingId(id);
    setDeleteError('');
    try {
      await userService.deleteUser(id);
      setUsers(previous => previous.filter(user => user.id !== id));
    } catch (err) {
      console.error('Delete user failed:', err);
      setDeleteError('Failed to delete user. Please try again.');
    } finally {
      deleteInFlight.current = false;
      setDeletingId(null);
    }
  }, [loading, submitting]);


  const hasSearchCriteria =
  keyword.trim() !== '' || roleFilter !== '';

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h2>Banking System - User Management Week 1 Demo</h2>      
      <hr />
      
      <UserForm
        onSubmit={handleCreateUser}
        submitting={submitting || deletingId !== null}
        submitError={submitError}
        successMessage={successMessage}
      />

      {/* User List */}
      <section>
        <h3>User List</h3>

        <button
          type="button"
          disabled={loading || submitting || deletingId !== null}
          style={{
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onClick={() => void loadUsers()}
        >
          reload
        </button>       

        <UserFilter
          keyword={keyword}
          roleFilter={roleFilter}
          roles={USER_ROLES}
          onKeywordChange={setKeyword}
          onRoleChange={setRoleFilter}
        />
        
        <p>Showing {users.length} users</p>
        {deleteError && <p role="alert" style={{ color: 'red' }}>{deleteError}</p>}
        {loading && <p>Loading users...</p>}

        {loadError && !loading && (
          <div>
            <p role="alert" style={{ color: 'red' }}>
              {loadError}
            </p>
            <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading || submitting || deletingId !== null}
          >
            Retry
          </button>
          </div>
        )}

        {!loading && !loadError && users.length === 0 && (
          <p>
            {hasSearchCriteria
              ? 'No users match your search.'
              : 'No users found.'}
          </p>
        )}

        {!loading && users.length > 0 && (
          <UserList
            users={users}
            onDelete={handleDelete}
            deletingId={deletingId}
            deleteDisabled={submitting || deletingId !== null}
          />
        )}
      </section>
    </div>
  );
}

export default UserManagementWeek1Demo;
