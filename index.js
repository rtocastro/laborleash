const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Afipunk3!',
  database: 'employee_db'
});

// Connect to the database
(async () => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Prompt the user to select a choice using Inquirer
    const answers = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'choicelist',
        message: 'What would you like to do?',
        choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update employee role"]
      }
    ]);

    // Use the user's selection to construct a SQL query made functions to dry up code
    let sqlQuery;
    switch (answers.choicelist) {
      case "view all departments":
        sqlQuery = 'SELECT * FROM department';
        break;
      case "view all roles":
        sqlQuery = 'SELECT * FROM role';
        break;
      case "view all employees":
        sqlQuery = 'SELECT * FROM employee';
        break;
      case "add a department":
        await addDepartment();
        break;
      case "add a role":
        await addRole();
        break;
      case "add an employee":
        await addEmployee();
        break;
      default:
        console.log('Invalid choice');
        break;
    }

    if (sqlQuery) {
      // Execute the SQL query
      const [rows, fields] = await connection.execute(sqlQuery);

      // Display the results to the user
      console.log(`Here are the results for ${answers.choicelist}:`);
      console.table(rows);
    }

    // Release the connection back to the pool
    connection.release();

    // Close the connection pool
    pool.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
})();


//Functions for adding and updating
async function addDepartment() {
  const department = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:'
    }
  ]);
  await connection.execute('INSERT INTO department (name) VALUES (?)', [department.name]);
  console.log(`Department "${department.name}" added successfully.`);
}

async function addEmployee() {
  // Get role titles and inquirer to prompt for add
  const connection = await pool.getConnection();
  const [roles] = await connection.execute('SELECT title FROM role');
  const roleChoices = roles.map(role => role.title);

  const employee = await inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the last name of the employee:'
    },
    {
      type: 'list',
      name: 'role',
      message: 'Select the role for the employee:',
      choices: roleChoices
    }
  ]);

  const [roleId] = await connection.execute('SELECT id FROM role WHERE title = ?', [employee.role]);

  await connection.execute('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)', [employee.firstName, employee.lastName, roleId]);
  console.log(`Employee "${employee.firstName} ${employee.lastName}" added successfully.`);
}

async function addRole() {
  const connection = await pool.getConnection();
  // Get department name/names
  const [departments] = await connection.execute('SELECT name FROM department');
  const departmentChoices = departments.map(department => department.name);

  const role = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary of the role:'
    },
    {
      type: 'list',
      name: 'department',
      message: 'Select the department for the role:',
      choices: departmentChoices
    }
  ]);

  // Get department id based on department name
  const [departmentId] = await connection.execute('SELECT id FROM department WHERE name = ?', [role.department]);

  await connection.execute('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [role.title, role.salary, departmentId]);
  console.log(`Role "${role.title}" added successfully.`);
}