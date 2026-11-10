import { useEffect } from 'react';
import { userService } from '../../services/userService';

async function testPromise() {
  console.log('A: Start');

  const promise = userService.getUsers();

  console.log('B:', promise);

  const users = await promise;

  console.log('C: Request completed');

  console.log('D: Users:', users);
}

console.log('Before');

void testPromise();

console.log('After');

function TestCase() {
    useEffect(() => {
        void testPromise();
    }, []);
    return (
    <div>      
      <h3>观察 Promise</h3>
      
      <button type="button"  onClick={() => void testPromise()}>
        Delete
      </button>

      <hr />
    </div>
  );
}


export default TestCase;