# About this project
This project is a MySQL database.

# Installation
To run the databases, insert schema.sql data: in the terminal, type in `mysql -u root < schema.sql`
To run the databases, insert data.sql data: in the terminal, type in `mysql -u root < data.sql`

# Usage
To start mysql, in the terminal, type in `mysql -u root`

# Create a new database user
In the MySQL CLI:
```
CREATE USER 'ahkow'@'localhost' IDENTIFIED BY 'rotiprata123';
```

```
GRANT ALL PRIVILEGES on sakila.* TO 'ahkow'@'localhost' WITH GRANT OPTION;
```
**Note:** Replace *sakila* with the name of the database you want the user to have access to
 
 ```
FLUSH PRIVILEGES;
```
