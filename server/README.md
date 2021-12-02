# API Server


## set up db
Insert the following user in the DB:

```sql
insert into user values (
'2021-05-14 22:38:27.741543', '2021-11-12 21:07:42.000000', '1', '4', 'admin2', 'doe', 'admin@bizpy.io', 'lala', 'Web', '1134564262', '1134564262', 'Av salvador maria del carril 4938', '1419', '26466268', 'Buenos aires', 'caba', 'ADMIN' )
```


This is the API server made in Node.js.

You can run this commands to start it, or similar with `npm`:

```sh
yarn install
yarn debug
```

Bear in mind that it has a connection to a MySQL database that needs some extra environment variables when starting it.

```sh
process.env.DB_HOST
process.env.DB_PORT
process.env.DB_USER
process.env.DB_PASS
process.env.DB_SCHEMA
process.env.TOKEN_SECRET
process.env.JWT_SECRET
```

You have 3 choices for now:

- Either you pass those variables when executing the yarn command:

```sh
DB_HOST='value1' DB_PORT='value2' DB_USER='value3' DB_PASS='value4' DB_SCHEMA='value5' yarn debug
```

- or you can change it in the code for now (not recommended):

```sh
...
username: process.env.DB_USER || "test",
...
```

- The best one, should be to add the ['config' package from npm](https://www.npmjs.com/package/config) to easily configure it for dev and prod mode.
