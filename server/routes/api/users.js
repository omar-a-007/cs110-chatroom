const express = require('express');
const { createToken, authenticate } = require('../../utilities/token')
const { check, validationResult } = require("express-validator");
const router = express.Router();

// User Functions (Login, Register, Etc)
const Account = require("../../utilities/users")

/**
 * @route - /api/update
 * @method - POST
 * @description - Update User Profile
 */
 router.post("/update", authenticate,
    // Validate and Sanitize
    [
      check('full_name', "Please enter a display name ( 3 to 20 characters long)").isLength({ min: 3, max: 20 }).escape()
    ],
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty())
                return res.status(400).json({ errors: errors.array() })
            
            console.log('Updating Account')
            // send -> req.header("token")
            Account.update(req.user.id, {full_name: req.body.full_name}) //req.user.id is in the JWT
                .then((user) => {console.log(' Success: Account Updated');  res.status(200).json(user)})
                .catch((err) => {console.log(' Fail: Account not Updated'); res.status(500).json({ error: err })})
        }
        catch (e) {res.status(500).send({ message: "Error fetching user" })}   
    }
)

/**
 * @route - api/user/me
 * @method - GET
 * @description - (Logged in) User Profile
 */
 router.get("/me", authenticate, 
    [
        check('user.id', "Invalid UserID").isLength({ min: 3, max: 20 }).escape()
    ],
    async (req, res) => {
    try {
      Account.getUser(req.user.id)
	 	.then( (user) => {console.log('getUser Suucess'); res.status(200).json( user )} )
        .catch( (err) => {console.log('getUser Fail');    res.status(500).json({ error: err })} )
    }
    catch (e) { res.status(500).send({ message: "Error fetching user" })}
});

/**
 * @route - /api/login
 * @method - POST
 * @description - User Login
 */
 router.post("/login",
     // Validate and Sanitize
    [
      check("email", "Please enter a valid email").isEmail().escape(),
      check("password", "Please enter a valid password").isLength({ min: 6 }).escape()
    ],
    async (req, res, next) => {
    try{
    	const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(400).json({ errors: errors.array() })

    	const data = {
            email: req.body.email,
            password: req.body.password
    	}

    	Account.login(data)
        .then((user) => {
            createToken( { id: user._id })
            .then ( token => res.status(200).json({token, userId: user.id}))
            .catch(e => {res.status(400).json("error"); console.log(e)})
        })
        .catch((err)=>{
            throw ( {'code': 500, 'msg': err} ) } )
    } catch (e) {
        console.log(e)
        if (e.code)
            res.status(e.code)
        res.json({ error: e });
    }
    }
)



/**
 * @route - /api/register
 * @method - POST
 * @description - Register New Account
 */
 router.post("/register",
     // Validate and Sanitize
    [
        check('username', "Please enter a valid username").not().isEmpty().escape(),
        check('full_name', "Please enter a valid display name").not().isEmpty().escape(),
        check("email", "Please enter a valid email").isEmail().escape(),
        check("password", "Please enter a valid password").isLength({ min: 6 }).escape()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(203).json({errors: errors.array()});
            
        const data = {
            username: req.body.username,
            full_name: req.body.full_name,
            email: req.body.email,
            password: req.body.password
        }


        try {
            Account.create(data)
            .then((user) => {
                createToken( { userId: user._id })
                .then ( token => res.status(200).json({token, userId: user.id}))
                .catch(e => {res.status(400).json("error"); console.log(e)})
            })
            .catch((err)=>{
                throw ( {'code': 500, 'msg': err} ) } )
        }
        catch (e) {
            res.status(203).json({ error: e })
           
        }

    }
)

module.exports = router;