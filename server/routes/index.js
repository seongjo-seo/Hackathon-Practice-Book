/** 전체 컨트롤 routes */
const {
    accessTokenSecret,
    refreshTokenSecret,
  } = require("../config/secret.js");
  const jwt = require("jsonwebtoken");
  
  const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (authHeader) {
      const token = authHeader.split(" ")[1];
  
      jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
  
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  };
  
  module.exports = (app) => {
    const users = require("../controllers/user.js");
  
    const login = require("express").Router();
    const logout = require("express").Router();
    const user = require("express").Router();
  
    // ## User Router
  
    // Create a new User
    user.post("/", users.create);
  
    // Retrieve all Users
    user.get("/", authenticateJWT, users.findAll);
  
    /** Retrieve all published Users  */
    user.get("/published", users.findAllPublished);
  
    // Retrieve a single User with id
    user.get("/:id", authenticateJWT, users.findOne);
  
    // Update a User with id
    user.put("/:id", authenticateJWT, users.update);
  
    // Delete a User with id
    user.delete("/:id", authenticateJWT, users.delete);
  
    // Create a new User
    user.delete("/", authenticateJWT, users.deleteAll);
  
    // ## Login Router
  
    // Sign In Request & Response
    login.post("/signin", async (req, res) => {
      try {
        const user = await users.findByIdentityAndPassword(req, res);
  
        if (user) {
          // const accessToken = jwt.sign(
          //   { username: user.identity, role: user.role },
          //   accessTokenSecret
          // );
  
          // Return RefreshToken
          const refreshToken = jwt.sign(
            { id: user.id, name: user.name, email: user.email },
            refreshTokenSecret
          );
  
          res.json({ refreshToken });
        }
      } catch (err) {
        console.error(err);
        res.send("Identity or password incorrect");
      }
    });
  
    // ## Sign Out Router
  
    // Sign Out Request & Response
    logout.post("/signout", (req, res) => {
      const { token } = req.body;
  
      refreshTokens = refreshTokens.filter(
        (refreshToken) => refreshToken !== token
      );
  
      res.send("Logout successful");
    });
  
    login.post("/signup", users.create);
  
    // ## Router Assign
  
    app.post("/token", (req, res) => {
      const { token } = req.body;
  
      if (!token) {
        return res.sendStatus(401);
      }
  
      if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
      }
  
      jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
  
        const accessToken = jwt.sign(
          { username: user.username, role: user.role },
          accessTokenSecret,
          { expiresIn: "20m" }
        );
  
        res.json({
          accessToken,
        });
      });
    });
  
    app.use("/", login);
    app.use("/", logout);
    app.use("/api/users", user);
  };
  