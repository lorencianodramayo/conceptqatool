const express = require("express");
const router = express.Router();

const PlaygroundModel = require("../models/PlaygroundModel");
const TemplateModel = require("../models/TemplateModel");

router.get("/", (req, res) => {
  PlaygroundModel.findById(req.query.id, (err, success) => {
    return (err) ?
        res.status(500).json({msg: "Sorry, Internal server error"}) : res.json(success)
  }).sort([['_id', 1]])
})

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

router.get("/getTemplate", (req, res) => {
  TemplateModel.findById(req.query.id, (err, success) => {
    return (err) ?
        res.status(500).json({msg: "Sorry, Internal server error"}) : res.json(success)
  })
});

module.exports = router;