# Using a MySQL Container

This project uses a MySQL database. For local development, you can set up a Docker image to run the database.

## Setup

The first time you run this project on your machine, you will need to set up a Docker image for the database. After installing and opening Docker Desktop, run the following command:

```sh
docker run -d --name mysql -p3306:3306 -e MYSQL_ROOT_PASSWORD=db-password mysql
```

This will install MySQL and expose it on port 3306 (the default for a MySQL database) of your machine. Make sure to update `db-password` to the password you would like to use.

Next, you will need to run some MySQL commands to set up the database for use by the website:

```console
user@computer:/Tasktix$ docker exec -i -t mysql bash
bash-4.4# mysql -u root -p
mysql> CREATE DATABASE todo;
```

After this, copy and paste all [database setup SQL commands](/scripts/database/create.sql) into the terminal and execute them. This will set up all database tables.

## Stopping the Database

```sh
docker stop mysql
```

## Starting the Database Again

```sh
docker restart mysql
```
