const router = require("express").Router();
const User = require("../models/User.model");

const { isLoggedIn } = require("../middlewares/auth.middlewares.js");

// GET perfil
router.get("/", isLoggedIn, (req, res, next) => {
  User.findById(req.session.activeUser._id)
    .then((response) => {
      res.render("profile/my-profile.hbs", {
        userDetails: response,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
