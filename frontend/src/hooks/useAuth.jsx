import { useState, useEffect, createContext, useContext } from 'react';
import { userPool } from '../utils/cognitoConfig';

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
  }, []);

  function checkUser() {
    setLoading(true);
    const currentUser = userPool.getCurrentUser();
    
    if (!currentUser) {
      clearAuth();
      setLoading(false);
      return;
    }

    currentUser.getSession((err, session) => {
      if (err || !session.isValid()) {
        clearAuth();
        setLoading(false);
        return;
      }

      currentUser.getUserAttributes((err, attributes) => {
        if (err) {
          clearAuth();
          setLoading(false);
          return;
        }

        // Map attributes array to object
        const attrMap = {};
        attributes.forEach(attr => {
          attrMap[attr.getName()] = attr.getValue();
        });

        setUser(currentUser);
        
        const realName = attrMap.name || attrMap['custom:name'] || attrMap.given_name || attrMap.email;
        setName(realName || null);
        setEmployeeId(attrMap.profile || null);

        const payload = session.getIdToken().decodePayload();
        
        if (payload) {
          const groups = payload['cognito:groups'] || [];
          
          let foundRole = 'employee';
          let foundDepartment = attrMap['custom:department'] || attrMap.department || 'UNKNOWN';
          
          if (groups.includes('super-admin') || groups.includes('admin')) {
            foundRole = 'super-admin';
            if (foundDepartment === 'UNKNOWN') foundDepartment = 'ALL DEPARTMENTS';
          } else {
            const deptGroup = groups.find(g => g.includes('_'));
            if (deptGroup) {
              const parts = deptGroup.split('_');
              if (foundDepartment === 'UNKNOWN') {
                foundDepartment = parts[0];
              }
              if (parts[1].toLowerCase() === 'manager') {
                foundRole = 'manager';
              }
            } else {
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
        
        setLoading(false);
      });
    });
  }

  function clearAuth() {
    setUser(null);
    setRole(null);
    setDepartment(null);
    setName(null);
    setEmployeeId(null);
  }

  function refreshAuth() {
    checkUser();
  }

  function logout() {
    const currentUser = userPool.getCurrentUser();
    if (currentUser) {
      currentUser.signOut();
    }
    clearAuth();
  }

  return (
    <AuthContext.Provider value={{ user, role, department, name, employeeId, loading, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
