
import { useState } from 'react';

type ApiResult = {
  name: string;
  data: string;
};

const mockApi = (
  name: string,
  shouldFail: boolean
): Promise<ApiResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(`${name} API failed`));
      } else {
        resolve({
          name,
          data: `${name} data loaded`
        });
      }
    }, 1000);
  });
};

function PromiseAllVsAllSettledDemo() {
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const testPromiseAll = async () => {
    setLoading(true);
    setResult([]);

    try {
      const results = await Promise.all([
        mockApi('Users', false),
        mockApi('Roles', false),
        mockApi('Permissions', true)
      ]);

      setResult(results.map(item => item.data));
    } catch (error) {
      setResult([
        error instanceof Error ? error.message : 'Unknown error'
      ]);
    } finally {
      setLoading(false);
    }
  };

  const testPromiseAllSettled = async () => {
    setLoading(true);
    setResult([]);

    try {
      const results = await Promise.allSettled([
        mockApi('Users', false),
        mockApi('Roles', false),
        mockApi('Permissions', true)
      ]);

      const messages = results.map((item, index) => {
        const names = ['Users', 'Roles', 'Permissions'];

        if (item.status === 'fulfilled') {
          return `${names[index]}: ${item.value.data}`;
        }

        return `${names[index]}: ${item.reason.message}`;
      });

      setResult(messages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Promise.all vs Promise.allSettled</h2>

      <button onClick={() => void testPromiseAll()}>
        Test Promise.all
      </button>

      <button
        onClick={() => void testPromiseAllSettled()}
        style={{ marginLeft: 12 }}
      >
        Test Promise.allSettled
      </button>

      {loading && <p>Loading...</p>}

      <ul>
        {result.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default PromiseAllVsAllSettledDemo;
