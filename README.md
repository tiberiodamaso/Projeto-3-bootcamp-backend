<h1 align="center">ExpressJS - #Análise DCP RESTfull API</h1>

[More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.16.17-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MongoDB.
5. Create a database with the name #AnaliseDCP with 5 collections: analises, dcps, logs, nfes and users
6. Open Postman desktop application
7. Choose HTTP Method and enter request url.(ex. localhost:3000/user/login)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
PORT=8080
MONGODB_URI=string connection to databse
TOKEN_SIGN_SECRET=secret to be used to cypher the token
CLOUDINARY_NAME=name in cloudinary to save images
CLOUDINARY_API=cloudinary api
CLOUDINARY_SECRET=cloudinary secret
EMAIL=email used to send confirmation account message
EMAIL_PASS=email password
REACT_URL=frontend url
```

## Frontend address

https://analisedcp.netlify.app/