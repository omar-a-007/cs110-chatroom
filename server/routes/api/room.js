const express = require('express')
const router = express.Router()
const { check, validationResult} = require("express-validator")

const room_util = require('../../utilities/room')
const { authenticate } = require('../../utilities/token')


/**
 * @description - List of Rooms
 * @note Sends all of the rooms related data in a response json
 * @route - /api/room/list
 * @method - GET
 */
 router.get('/list', async (req, res, next) => {
    try {
        const room_list = await room_util.detailed_list()
        res.status(200).json(room_list) 
    }
    catch (e) { res.status(203).json({ error: err }) }
})

/**
 * @description - Join a Room
 * @route - /api/room/join
 * @method - POST
 * ! DELETE THIS ROUTE. Requires modifiying client (React). Go to /messages/:roomID directly instead of /join
 */
 router.post("/join", authenticate,
    [
        check('roomId', "Please select room").not().isEmpty().escape(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) 
            return res.status(400).json({ errors: errors.array() })

        res.status(200).json(req.body.roomId)
    }
)

/**
 * @description - Retrieve a room's message history (upon joining a room)
 * @route - /api/room/messages/:roomID
 * @method - GET
 * ! Secure route with middleware once finished with class.
 */
 router.get("/messages/:roomID", 
    [
        check('roomId', "Please select room").escape().not().isEmpty(),
    ], 
    async (req, res, next) => {
    try {
        const room_messages = await room_util.messages(req.params.roomID)
        res.json(room_messages)
    }
    catch (error) { res.send([]) }
})


/**
 * ! Deprecated
 * @description - Detail Room
 * @route - /api/room/detail
 * @method - POST
 */
/*
 router.post("/detail", authenticate,
    [
        check('roomId', "Please select room").escape().not().isEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }) }

            const room_details = await room_util.detail(req.body.roomId)
            res.status(200).json(room_details)
        }
        catch (e) { console.log(e); res.status(500).send({ message: "Error in Fetching rooms.." }) }
 });
 */

 
/**
 * @description - Create Room
 * @method - POST
 * @param - /api/room/create
 */
router.post("/create", authenticate,
    [
        check("name", "Please enter minimum 3 characters.").escape().isLength({min: 3})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }) }
        
        try {
            console.log(req.user)
            const data = { name: req.body.name, creator_id: req.user.id }
            const new_room = await room_util.create(data)
            res.status(200).json(new_room)            
        }
        catch (e) { console.log(e); res.status(500).json({ error: e }) }
    }
)


module.exports = router;
