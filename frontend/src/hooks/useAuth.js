import { useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    const unsubscribe = Hub.listen('auth', ({ payload: { event } }) => {
      switch (event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setUser(null);
          setRole(null);
          setDepartment(null);
          break;
      }
    });
    
    return () => unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const payload = session.tokens?.idToken?.payload;
      
      setUser(currentUser);
      
      if (payload) {
        // Extract role from cognito:groups
        const groups = payload['cognito:groups'] || [];
        if (groups.includes('super-admin')) setRole('super-admin');
        else if (groups.includes('manager')) setRole('manager');
        else setRole('employee');
        
        // Extract department from custom attribute
        setDepartment(payload['custom:department'] || null);
      }
    } catch (error) {
      const mockRole = localStorage.getItem('mockRole');
      if (mockRole) {
        setUser({ username: 'mock-user', userId: '5070523' });
        setRole(mockRole);
        setDepartment('IT');
      } else {
        setUser(null);
        setRole(null);
        setDepartment(null);
      }
    } finally {
      setLoading(false);
    }
  }

  return { user, role, department, loading };
}
