const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/', (req, res) => {
    db.User.find({}, (err, allUser) => {
        if (err) return res.status(500).json({status: 500, error: 'Something went wrong!!! Please try again'});
        res.json({status: 200, message: 'Success', data: allUser});
    })
});

router.get('/:id', (req, res) => {
    db.User.findById(req.params.id, (err, foundUser) => {
        if (err) return res.status(500).json({status: 500, error: 'Something went wrong!!! Please try again'});
        res.json({status: 200, message: 'Success', data: foundUser});
    });
});

router.post('/', (req, res) => {
    db.User.create(req.body, (err, newUser) => {
        if (err) return res.status(500).json({status: 500, error: 'Something went wrong!!! Please try again'});
        res.json({status: 200, message: 'Success', data: newUser});
    });
});

router.put('/:id', (req, res) => {
    db.User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedUser) => {
        if (err) return res.status(500).json({status:500, error: 'Something went wrong!!! Please try again'});
        res.json({status: 200, message: 'Success', data: updatedUser});
    });
});

router.delete('/:id', (req, res) => {
    db.User.findByIdAndRemove(req.params.id, (err, deletedUser) => {
        if (err) return res.status(500).json({status: 500, error: 'Something went wrong!!! Please try again'});
        res.json({status: 200, message: 'Success', data: deletedUser});
    });
});


module.exports = router;