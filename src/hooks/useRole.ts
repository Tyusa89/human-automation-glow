// Example useRole hook
import { useState } from 'react';
export function useRole() {
  const [role, setRole] = useState('user');
  return { role, setRole };
}
