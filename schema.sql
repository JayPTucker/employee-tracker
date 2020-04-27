DROP DATABASE IF EXISTS employee_tracker;
CREATE DATABASE employee_tracker;

USE employee_tracker;

CREATE TABLE department (
    id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
    id INTEGER PRIMARY KEY NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER
);

-- DEPARTMENT --
INSERT INTO department (id, name)
VALUES (1, "TTT");

-- EMPLOYEE 1 --
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, "Jay", "Tucker", 1, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, "Jeret", "Tucker", 1, 2);

-- EMPLOYEE 2 (MANAGER) --
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, "Jeff", "Tucker", 2, NULL);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, "Keith", "Tucker", 2, NULL);

-- ROLE 1 (MANAGER) --
INSERT INTO role (id, title, salary, department_id)
VALUES (1, "Mechanic", 3000, 1);

INSERT INTO role (id, title, salary, department_id)
VALUES (2, "Manager", 1000000, 1);



-- ID, FIRST NAME, LAST NAME, TITLE, DEPARTMENT, SALARY, MANAGER