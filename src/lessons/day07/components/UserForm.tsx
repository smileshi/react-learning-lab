import { memo, useState, type ChangeEvent, type FormEvent } from "react";
import type { CreateUserRequest } from "../../../types/user";

type UserFormProps = {
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  submitting: boolean;
  submitError: string;
  successMessage: string;
};


const initialForm: CreateUserRequest = {
    username: '',
    email: '',
    role: 'BANK_USER'
};


const UserForm = memo(function UserForm({
  onSubmit, submitting ,submitError,successMessage
}: UserFormProps) {
  
 
const [form, setForm] = useState<CreateUserRequest>(initialForm);

const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof CreateUserRequest, string>>
  >({});

// 统一处理输入框变化
const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name !== 'username' && name !== 'email' && name !== 'role') return;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // 2. 清除当前字段的错误
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
};

// Validate form
  const validateForm = (): boolean => {
    const errors: Partial<
      Record<keyof CreateUserRequest, string>
    > = {};

    if (!form.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      errors.email = 'Invalid email address';
    }

    if (!form.role.trim()) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

const handleCreateUser = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    // 1. 清空旧的错误和成功消息
    e.preventDefault();

    if (submitting || !validateForm()) {
      return;
    }

    try{
        await onSubmit(form);
        setForm({ ...initialForm });
        setFormErrors({});
    } catch {
    // 父组件已经负责设置 submitError
    // 保留用户输入的数据
    } 
  };



  return (
    <div>      
      {/* Create User Form */}
      <section style={{ marginBottom: 32 }}>
        <h3>Add User</h3>

        <form onSubmit={handleCreateUser} noValidate>
          <div style={{ marginBottom: 12 }}>
            <label htmlFor="username">Username</label>
            <br />
            <input
                id="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                disabled={submitting}
            />

            {formErrors.username && (
              <p style={{ color: 'red' }}>
                {formErrors.username}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="email">Email</label>
            <br />
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
            />

            {formErrors.email && (
              <p style={{ color: 'red' }}>
                {formErrors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label htmlFor="role">Role</label>
            <br />
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="BANK_USER">Bank User</option>
              <option value="ADMIN">Admin</option>
              <option value="APPROVER">Approver</option>
              <option value="VIEWER">Viewer</option>
            </select>

            {formErrors.role && (
              <p style={{ color: 'red' }}>
                {formErrors.role}
              </p>
            )}
          </div>

          {submitError && (
            <p role="alert" style={{ color: 'red' }}>
              {submitError}
            </p>
          )}

          {successMessage && (
            <p role="status" style={{ color: 'green' }}>
              {successMessage}
            </p>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </section>
    </div>
  );
});

export default UserForm;