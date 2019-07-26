const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Database
const db = require('../models');

//------------------- POST Signup Route ---------------------
router.post('/signup', async (req, res) => {
    const errors = [];
    console.log(req.body)

    // Validate Form Data
    if (!req.body.fullName){
        errors.push({message: 'Please enter your Full Name'});
    }

    if (!req.body.email){
        errors.push({message: 'Please enter your email'});
    }

    if (!req.body.gender){
        errors.push({message: 'Please enter your gender'});
    }

    if (!req.body.password){
        errors.push({message: 'Please enter your password'});
    }

    if (req.body.password !== req.body.password2){
        errors.push({message: 'Your passwords do not match!'});
    }

    // Query database to see if email account already exists.
    // If return res with errors
    // Find one User by email
    try {
        const foundUser = await db.User.findOne({email: req.body.email});
        if (foundUser){
            errors.push({message: 'Account already exists'});
        }
    } catch(err) {
        if (err) return res.json({user: req.body, errors: [{message: 'Something went wrong!!! Please try again'}]});
    }
    
    // If there are any validation errors, Re-json signup page with error messages
    if (errors.length){
        return res.json({user: req.body, errors: errors});
    }
    console.log('errors = ', errors)

    // Generate salt for additional password hash complexity
    bcrypt.genSalt(10, (err, salt)=> {
        if (err) return res.json({user: req.body, errors: [{message: 'Something went wrong!!! Please try again'}]});

    console.log('Creating User')
    // Hash user password from signup form
    bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) return res.json({user: req.body, errors: [{message: 'Something went wrong!!! Please try again'}]});

        // Create an object to hold the new user information (with hashed password, not original password)
        const userData = {
            fullName: req.body.fullName,
            email: req.body.email,
            gender: req.body.gender,
            password: hash,
        }

        // Create a new User record in MongoDB from the newUser object above
        db.User.create(userData, (err, newUser) => {
            if (err) return res.json({ errors: [err]});
            
            // If new user was created successfully, redirect user to login page
            // We could also create the session here (just like the login route), then redirect to the dashboard instead
            // res.redirect('/login');

            res.json({status: 200, message: 'Success', newUser})
        });
    });
    });
});

//------------------ POST Login Route ---------------------
router.post('/login', (req, res) => {

    // First make sure the user didn't submit an empty form
    if (!req.body.email || !req.body.password){
        return res.json({user: req.body, errors: [{message: 'Please enter your email and password'}]});
    }

    // FIND one User by email
    db.User.findOne({email: req.body.email}, (err, foundUser) => {
        if (err) return res.json({user: req.body, errors: [{message: 'Something went wrong!!! Please try again'}]});

        // If we didn't find a user, re-json the login page with error message
        if (!foundUser){
            return res.json({user: req.body, errors: [{message: 'email or password is incorrect'}]});
        }

        // If this line of code runs, it means we found the user
        // Compare the password submitted by user login form with password from found user
        bcrypt.compare(req.body.password, foundUser.password, (err, isMatch) => {
            if (err) return res.json({user: req.body, errors: [{message: 'Something went wrong!!! Please try again'}]});

            // If the passwords match, create a new session with loggedIn and currentUser properties (or any properties you want except the user password)
            if (isMatch){
                req.session.loggedIn = true;
                req.session.currentUser = {
                    id: foundUser._id,
                    fullName: foundUser.fullName,
                    email: foundUser.email,
                }

                // Redirect user to the dasboard
                return res.json({message: 'Logged in successfully', session: req.session});
                
                // return res.json({status: 200, message: 'Success})

            } else {
                
                // If the passwords do not match, re-json the login page with error message
                return res.json({user: req.body, errors: [{message: 'email or password is incorrect'}]});
            }
        });
    });  
});

//------------------ POST Logout Route ---------------------
router.post('/logout', (req, res) => {
    const genericError = 'Something went wrong!!! Please try again';

    // Delete the user's session
    req.session.destroy(err => {
        if (err) return res.json({error: err, message: genericError});
    });
    res.status(200).clearCookie('connect.sid', {
        path: '/',
    }).json({loggedOut: true});
});

module.exports = router;
