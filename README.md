# Employee Tracker

Employee Tracker is a command-line application that allows businesses to manage their employee information. Users can view, add, update, and delete employee records, as well as view and manage department and role information.

## Features

- View Employees: Users can view a list of all employees, including their names, roles, departments, salaries, and manager information.
- Add Employees: Users can add new employees to the system, providing their information such as name, role, department, salary, and manager.
- Update Employees: Users can update existing employee records, including their roles and managers.
- Delete Employees: Users can delete employees from the system, removing their records from the database.
- View Departments: Users can view a list of all departments, along with their department IDs.
- Add Departments: Users can add new departments to the system, providing a department name.
- View Roles: Users can view a list of all roles, along with their role IDs, salaries, and department information.
- Add Roles: Users can add new roles to the system, providing a role title, salary, and department.

## Technologies Used

- Node.js: A JavaScript runtime environment used for building the command-line application.
- MySQL: A relational database management system used for storing employee, department, and role information.
- Inquirer: A popular package for creating interactive command-line prompts in Node.js applications.
- Console.table: A package for formatting and displaying data in a tabular format in the command-line.
- JavaScript: The programming language used for building the application's logic.
- ES6: The latest version of JavaScript with modern syntax and features.

## Installation

1. Clone the repository: `git clone https://github.com/JayPTucker/employee-tracker.git`
2. Change to the project directory: `cd employee-tracker`
3. Install dependencies: `npm install`
4. Set up MySQL database: Create a MySQL database using the provided schema.sql and seed.sql files in the `db` directory. You can use a MySQL client like MySQL Workbench or command-line tools to create and populate the database.
5. Update database connection: In the `index.js` file, update the `connection` object with your own MySQL database connection details, such as host, port, user, password, and database name.
6. Start the application: `node index.js`

## Usage

The Employee Tracker application is a command-line application, and users can interact with it through the command-line prompts. Follow the on-screen instructions to perform various operations, such as viewing, adding, updating, or deleting employees, departments, and roles.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions, comments, or suggestions, please feel free to contact me at [jaypaultucker@gmail.com](mailto:jaypaultucker@gmail.com).
 
## 📷 Screenshots: <a name='screenshots'></a>
![Example](assets/example.gif)
