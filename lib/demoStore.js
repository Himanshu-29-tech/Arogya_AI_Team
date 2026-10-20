import bcrypt from 'bcryptjs';

// Global store to persist across Next.js API route invocations during development
if (!global.__arogyaDemoStore) {
  global.__arogyaDemoStore = {};
}

if (!global.__arogyaDemoStore.users) {
  global.__arogyaDemoStore.users = new Map([
    [
      'demo@arogya.ai',
      {
        id: 'mock-1',
        name: 'Demo User',
        email: 'demo@arogya.ai',
        passwordHash: bcrypt.hashSync('demo123', 10),
        role: 'user',
      }
    ]
  ]);
}

if (!global.__arogyaDemoStore.records) {
  global.__arogyaDemoStore.records = new Map();
}

export const demoStore = global.__arogyaDemoStore;
