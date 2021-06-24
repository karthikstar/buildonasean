// server
// use app.js as the name for server file - for convenience when deploying to AWS
// can use alt names such as server.js, main.js etc

// Terminal is basically the way in which we innteract w a computer  esp when we are running apps which dont have a GUI
// for this backened app we need use the terminal

// node app.js to run the file
// when installing node it comes w npm - node package manager - to install 3rd party packages

// 1. first need to turn the folder into a npm package - npm init -y - will create a package.json
// package.json will describe how to start our app, what dependecies it has etc
// script under package.json is a way for us to write shortcuts to for instance run app.js

// 2. to create a server - need to install Express 
// Express allows us to create servers. - easiest way to create servers

// 3.import the library that we have installed.
const dotenv = require('dotenv') 
dotenv.config() 
// these above 2 lines will ensure that after dotenv has been imported, it will cong such that it will populate this file with the credentials in .env

const express = require('express')
const dynamoose = require('dynamoose') // the moment we import this it will read the authentication key from process env. tries to read the credentials which has alr been populated by dotenv.

const uuid = require('uuid') // library that allows us to create random strings
const cors = require('cors')
// SET REGION FOR dynamoose to find the data
dynamoose.aws.sdk.config.update({
  region: 'us-east-1'
})
// dynambodb is unopiniated doesnt care about what data we upload
// however we might want some consitency, e.g table shld contain a couple of fields - name, age , etc to be predefined - hence use schema
const schema = new dynamoose.Schema({
  id: String,
  name: String,
  age: Number,
  address: {
    type: Object,
    schema: {
      unitNumber: String,
      buildingName: String
    }
  },
  pastEducation: {
    type: Array,
    schema: [String]
  }
})

const HR = dynamoose.model('build-on-test-database', schema) // HR will be the reference we use to interact w the table itself.
const app = express() // this is how we create the application

// MIDDLEWARE
app.use(cors()) // this will unlock the security feature - allow us to call the api frontend.
app.use(express.json()) // turns on the ability for express app to be able to read payloads and store in req object.

// HTTP protocol has aformat where they follow a couple of keywords - GET POST PUT DELETE methods

// 4. when theres a GET req to / path i will respond with a single string called hello world
// USE CASE: e.g read from database
app.get('/', (req, res) => {
  // req - where all thje info about the request is coming in is gonna be stored
  // res - contains all the functions methods that allows us to craft the msgh back to the one who's requesting it.
  HR.scan().exec().then((data) => {
    res.json(data)
  })
  .catch((err) => {
    res.json(err)
  })
}); // can use JSON to store objects arrays etc etc

// USE CASE: create entries, create new employee etc

// 5. post does a little more than get - it allows us to send payloads
// to configure our express app to be able to read payloads - need to set up MIDDLEWAREs
app.post('/', (req, res) => {
  //create a entry in the database based on the info in req.body (which shld follow the schema of the db),
  // send a response back which contains the new data
  // use .catch for error handling, so if any error send back response with the error
  HR.create({
    id: uuid.v4(),
    ...req.body,
  }).then((data) => {
      res.json(data)
  }).catch((err) => {
    res.json(err)
  })
}) // use Insomnia to test - send post req to localhost:3000 and see if u get a res back w additional field id.

  // . catch to handle errors
  // console.log(req.body)
  //  as u can see altho we pass json string as body of post req on insomnia, it gets formatted properly to javascript object notation
// 6. PUT- usecase - update existing entries
app.put('/', (req, res) => {
  // HR.update
  res.json({
    type: 'PUT',
    ...req.body
  })
})
// 7. DELETE - usecase - delete entries.
app.delete('/', (req, res) => {
  // HR.delete
  res.json({
    type: 'DELETE',
    ...req.body
  })
})
// all these above 4 apis are ready to listen to the requests depending on the method and path.
const port = process.env.PORT || 3000// read what port no elastic beanstalk has given
// try to run port at the port no given by elastic, but if no port no is present, aka meaning when we running locally, use 3000.

app.listen(port , () => {
  console.log('server is listening at port 3000')
}) // pass port number as first argument
// BUT AFTER DEVELOPMENT and going to proceed to deployment to elastic beanstalk,

// can use Insomnia / postman - to work with servers - to test whether server's endpoints are correct etc.

// to transmit v complex data structs e.g dicts,objects,arrays etc we use JSON a simple language
// json basically is a string thats formated in a certain way that everyone agrees on so that trhey can emulate a certain data structure


// lastly, deploy this backend app onto a service called Elastic Beanstalk.
// Elastic Beanstalk - orchestrationb service - a service that manages a whole bunch of little computers called EC2 and their job is to manage those ec2 computers for us.

// so elastic beanstalk is not the one hosting this app but say it is the one hosting a whole bunch of little computers for them to host the app for us.

// if appo gets popular, there will be many users -> hence a single little computer wont be able to handle the server load for the app.
// this is where elastic beanstalk comes to play - it creates more EC2 instances to handle any sudden spikes of demand, more ec2 computers, and handle the server load
// for deployment to work - ensure below 3 criterias are fufilled.
//1.change port number to process.env.PORT
//2.make sure have a script under package,json called start: node app.js
//3. file must be NAMED as app.js 



// DATABASE PROGRAMMING with Amazon DynamoDB - no sql database similar to mongoDB
// 1. npm i dynamoose 
// dynamoose needs to be authenticated in order to connect to dynamodb which lives in the cloud.
// 2. get credentials from labs.vocareum -> Account Details 
// 3. create .env file to store these special / secret keys - make sure the names of they keys are in CAPS.
// import dynamoose , npm i dotenv
// const dotenv = require('dotenv') 
// dotenv.config.config() 
// 4. set the region
// 5. see above us of HR(can be any const name actl)
// install CORS - npm i cors - uisually sites only allow website thats hosted by same server to access it

// so we need install cors to disable this particular security settings so that we can make calls to this particular server