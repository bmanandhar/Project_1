// require express and other modules
const express = require('express');
const app = express();

// allow cross origin requests (optional)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// bodyParser = require('body-parser'),
const db = require('./models');
// ctrl = require('./controllers');

// app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());

// ROUTES
// serve static files from public folder
app.use(express.static(__dirname + '/public'));


// HTML ENDPOINTS //
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// HTML ENDPOINTS //
app.get('/recommendations', (req, res) => {
  res.sendFile(__dirname + '/views/recommendations.html');
});

// HTML ENDPOINTS //
app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/views/profile.html');
});

  app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/views/profile.html');
  });

// JSON ENDPOINTS
// Document all your endpoints below as a simple hardcoded JSON object.
// need to double check paths as file structure get updated
// app.get('/restaurant', (req, res) => {
//     res.json({
//       endpoints: [
//         {method: "GET", path: "/", description: "Describes all available endpoints"},
//         {method: "GET", path: "/user", description: "About User"},
//         {method: "GET", path: "/restaurant", description: "View list of all recommended restaurants"}, 
//         {method: "GET", path: "/restaurant/:id", description: "View a specific restaurant by id"}, 
//         {method: "POST", path: "/restaurant", description: "Create a new restaurant"},
//         {method: "PUT", path: "/restaurant/:id", description: "Update a restaurant"}, 
//         {method: "DELETE", path: "/restaurant/:id", description: "Delete a specific restaurant by id"} 
//       ]
//     })
//   });

// PROFILE (location? should this be in user.js?)
app.get('./user', (req, res) => {
  res.json({
    name: "Homer Jay Simpson",
    message: "D'oh!",
    wife: "Marge Simpson",
    parentNames: "Abe Simpson + Mona Simpson",
    childrenNames: "Bart, Lisa, and Maggie",
    profileImage: "https://vignette.wikia.nocookie.net/simpsons/images/7/7f/Mmm.jpg/revision/latest?cb=20121205194537",
    currentCity: "San Francisco, California",
    homeTown: "Springfield",
  })
});

// GET ALL restaurant request
app.get('/restaurant', (req, res) => {
  //find all restaurants in db
  db.Restaurant.find({}, (err, allRestaurants) => {
    //if err, send err
    if (err) {
      console.log(err)
    };
    //else, respond with a json object of all the restaurants
    // console.log(allRestaurant);
    res.json(allRestaurants);
  });
});

// GET a specific restaurant by ID
app.get('/restaurant:id', (req, res) => {
  //get id from url parameters
  let restaurantId = req.params.id;
  //find restaurant in db by id
  db.Restaurant.findById(restaurantId, (err, foundRestaurant) => {
    if (err) {
      return console.log(err)
    };
    res.json(foundRestaurant);
  });
});

// CREATE a new restaurant
app.post('/restaurant', (req, res) => {
  //grab what the user entered in the body
  console.log(req.body);
  let newRestaurant = req.body;
  //take the req body and create a new restaurant in the db
  db.Restaurant.create(newRestaurant, (err, savedRestaurant) => {
    if (err) {
      return console.log(err)
    };
    res.json(savedRestaurant);
  });
});

// UPDATE a restaurant
app.put('/restaurant/:id', (req, res) => {
  //get restaurant by id from url params
  let restaurantId = req.params.id;
  //get updated body from req.body
  let updatedBody = req.body;

  // find and update the restaurant's attributes
  db.Restaurant.findOneAndUpdate({
      _id: restaurantId
    }, // search condition
    updatedBody, // new content to update
    {
      new: true
    }, // we want to receive the new object
    (err, updatedRestaurant) => { //callback
      if (err) {
        return console.log(err)
      };
      res.json(updatedRestaurant);
    });
});

// DELETE a restaurant
app.delete('/restaurant/:id', (req, res) => {
  //get the restaurant id from the url params
  let restaurantId = req.params.id;

  // find the restaurant by id and delete it
  db.Restaurant.deleteOne({
      _id: restaurantId
    },
    (err, deletedId) => {
      if (err) {
        return console.log(err)
      };
      res.json(deletedId);
    });
});

//SERVER
// listen on the port that Heroku prescribes (process.env.PORT) OR port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Express server is up and running on http://localhost:3000/');
});