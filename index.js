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

    // Use the user's selection to construct a SQL query
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