INSERT INTO department (name)
VALUES ("Digital Printing"),
       ("Pre-Press"),
       ("Offset Printing");

INSERT INTO role (title, salary, department_id)
VALUES ("Digital Pressman", 36000, 1),
       ("Digital Manager", 50000, 1),
       ("Pressman", 75000, 3),
       ("Pressroom Manager", 90000, 3),
       ("Platesetter", 44000, 2),
       ("Pre-Press Manager", 60000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Raul", "Valencia", 2, NULL),
       ("Arturo", "Garcia",1, 1),
       ("Jesse", "Granados", 4, NULL),
       ("Nazario", "Parra", 3, 3);
    

