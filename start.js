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


// (FINISHED) PROCESS OF LOADING THE MAIN MENU --- THE INTRO DECOR
function loadIntro() {
    console.clear();
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
    }, 4500)

    setTimeout(function() {
        loadMainMenu()
    }, 6500)
}


// (FINISHED) LOADS THE ACTUAL MAIN MENU WHERE THERE ARE FUNCTIONAL BUTTONS
function loadMainMenu() {
    console.clear();
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



// (FINSIHED) FUNCTION THAT ASKS IF WE WANT TO RETURN TO OUR MAIN MENU
function returnToMainMenu() {
    setTimeout(function() {
        inquirer.prompt({
            name: "action",
            type: "list",
            message: "Done!  Return to the Main Menu?",
            choices: [
                "Yes"
            ]
        }).then(function(choice) {
            switch (choice.action) {
                case "Yes":
                    loadMainMenu();
                    break;
            }
        })
    }, 1000)
}


// (FINISHED) FUNCTION THAT LISTS OUR EMPLOYEES FROM OUR DATABASE
function listEmployees() {
    console.clear();
    console.log("\nLoading...\n")

    connection.query("SELECT * FROM employee_tracker.employee", function (err, result, fields) {
        if (err) throw err;

        if (result[0] == null) {
                inquirer.prompt({
                    name: "answer",
                    type: "list",
                    message: "There are no Employees found in the System, would you like to add one?",
                    choices: [
                        "Yes",
                        "No, Return to Main Menu"
                    ]
                }).then(function(choice) {
                    switch (choice.answer) {
                        case "Yes":
                            addEmployee();
                            break;
                        case "No, Return to Main Menu":
                            loadMainMenu();
                            break;
                    }
                }) 
        } else {
            console.table(result);
            inquirer.prompt({
                name: "answer",
                type: "list",
                message: "What would you like to do?",
                choices: [
                    "Add another Employee",
                    "Delete an Employee",
                    "Edit an Employee",
                    "Return to the Main Menu"
                ]
            }).then(function(choice) {
                switch (choice.answer) {
                    case "Add another Employee":
                        addEmployee();
                        break;
                    case "Delete an Employee":
                        deleteEmployee();
                        break;
                    case "Edit an Employee":
                        editEmployee();
                        break;
                    case "Return to the Main Menu":
                        loadMainMenu();
                        break;
                }
            })
        }
    })
};

function deleteEmployee() {
    inquirer.prompt({
        name: "id",
        type: "input",
        message: "By ID, what Employee would you like to remove from the Database?"
    }).then(function({ id }) {
        connection.query(`DELETE FROM employee WHERE id=${id}`)
        listEmployees();
    })
};

function editEmployee() {
    inquirer.prompt({
        name: "id",
        type: "input",
        message: "By ID, what Employee would you like to edit?"
    }).then(function({ id }) {
        console.clear()
        connection.query(`SELECT * FROM employee_tracker.employee WHERE id=${id}`, function (err, result, fields) {
            if (err) throw err;
            console.table(result)
            inquirer.prompt([{
                name: "answer",
                type: "list",
                message: "What Would you like to Change?",
                choices: [
                    "ID",
                    "First Name",
                    "Last Name",
                    "Role ID",
                    "Manager ID"
                ]
            }]).then(function(choice) {
                switch (choice.answer) {
                    case "ID":
                        changeID();
                        break;
                    case "First Name":
                        changeFirstName();
                        break;
                    case "Last Name":
                        changeLastName();
                        break;
                    case "Role ID":
                        changeRoleName();
                        break;
                    case "Manager ID":
                        changeManagerID();
                        break;
                }
            })
        })

        // ---------------------------------------------------

        // CHANGE THE ID

        function changeID() {
            connection.query("SELECT * FROM employee_tracker.employee", function(err, result, fields) {
                if (err) throw err;
                console.table(result)
            })
            setTimeout(function() {
                console.clear()
                inquirer.prompt({
                    name: "newID",
                    type: "input",
                    message: "What would you like the Employees new ID to be?  It can't match any existing IDs above."
                }).then(function({ newID }) {
                    connection.query(`UPDATE employee SET id=${newID} WHERE id=${id};`, function(err, result, fields) {
                        if (err) throw err;
                        returnToMainMenu();
                    })
                })
            }, 500)
        }
    })
}


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
    console.clear();
    console.log("\nLoading...\n")

    let hasDepartment = true
    let hasRole = true

    connection.query("SELECT * FROM employee_tracker.department", function (err, result, fields) {
        if (err) throw err;
        if (result[0] == null) {
            hasDepartment = false
            noDepartmentFound();
        } else {
            checkForRoles();
        }
    });

    function checkForRoles() {
        connection.query("SELECT * FROM employee_tracker.role", function (err, result, fields) {
            if (err) throw err;
            if (result[0] == null) {
                hasRole = false
                noRoleFound();
            } else {
                createEmployee();
            }
        })
    };

    function createEmployee() {
        connection.query("SELECT * FROM employee_tracker.employee", function(err, result, fields) {
            if (err) throw err;
            if (result[0] == null) {
                console.log("No Existing Employees to be found.")
            } else {
                console.table(result)
                console.log("Above is a list of already-existing Employees,")
            }
        })
        setTimeout(function() {
            inquirer.prompt([{
                name: "id",
                type: "input",
                message: "What would you like the Employee's ID to be? (It cannot match any existing Employee's IDs)"
            }, {
                name: "first_name",
                type: "input",
                message: "What's the Employee's First Name?"
            }, {
                name: "last_name",
                type: "input",
                message: "What's the Employee's Last Name?"
            }]).then(function({ id, first_name, last_name }) {
                connection.query("SELECT * FROM employee_tracker.role", function(err, result, fields) {
                    if (err) throw err;
                    console.table(result)
                    inquirer.prompt({
                        name: "role_id",
                        type: "input",
                        message: "Based on the Chart above, what Role should this Employee be Given? (Type in the ID)"
                    }).then(function({ role_id }) {
                        connection.query("SELECT * FROM employee_tracker.employee", function(err, result, fields) {
                            if (err) throw err;
                            console.table(result)
                            inquirer.prompt({
                                name: "manager_id",
                                type: "input",
                                message: "Based on the Chart above, who is the Employee's Manager? (Type in NULL if they are the Manager)"
                            }).then(function({ manager_id }) {
                                connection.query(`INSERT INTO employee (id, first_name, last_name, role_id, manager_id) 
                                                  VALUES (${id}, "${first_name}", "${last_name}", ${role_id}, ${manager_id})`)
                                returnToMainMenu();
                                
                                // INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
                                // VALUES (1, "Jay", "Tucker", 1, 3);
                            })
                        })
                    })
                })
            })
        }, 1000)
    };

    function noDepartmentFound() {
        console.clear();
        createDepartment();
        console.log("A Department is Required in Order to add an Employee to the Database,")
    };

    function noRoleFound() {
        createRole();
        setTimeout(function() {
            console.log("A Role is Required in Order to add an Employee to the Database,")
        }, 1000)
        
    };
};



