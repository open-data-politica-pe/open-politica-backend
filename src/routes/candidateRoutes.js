const express = require("express");
const mongoose = require("mongoose");

const Candidate = mongoose.model("Candidate");

const router = express.Router();

router.get("/candidates", async (req, res) => {
  const { page = 1, limit = 10, party } = req.query;

  let query = {};
  if (party) {
    query.org_politica_nombre = party;
  }

  const candidates = await Candidate.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const count = await Candidate.countDocuments();

  res.json({
    candidates,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

router.get("/candidates/:id", async (req, res) => {
  const candidate = await Candidate.findOne({ _id: req.params.id });
  res.send(candidate);
});

router.post("/candidates", async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();

    res.send(candidate);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

router.put("/candidates/:id", async (req, res) => {
  const candidate = await Candidate.findOne({ _id: req.params.id });
  Object.assign(candidate, req.body);
  await candidate.save();
  res.send("modified");
});

router.delete("/candidates/:id", async (req, res) => {
  await Candidate.deleteOne({ _id: req.params.id });
  res.send("success");
});

module.exports = router;
