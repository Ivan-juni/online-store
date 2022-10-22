const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Cart = require("../models/cart");
const { validationResult } = require("express-validator");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class AuthController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest("Registration error: ", errors));
      }

      const { email, password, role } = req.body;
      if (!email || !password) {
        return next(ApiError.badRequest("Incorect email or password"));
      }
      const candidate = await User.findOne({
        email,
      });
      if (candidate) {
        return next(ApiError.badRequest("User with this email already exists"));
      }
      // Hash password
      const hashPassword = await bcrypt.hash(password, 5);

      const user = await User.create({
        email,
        role,
        password: hashPassword,
      });
      const cart = await Cart.create({
        userId: user._id,
        gameId: [],
      });
      const token = generateJwt(user._id, user.email, user.role);
      return res.json({ token });
    } catch (e) {
      console.log(e);
    }
  }
  async login(req, res, next) {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return next(ApiError.internal("User isn't exist"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Incorrect password"));
    }

    const token = generateJwt(user._id, user.email, user.role);
    return res.json({ token });
  }
  async check(req, res) {
    const token = generateJwt(req.user._id, req.user.email, req.user.role);
    res.json({ token });
  }
}

module.exports = new AuthController();
