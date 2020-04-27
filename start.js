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
                "Add Employee",
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

                case "Add Employee":
                    addEmployee();
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
    }, 2000)
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

                    // for (i = 0; i < result.length - 1; i++) {
                    //     role_id + "OR"
                    //     console.log(role_id)
                    // }

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
    listEmployees();
    console.log("\n Above is a Current List of Employees that are currently in the Database.")
    inquirer.prompt({
        name: "id",
        type: "input",
        message: "What is the Employee's ID?"
    })
}




function exitApp() {
    console.log("Goodbye!  Come back soon <3")
}