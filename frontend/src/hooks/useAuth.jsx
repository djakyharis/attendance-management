import { useState, useEffect, createContext, useContext } from 'react';
import { getCurrentUser, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [department, setDepartment] = useState(null);
  const [name, setName] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
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
          setName(null);
          setEmployeeId(null);
          break;
      }
    });
    
    return () => unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const attributes = await fetchUserAttributes();
      const payload = session.tokens?.idToken?.payload;
      
      setUser(currentUser);
      
      // Attempt to get name from standard 'name' or 'custom:name'
      const realName = attributes.name || attributes['custom:name'] || attributes.given_name || attributes.email;
      setName(realName || null);
      setEmployeeId(attributes.profile || null);
      
      if (payload) {
        // Extract role and department from cognito:groups
        const groups = payload['cognito:groups'] || [];
        
        let foundRole = 'employee';
        let foundDepartment = attributes['custom:department'] || attributes.department || 'UNKNOWN';
        
        if (groups.includes('super-admin') || groups.includes('admin')) {
          foundRole = 'super-admin';
          if (foundDepartment === 'UNKNOWN') foundDepartment = 'ALL DEPARTMENTS';
        } else {
          // 1. Try to find role from groups with underscore (e.g., IT_manager)
          const deptGroup = groups.find(g => g.includes('_'));
          
          if (deptGroup) {
            const parts = deptGroup.split('_');
            if (foundDepartment === 'UNKNOWN') {
              foundDepartment = parts[0]; // e.g. IT, Humas
            }
            if (parts[1].toLowerCase() === 'manager') {
              foundRole = 'manager';
            }
          } else {
            // 2. Try to find exact matches if no underscore
            if (groups.includes('manager') || groups.includes('Manager')) {
              foundRole = 'manager';
            }
            if (foundDepartment === 'UNKNOWN') {
              const rawDept = groups.find(g => g.toLowerCase() === 'it' || g.toLowerCase() === 'humas' || g.toLowerCase() === 'hr');
              if (rawDept) foundDepartment = rawDept;
            }
          }
        }
        
        setRole(foundRole);
        setDepartment(foundDepartment);
      }
    } catch (error) {
      setUser(null);
      setRole(null);
      setDepartment(null);
      setName(null);
      setEmployeeId(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, role, department, name, employeeId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
