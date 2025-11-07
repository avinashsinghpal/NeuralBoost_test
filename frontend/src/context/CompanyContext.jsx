import React, { createContext, useContext, useState, useEffect } from 'react';

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const savedCompany = localStorage.getItem('company');
    const savedEmployees = localStorage.getItem('employees');
    
    if (savedCompany && savedEmployees) {
      try {
        setCompany(JSON.parse(savedCompany));
        setEmployees(JSON.parse(savedEmployees));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Error loading company from localStorage:', e);
      }
    }
  }, []);

  const login = (companyData, employeesData) => {
    setCompany(companyData);
    setEmployees(employeesData || []);
    setIsAuthenticated(true);
    localStorage.setItem('company', JSON.stringify(companyData));
    if (employeesData) {
      localStorage.setItem('employees', JSON.stringify(employeesData));
    }
  };

  const addEmployee = (employeeData) => {
    const updatedEmployees = [...employees, employeeData];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const logout = () => {
    setCompany(null);
    setEmployees([]);
    setIsAuthenticated(false);
    localStorage.removeItem('company');
    localStorage.removeItem('employees');
  };

  return (
    <CompanyContext.Provider value={{ company, employees, isAuthenticated, login, logout, addEmployee }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
}

