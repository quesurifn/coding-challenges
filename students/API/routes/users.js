const express = require('express');
const router = express.Router();

//const Users  = require('../models/Users');
const DatabaseDriver = require('../models/DatabaseDriver');
const db = new DatabaseDriver();

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let users = null;
  try {
    //users = await Users.find({}).lean().exec();
    users = await db.find({});
  } catch(err) {
    console.error(err)
    next(err);
  }

  res.json(users);
});

router.post('/', async (req, res, next) => {
  let users = null;
  try {
    //user = await Users.create(req.body)
    users = await db.add(req.body);
  } catch(err) {
    console.error(err)
    next(err);
  } 

  res.json(users);
})

/*
router.put('/', async (req, res, next) => {
  let user = null;
  const id = req.body._id
  delete req.body._id
  try {
    user = await Users.findByIdAndUpdate(id, req.body, {new: true})
  } catch(err) {
    next(err)
  }
  res.json(user)
})*/


router.delete('/', async (req, res, next) => {
  let users = null;
  try {
    await db.delete(req.body);
    users = await db.find({});
  } catch(err) {
    console.error(err);
    next(err);
  }
  res.json(users);
})


module.exports = router;
