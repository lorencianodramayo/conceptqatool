const express = require("express");
const router = express.Router();

const PlaygroundModel = require("../models/PlaygroundModel");
const TemplateModel = require("../models/TemplateModel");

router.post("/newPlayground", (req, res) => {
    const palyground = new PlaygroundModel(req.body);
  
    //saving entries
    palyground.save((error, result) => {
      if (error) {
        return res.status(500).json({ msg: "Sorry, internal server errors" });
      }
  
      return res.json(result);
    });
  });

module.exports = router;