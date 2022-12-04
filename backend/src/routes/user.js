import express from "express";
import Joi from "joi";
import User from "../models/user.js";
import { signUp } from "../validations/user.js";

const userRoutes = express.Router();

userRoutes.post("", async (req, res) => {

  try {
    const { username, email, password } = req.body;

    await signUp.validateAsync({username, email, password});

    const newUser = new User({ username, email, password });

    await newUser.save();

    res.send({ userId: newUser.id, username });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default userRoutes;
