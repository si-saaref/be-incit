# BE Application

This application using NodeJS, Express as the framework, PostgreSQL as the database and Sequelize as the ORM

User allowed to register into this app, and also login to the app.
User can make CRUD feature from this app.

This app already integrated with the frontend app. Make sure you already run the BE app before running the FE app

## Run Locally

Clone the project

```bash
  git clone https://github.com/si-saaref/be-incit.git
```

Go to the project directory

```bash
  cd be-app
```

Install dependencies

```bash
  npm install
```

Create database from your terminal (better use command prompt)

```bash
  createdb db-incit-be
```

Create user admin for database (here you will get prompt to set the password) and make sure you fill passwrod with `admin123`

```bash
  createuser -P -s -e admin-dsb-incit
```

Migrate the table to create it in database

```bash
  npm run migrate
```

Start the server

```bash
  npm run dev
```

## Environment Variables

To run this project, you have to add some variable name to your environment variable `.env` file

Edit file `.env-example` (rename the file to `.env`) and change the variable into

`emailpassword`=`dhhr bwxe aofz vgck`
`email`=`achmadsyarif241@gmail.com`
`PORT`=`7878`

## Additional Information

In order to support security awareness,
I have add some dependecies that will protect the application against cyber attacks

These are the feature

- Helmet
- Cors
