const mysql = require("mysql");
const inquirer = require("inquirer");
const CFonts = require("cfonts");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user:"root",

    password: "password",
    database: "employee_tracker"
});

connection.connect(function(err) {
    if (err) throw err;
    loadIntro();
})


// PROCESS OF LOADING THE MAIN MENU --- THE INTRO DECOR
function loadIntro() {
    console.log("Loading...")

    CFonts.say("Welcome To:", {
        font: "chrome",
        align: "center",
        lineHeight: 0,
        space: true
    })
    
    setTimeout(function() {
        CFonts.say("Employee Tracker", {
            font: "block",
            align: "center",
            colors: ["system"],
            background: "transparent",
            letterSpacing: 2,
            lineHeight: 0,
            space: false,
            gradient: "red,blue",
            independentGradient: true,
            transitionGradient: false
        })
    }, 2000)

    setTimeout(function() {
        CFonts.say("Created By: Jay Paul Tucker", {
            font: "console",
            align: "center",
            lineHeight: 0,
            space: false
        })
    }, 4000)

    setTimeout(function() {
        loadMainMenu()
    }, 5000)
}


// LOADS THE ACTUAL MAIN MENU WHERE THERE ARE FUNCTIONAL BUTTONS
function loadMainMenu() {
    inquirer.prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View all Employees",
                "View all Employees by Department",
                "View all Employees by Manager",
                "View all Roles",
                "View all Departments",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "Exit"
            ]
        }).then(function(choice) {
            switch (choice.action) {
                case "View all Employees":
                    listEmployees();
                    break;

                case "View all Employees by Department":
                    viewDepartmentEmployees();
                    break;

                case "View all Employees by Manager":
                    viewManagerEmployees();
                    break;

                case "View all Roles":
                    viewRoles();
                    break;
                
                case "View all Departments":
                    viewDepartments();
                    break;
                
                case "Add Employee":
                    addEmployee();
                    break;

                case "Add Role":
                    createRole();
                    break;
                
                case "Add Department":
                    createDepartment();
                    break;

                case "Remove Employee":
                    break;

                case "Update Employee Role":
                    break;

                case "Update Employee Manager":
                    break;

                case "Exit":
                    exitApp();
                    break;
            }
        });
};



// FUNCTION THAT ASKS IF WE WANT TO RETURN TO OUR MAIN MENU
function returnToMainMenu() {
    setTimeout(function() {
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Done!  Return to the Main Menu?",
            choices: [
                "Yes",
                "No"
            ]
        }).then(function(choice) {
            switch (choice.action) {
                case "Yes":
                    console.clear()
                    loadMainMenu();
                    break;
                case "No":
                    console.log("... Well what else are you gonna do...")
            }
        })
    }, 1000)
}


// FUNCTION THAT LISTS OUR EMPLOYEES FROM OUR DATABASE
function listEmployees() {
    console.log("\nLoading...\n")
    connection.query("SELECT * FROM employee_tracker.employee", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
        returnToMainMenu();
    })
};


// VIEWING EMPLOYEES BY WHAT DEPARTMENT THEY ARE IN

function viewDepartmentEmployees() {
    console.log("\nLoading...\n")
    console.log("Currently Available Departments:")
    connection.query("SELECT * FROM employee_tracker.department;", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
    inquirer.prompt({
        name:  "name",
        type: "input",
        message: "What's the Department name?"
    }).then(function({name}) {

        connection.query("SELECT id FROM employee_tracker.department WHERE name='" + name + "'", function (err, result, fields) {
            if (err) throw err
            var department_id = (result[0].id) 

            connection.query("SELECT id FROM employee_tracker.role WHERE department_id='" + department_id + "'", function (err, result, fields) {
                if (err) throw err;
                for (i = 0; i < result.length; i++) {
                    var role_id = "role_id=" + "'" + result[i].id + "'"

                    connection.query("SELECT * FROM employee_tracker.employee WHERE " + role_id, function (err, result, fields) {
                        if (err) throw err;
                        console.table(result)
                        
                    })
                }
            })
        }) 
        returnToMainMenu();
    })
    })
};


// SHOWS A MANAGERS EMPLOYEES

function viewManagerEmployees() {
    console.log("\nLoading...\n")
    console.log("List of Current Managers to Search by:")
    connection.query("SELECT * FROM employee_tracker.employee WHERE manager_id IS NULL", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
    })
    setTimeout(function() {
        inquirer.prompt({
            name: "id",
            type: "input",
            message: "Please Type in a Manager's ID from the Chart Above to see their Employees."
        }).then(function({ id }) {
            connection.query("SELECT * FROM employee_tracker.employee WHERE manager_id='" + id + "'", function (err, result, fields) {
                if (err) throw err;
                console.table(result);
                returnToMainMenu();
            })
        })
    }, 1000)
};




// FUNCTION THAT ADDS EMPLOYEES TO THE DATABASE

