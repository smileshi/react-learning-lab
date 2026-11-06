import type { User } from "../../../types/user";
import UserList from "./UserList";

function UserListDemo() {
    const users: User[] = [
    { id: 101, username: 'Tom', email: 'Tom@t.c ', role: 'ADMIN'},
    { id: 102, username: 'Jerry', email: 'Jerry@t.c ', role: 'BANK_USER'},
    { id: 103, username: 'Jack', email: 'Jack@t.c ', role: '' }
  ];

  return <UserList users={users}/>

}

export default UserListDemo;