function UserRole({ role }: { role: string }) {
  switch (role) {
    case 'ADMIN':
      return <span>Administrator</span>;

    case 'BANK_USER':
      return <span>Bank User</span>;

    default:
      return <span>Unknown Role</span>;
  }
}

export default UserRole;