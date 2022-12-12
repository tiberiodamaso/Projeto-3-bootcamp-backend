import express from "express";
import isAuth from "../middlewares/isAuth.js";
import LogModel from "../model/log.model.js";

const logRoute = express.Router();

logRoute.get("/all-logs", isAuth, async (req, res) => {
    try {
      const logs = await LogModel.find().populate("user");

      return res.status(200).json(logs);
    } catch (error) {
      console.log(error);
      return res.status(400).json(error);
    }
});

export default logRoute;