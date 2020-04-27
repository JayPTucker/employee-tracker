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
                    break;

                case "Remove Employee":
                    break;

                case "Update Employee Role":
                    break;

                case "Update Employee Manager":
                    break;

                case "Exit":
                    break;
            }
        });
};

function listEmployees() {
    console.log("\nLoading...\n")
    connection.query("SELECT * FROM employee_tracker.employee", function (err, result, fields) {
        if (err) throw err;
        console.table(result);
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
                    loadMainMenu();
                    break;
                case "No":
                    console.log("... Well what else are you gonna do...")
            }
        })
    })
};

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
        console.log(name)

        connection.query("SELECT id FROM employee_tracker.department WHERE name='" + name + "'", function (err, result, fields) {
            if (err) throw err
            var departmentID = (result[0].id) 

        connection.query("SELECT id FROM employee_tracker.role WHERE department_id='" + departmentID + "'", function (err, result, fields) {
            if (err) throw err;
            for (i = 0; i < result.length; i++) {
                var roleID = "role_id=" + "'" + result[i].id + "'"

                // for (i = 0; i < result.length - 1; i++) {
                //     roleID + "OR"
                //     console.log(roleID)
                // }
                connection.query("SELECT * FROM employee_tracker.employee WHERE " + roleID, function (err, result, fields) {
                    if (err) throw err;
                    console.table(result)
                })
            }

            // connection.query("SELECT * FROM employee_tracker.employee WHERE " + roleID, function (err, result, fields) {
            //     if (err) throw err;
            //     console.table(result)
            // })
        })
        })
        
    })
    })
}

// function viewManagerEmployees() {}