// (FINISHED) FUNCTION TO VIEW THE ROLES
function viewRoles() {
    console.clear();
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
            returnToMainMenu();
        }
        
    })
};


// (FINISHED) FUNCTION TO VIEW THE DEPARTMENTS
function viewDepartments() {
    console.clear();
    console.log("\nLoading...\n")

    connection.query("SELECT * FROM employee_tracker.department", function (err, result, fields) {
        if (err) throw err;
        if (result[0] == null) {
            inquirer.prompt({
                name: "answer",
                type: "list",
                message: "There are no Existing Departments To be found in the System, Would you like to Create One?",
                choices: [
                    "Yes",
                    "No, Return to Main Menu"
                ]
            }).then(function(choice) {
                switch (choice.answer) {
                    case "Yes":
                        createDepartment();
                        break;
                    case "No, Return to Main Menu":
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

// ------------------------------------------------------


// (FINISHED) CREATING ROLES FOR OUR EMPLOYEES
function createRole() {
    console.clear();
    console.log("\nLoading...\n")

    connection.query("SELECT * FROM employee_tracker.department", function (err, result, fields) {
        if (result[0] == null) {
            inquirer.prompt({
                name: "answer",
                type: "list",
                message: "There are no Existing Departments needed in order to Create a Role, would you like to Create One?",
                choices: [
                    "Yes",
                    "No, Return to Main Menu"
                ]
            }).then(function(choice) {
                switch (choice.answer) {
                    case "Yes":
                        createDepartment();
                        break;
                    case "No, Return to Main Menu":
                        loadMainMenu();
                        break;
                }
            })
        } else {
            connection.query("SELECT * FROM employee_tracker.role", function (err, result, fields) {
                if (err) throw err;
                if (result[0] == null) {
                    console.clear()
                    createRoleFunction()
                } else {
                    console.table(result);
                    console.log("^ Above is a List of Roles that already exist ^")
                    createRoleFunction();
                }            
            })
            
            function createRoleFunction() {
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
                    }]).then(function({id, title, salary}) {
                        connection.query("SELECT * FROM employee_tracker.department", function (err, result, fields) {
                            if (err) throw err;
                            console.table(result)
    
                            setTimeout(function() {
                                inquirer.prompt({
                                    name: "department_id",
                                    type: "input",
                                    message: "Based on the Chart above, what's the Department ID that's going to be associated with this Role?"
                                }).then(function({department_id}) {
                                    connection.query("INSERT INTO role (id, title, salary, department_id) VALUES (" + id + ", '" + title + "', " + salary + ", " + department_id + ");", function (err, result, fields) {
                                        if (err) throw err;
                                        returnToMainMenu();
                                    })
                                })
                            }, 1000)
                        })
                    })
                }, 1000)
            }
        }
    })
};

// -------------------------------------------


// (FINISHED) CREATES A DEPARTMENT

function createDepartment() {
    console.clear();
    console.log("\nLoading...\n")

    connection.query("SELECT * FROM employee_tracker.department", function (err, result, fields) {
        if (err) throw err;
        if (result[0] == null) {
            inquirer.prompt({
                name: "answer",
                type: "list",
                message: "There are currently No Departments in the Database.  Please Create one.",
                choices: [
                    "Ok",
                    "No, Return to the Main Menu"
                ]
            }).then(function(choice) {
                switch (choice.answer) {
                    case "Ok":
                        createDepartmentFunction();
                        break;
                    case "No, Return to the Main Menu":
                        loadMainMenu();
                        break;
                }
            })
        } else {
            console.table(result);
            console.log("^ Above is a List of Departments that already exist ^") 
            createDepartmentFunction();
        }

        function createDepartmentFunction() {
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
        }
    })  
};

// --------------------------------------------------------


// (FINISHED) EXIT FUNCTION:

function exitApp() {
    console.log("Goodbye!  Come back soon <3")
}

// --------------------------------------------------------