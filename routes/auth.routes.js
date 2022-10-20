const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

//rutas signup y login

//GET registro
router.get("/signup", async (req, res, next) => {
  res.render("auth/signup.hbs");
});
//POST información formulario
router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  // BONO VALIDACIÓN

  if (username === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Los campos no pueden estar vacios",
    });
    return;
  }

  //BONO VALIDACIÓN

  try {
    const foundUsuario = await User.findOne({ username: username });
    if (foundUsuario !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "El nombre de usuario no se puede repetir",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // PERFIL

    const nuevoUsuario = {
      username: username,
      password: hashPassword,
    };

    await User.create(nuevoUsuario);

    res.redirect("/auth/login");
  } catch (error) {
    next(error);
  }
});

//GET
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// POST login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Los campos no pueden estar vacios",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ username: username });

    if (foundUser === null) {
      // BONUS INICIO
      res.render("auth/login.hbs", {
        errorMessage: "Usuario o contraseña incorrecta",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    console.log("isPasswordValid", isPasswordValid);
    if (isPasswordValid === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Usuario o contraseña incorrecta",
      });
      return;
    }

    req.session.activeUser = foundUser;
    req.session.save(() => {
      res.redirect("/profile");
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
