import { useId } from 'react';

type UserFilterProps = {
  keyword: string;
  roleFilter: string;
  roles: string[];
  onKeywordChange: (value: string) => void;
  onRoleChange: (value: string) => void;
};

function UserFilter({
  keyword, roleFilter, roles, onKeywordChange, onRoleChange
}: UserFilterProps) {
  const searchId = useId();
  const roleId = useId();
  // Keep the selected role available even after its last user is deleted.
  const availableRoles = [...new Set([...roles, ...(roleFilter ? [roleFilter] : [])])];

  return (
    <div>
      <label htmlFor={searchId}>Search username or email</label>
      <input
        id={searchId}
        value={keyword}
        onChange={e => onKeywordChange(e.target.value)}
      />
      <label htmlFor={roleId}>Role</label>
      <select
        id={roleId}
        value={roleFilter}
        onChange={e => onRoleChange(e.target.value)}
      >
        <option value="">All roles</option>
        {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
      </select>
      <button type="button" onClick={() => {
        onKeywordChange('');
        onRoleChange('');
      }}>
        Clear filters
      </button>
    </div>
  );
}

export default UserFilter;