require("dotenv").config();
let jwt = require("jsonwebtoken");

class HandlerGenerator {
  login(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = "admin";
    let mockedPassword = "password";

    if (username && password) {
      if (username === mockedUsername && password === mockedPassword) {
        let token = jwt.sign({ username: username }, process.env.SECRET_KEY, {
          expiresIn: "24h", // expires in 24 hours
        });

        // return the JWT token for the future API calls
        res.json({
          success: true,
          message: "Authentication successful!",
          token: token,
        });
      } else {
        res.send(403).json({
          success: false,
          message: "Incorrect username or password",
        });
      }
    } else {
      res.send(400).json({
        success: false,
        message: "Authentication failed! Please check the request",
      });
    }
  }
  index(req, res) {
    res.json({
      success: true,
      message: "Index page",
    });
  }
}

function checkToken(req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied",
    });
  }

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
}

module.exports = {
  HandlerGenerator,
  checkToken,
};
