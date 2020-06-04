/**********************/
/** Routing Functions */
/**********************/

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to the database
const db = require('./db.js');
db.init();

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// check if an email/password match an existing record
app.route("/submit-user").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.findUser({ email: email }, (err, userFound) => {
    if (err) {
      res.json({ error: 0 });
    } else if (userFound) {
      if (userFound.password === password) {
        // key found
        res.json({ key: userFound.key });
      } else {
        // Password mismatch
        res.json({ error: 1 });
      }
    } else {
      // User not found
      res.json({ error: 2 });
    }
  });
});

// create a new record
app.route("/add-user").post((req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.createUser(email, password, (err, data) => {
    if (err) {
      res.json({ error: 0 });
    } else {
      res.json({ key: data.key });
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

// Fetch the current integer
// https://iiaas.glitch.me/v1/current?key=<key>
// curl https://iiaas.glitch.me/v1/current -H "key: XXXXXXXXXX"
// Reset the current integer
// curl -X "PUT" https://iiaas.glitch.me/v1/current -H "key: XXXXXXXXXX" -d "current=50"
app
  .route("/v1/current")
  .get((req, res) => {
    const key = req.query.key || req.headers.key;
    db.findUser({ key: key }, (err, data) => {
      handleRequest(req, res, err, data);
    });
  })
  .put((req, res) => {
    const key = req.query.key || req.headers.key;
    const value = Number(req.body.current);
    if (value >= 0) {
      db.setInteger(key, value, (err, data) => {
        handleRequest(req, res, err, data);
      });
    } else {
      // Invalid value
      res.json({ error: 0 });
    }
  });


// An alternative to reset the current integer
// /v1/set?key=<key>&value=<new-value>
app.route("/v1/set").get((req, res) => {
  const key = req.query.key || req.headers.key;
  const value = Number(req.query.value);
  if (value >= 0) {
    db.setInteger(key, value, (err, data) => {
      handleRequest(req, res, err, data);
    });
  } else {
    // Invalid value
    res.json({ error: 0 });
  }
});

// Fetch the next integer
// /v1/next?key=<key>
// curl https://iiaas.glitch.me/v1/current -H "key: XXXXXXXXXX"
app.route("/v1/next").get((req, res) => {
  const key = req.query.key || req.headers.key;
  db.incrementInteger(key, (err, data) => {
    handleRequest(req, res, err, data);
  });
});

function handleRequest(req, res, err, userFound) {
  if (err) {
    res.json({ error: 0 });
  } else {
    const key = req.query.key || req.headers.key;
    if (userFound && userFound.key === key) {
      // key found
      res.json({ integer: userFound.integer });
    } else {
      // unknown key
      res.json({ error: 2 });
    }
  }
}
