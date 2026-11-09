
import {useEffect, useState, useCallback, useRef, useMemo} from 'react';
import { userService } from '../../services/userService';
import type { CreateUserRequest, User } from '../../types/user';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserFilter from './components/UserFilter';


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
  const filteredUsers = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    return users.filter(user =>
      (!roleFilter || user.role === roleFilter) &&
      (user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query))
    );
  }, [users, keyword, roleFilter]);
  const roles = useMemo(
  () => [...new Set(users.map(user => user.role))].sort(),
  [users]
);

  const requestId = useRef(0);

  // GET /api/users
  const loadUsers = useCallback(async () => {
    const currentRequest = ++requestId.current;
    try {
        // 1. 设置 loading = true
        setLoading(true);
        // 2. 清空之前的错误
        setLoadError('');
        // 3. 调用 userService.getUsers()
        const data = await userService.getUsers();
        // 4. 将返回数据保存到 users
        if (currentRequest === requestId.current) setUsers(data);
    } catch (err) {
        // 5. catch 捕获异常
        console.error('Load users failed:', err);
        if (currentRequest === requestId.current) setLoadError('Failed to load users.');
    } finally {
        // 6. finally 设置 loading = false
        if (currentRequest === requestId.current) setLoading(false);
    }
  }, []);

  // Load users when component mounts
  // useEffect(() => {
  //   const currentRequest = ++requestId.current;
  //   async function fetchInitialUsers() {
  //     try {
  //       const data = await userService.getUsers();
  //       if (currentRequest === requestId.current) setUsers(data);
  //     } catch {
  //       if (currentRequest === requestId.current) setLoadError('Failed to load users.');
  //     } finally {
  //       if (currentRequest === requestId.current) setLoading(false);
  //     }
  //   }
  //   void fetchInitialUsers();
  //   return () => { requestId.current += 1; };
  // }, []);

  useEffect(() => {
    void loadUsers();

    return () => {
      requestId.current += 1;
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
          onClick={() => void loadUsers()}
          disabled={loading || submitting || deletingId !== null}
        >
          reload
        </button>        

        <UserFilter
          keyword={keyword}
          roleFilter={roleFilter}
          roles={roles}
          onKeywordChange={setKeyword}
          onRoleChange={setRoleFilter}
        />
        <p>Showing {filteredUsers.length} of {users.length} users</p>
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

        {!loading && !loadError && filteredUsers.length === 0 && (
          <p>{users.length === 0 ? 'No users found.' : 'No users match your filters.'}</p>
        )}

        {!loading && !loadError && filteredUsers.length > 0 && (
          <UserList
            users={filteredUsers}
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