function addEmployee() {
    console.log("\nLoading...\n")
    connection.query("SELECT * FROM employee_tracker.employee", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
    })

    setTimeout(function(){
        console.log("Above is a Current List of Employees that are currently in the Database.")

        connection.query("SELECT * FROM employee_tracker.role", function (err, result, fields) {
            if (err) throw err;
            if(result[0] == null) {
                inquirer.prompt({
                    name: "action",
                    type: "list",
                    message: "There are no Roles to give to your Employee.  Please Create One Before Continuing.",
                    choices: [
                        "Create a New Role",
                        "Return to Main Menu"
                    ]
                }).then(function(choice) {
                    switch (choice.action) {
                        case "Create a New Role":
                            createRole();
                            break;
                        case "Return to Main Menu":
                            console.clear()
                            loadMainMenu();
                            break;
                    }
                })
            }
        })
        // inquirer.prompt([{
        //     name: "id",
        //     type: "input",
        //     message: "What is the New Employee's ID?"
        // } , {
        //     name: "first_name",
        //     type: "input",
        //     message: "What is the Employee's First Name?"
        // } , {
        //     name: "last_name",
        //     type: "input",
        //     message: "What is the Employee's Last Name?"
        // }
        // ]).then(function() {
        //     if(connection.query("SELECT * FROM employee_tracker.role") === "NULL") {
        //         console.log("Nothin Here")
        //     }
        // })
    }, 1000)
    
};



// FUNCTION TO VIEW THE ROLES
function viewRoles() {
    console.log("\nLoading...\n")

    connection.query("SELECT * FROM employee_tracker.role", function (err, result, fields) {
        if (err) throw err;
        if (result[0] == null) {
            inquirer.prompt({
                name: "answer",
                type: "list",
                message: "There are no Roles To be found in the System, Would you like to Create One?",
                choices: [
                    "Yes",
                    "No, Return to Main Menu"
                ]
            }).then(function(choice) {
                switch (choice.answer) {
                    case "Yes":
                        console.clear();
                        createRole();
                        break;
                    case "No, Return to Main Menu":
                        console.clear();
                        loadMainMenu();
                        break;
                }
            })
        } else {
            console.table(result);
        }
        
    })
};


// FUNCTION TO VIEW THE DEPARTMENTS
function viewDepartments() {
    console.log("\nLoading...\n")

    connection.query("SELECT * FROM employee_tracker.department", function (err, result, fields) {
        if (err) throw err;
        if (result[0] == null) {
            inquirer.prompt({
                name: "answer",
                type: "list",
                message: "There are no Departments To be found in the System, Would you like to Create One?",
                choices: [
                    "Yes",
                    "No, Return to Main Menu"
                ]
            }).then(function(choice) {
                switch (choice.answer) {
                    case "Yes":
                        console.clear();
                        createDepartment();
                        break;
                    case "No, Return to Main Menu":
                        console.clear();
                        loadMainMenu();
                        break;
                }
            })
        } else {
            console.table(result);
            returnToMainMenu();
        }
        
    })
};



// CREATING ROLES FOR OUR EMPLOYEES
function createRole() {
    console.log("\nLoading...\n")

    connection.query("SELECT * FROM employee_tracker.role", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
        console.log("Above is a List of Roles that already exist (if any)")
    })

    setTimeout(function(){
        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "What would you like the Role ID to be? (It cannot match any Existing ones)"
        } , {
            name: "title",
            type: "input",
            message: "What's the Title of this Role?"
        } , {
            name: "salary",
            type: "input",
            message: "What's the Salary of this Role/Position?"
        }])
        
        
        // .then(function() {
        //     connection.query("SELECT * FROM employee_tracker.department", function (err, result, fields) {
        //         if (err) throw err;
        //         if (result[0] == null) {
        //             inquirer.prompt({
        //                 name: "answer",
        //                 type: "list",
        //                 message: "There are no Existing Departments, would you like to Create One?",
        //                 choices: [
        //                     "Yes",
        //                     "No, Return to Main Menu"
        //                 ]
        //             }).then(function(choice) {
        //                 switch (choice.answer) {
        //                     case "Yes":
        //                         createDepartment();
        //                         break;
        //                     case "No, Return to Main Menu":
        //                         console.clear();
        //                         loadMainMenu();
        //                         break;
        //                 }
        //             }).then(function({ id, title, salary }) {
        //                 connection.query("INSERT INTO role (id, title, salary, department_id) VALUES (" + id + ",'" + title + "', " + salary + ", '" + department_id + "')",  function (err, result, fields) {
        //                     if (err) throw err;
        //                     console.table(result);
        //                 })
        //             })
        //         }
        //     })
        // })
    }, 1000)
};




// CREATES A DEPARTMENT

function createDepartment() {
    console.log("\nLoading...\n")

    connection.query("SELECT * FROM employee_tracker.department", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
        console.log("Above is a List of Departments that already exist (if any)")
    })

    setTimeout(function(){
        inquirer.prompt([{
            name: "id",
            type: "input",
            message: "What would you like the Department ID to be? (It cannot match any Existing ones)"
        } , {
            name: "name",
            type: "input",
            message: "What's Name of this Department?"
        }]).then(function({ id, name }) {
            connection.query("INSERT INTO department (id, name) VALUES (" + id + ", '" + name + "');", function (err, result, fields) {
                if (err) throw err;
                returnToMainMenu();
            })
        })
    })
};



// EXIT FUNCTION:
function exitApp() {
    console.log("Goodbye!  Come back soon <3")
}