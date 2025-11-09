const crypto = require('crypto');
const { stmts } = require('../services/db/database');

// Hash password (simple for demo - use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initialize default companies
function initializeDefaultCompanies() {
  try {
    // Check if companies already exist
    const existing = stmts.getCompanyByName.get('IBM');
    if (existing) {
      console.log('[Auth] Default companies already initialized');
      return;
    }

    // Create default companies
    const companies = [
      {
        name: 'IBM',
        email: 'admin@ibm.com',
        password: hashPassword('IBM@2024'),
        employees: [
          'john.smith@ibm.com',
          'sarah.johnson@ibm.com',
          'michael.brown@ibm.com',
          'emily.davis@ibm.com',
          'david.wilson@ibm.com',
          'lisa.anderson@ibm.com',
          'robert.taylor@ibm.com'
        ]
      },
      {
        name: 'DELL',
        email: 'admin@dell.com',
        password: hashPassword('DELL@2024'),
        employees: [
          'james.martinez@dell.com',
          'patricia.lee@dell.com',
          'william.garcia@dell.com',
          'jennifer.white@dell.com',
          'richard.harris@dell.com',
          'maria.clark@dell.com',
          'joseph.lewis@dell.com'
        ]
      },
      {
        name: 'AMAZON',
        email: 'admin@amazon.com',
        password: hashPassword('AMAZON@2024'),
        employees: [
          'thomas.robinson@amazon.com',
          'christopher.walker@amazon.com',
          'daniel.young@amazon.com',
          'matthew.king@amazon.com',
          'anthony.wright@amazon.com',
          'mark.lopez@amazon.com',
          'donald.hill@amazon.com'
        ]
      }
    ];

    for (const company of companies) {
      const companyId = crypto.randomUUID();
      stmts.createCompany.run(
        companyId,
        company.name,
        company.email,
        company.password
      );

      // Add employees
      for (const employeeEmail of company.employees) {
        const employeeId = crypto.randomUUID();
        stmts.createEmployee.run(
          employeeId,
          companyId,
          employeeEmail,
          employeeEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
        );
      }

      console.log(`[Auth] Created company: ${company.name} with ${company.employees.length} employees`);
    }

    console.log('[Auth] Default companies initialized successfully');
  } catch (err) {
    console.error('[Auth] Error initializing companies:', err);
  }
}

// Login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const hashedPassword = hashPassword(password);
    const company = stmts.getCompanyByEmail.get(email);

    if (!company || company.password !== hashedPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Get employees
    const employees = stmts.getEmployeesByCompany.all(company.id);

    res.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        email: company.email
      },
      employees: employees.map(e => ({
        id: e.id,
        email: e.email,
        name: e.name
      }))
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    next(err);
  }
}

// Signup
async function signup(req, res, next) {
  try {
    const { companyName, email, password, employees } = req.body;

    if (!companyName || !email || !password) {
      return res.status(400).json({ success: false, error: 'Company name, email, and password required' });
    }

    // Check if company already exists
    const existing = stmts.getCompanyByEmail.get(email);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Company with this email already exists' });
    }

    const companyId = crypto.randomUUID();
    const hashedPassword = hashPassword(password);

    stmts.createCompany.run(companyId, companyName, email, hashedPassword);

    // Add employees if provided
    if (employees && Array.isArray(employees)) {
      for (const employeeEmail of employees) {
        const employeeId = crypto.randomUUID();
        const employeeName = employeeEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
        stmts.createEmployee.run(employeeId, companyId, employeeEmail, employeeName);
      }
    }

    res.json({
      success: true,
      company: {
        id: companyId,
        name: companyName,
        email: email
      },
      message: 'Company registered successfully'
    });
  } catch (err) {
    console.error('[Auth] Signup error:', err);
    next(err);
  }
}

// Get company employees
async function getEmployees(req, res, next) {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ success: false, error: 'Company ID required' });
    }

    const employees = stmts.getEmployeesByCompany.all(companyId);

    res.json({
      success: true,
      employees: employees.map(e => ({
        id: e.id,
        email: e.email,
        name: e.name
      }))
    });
  } catch (err) {
    console.error('[Auth] Get employees error:', err);
    next(err);
  }
}

// Add employee to company
async function addEmployee(req, res, next) {
  try {
    const { companyId, email, name } = req.body;

    if (!companyId || !email) {
      return res.status(400).json({ success: false, error: 'Company ID and email required' });
    }

    // Check if employee already exists
    const existing = stmts.getEmployeesByCompany.all(companyId);
    if (existing.some(e => e.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ success: false, error: 'Employee with this email already exists' });
    }

    const employeeId = crypto.randomUUID();
    const employeeName = name || email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    stmts.createEmployee.run(employeeId, companyId, email, employeeName);

    res.json({
      success: true,
      employee: {
        id: employeeId,
        email: email,
        name: employeeName
      }
    });
  } catch (err) {
    console.error('[Auth] Add employee error:', err);
    next(err);
  }
}

module.exports = { login, signup, getEmployees, addEmployee, initializeDefaultCompanies };

