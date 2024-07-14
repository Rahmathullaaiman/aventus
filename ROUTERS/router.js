const express = require('express')
//_________________________________

//CONTROLLS IMPORTS
const Usercontrolls = require("../CONTROLLERS/usercontroll")
const Chatcontroll = require("../CONTROLLERS/Chatcontroll")
const GroupChatcontroll = require("../CONTROLLERS/GroupChatcontroll")
//______________________________________________________________________


//MIDDLEWARES IMPORT
const Multerlmiddleware = require('../MIDDLEWARES/MulterConfig')
const jwtmiddleware = require('../MIDDLEWARES/JwtConfig')


const router = new express.Router()

//Routes Path

//1)Registration
router.post('/user/reg',Usercontrolls.register)
//2)Verify Otp
router.post('/otp',Usercontrolls.verifyOTP)
//3)Login
router.post('/user/login',Usercontrolls.login)
//4)update user detaails
router.put('/user/update/:id',Usercontrolls.editprofile)

//___________________________________________________________________________________________________________________

//CHAT CONTROLLS
//_______________

//1)Send Message
router.post('/messages/send/:id',jwtmiddleware,Chatcontroll.sendMessage);
//2)Get Message
router.get('/messages/:id',jwtmiddleware,Chatcontroll.getMessages);

//___________________________________________________________________________________________________________________

//GROUP CHAT CONTROLLS
//____________________

//1)Create Group
router.post('/groups/create',jwtmiddleware,GroupChatcontroll.createGroup);
//2)add members
router.post('/addmembers/:groupId', jwtmiddleware,GroupChatcontroll.addMembers );
//3)remove members
router.delete('/removemembers/:groupId', jwtmiddleware,GroupChatcontroll.removeMembers)
//4)Edit group settings
router.put('/editgroup/:groupId',jwtmiddleware,Multerlmiddleware.single('profilePic'),GroupChatcontroll.updateGroupSettings);
//4)Send Group Messages
router.post('/groups/messages/send',jwtmiddleware,GroupChatcontroll.sendMessage);
//5)Get Group messages
router.get('/groups/:groupId/messages', jwtmiddleware,GroupChatcontroll.getMessages);
//6) delete Group
router.delete('/group/:groupId', jwtmiddleware,GroupChatcontroll.deleteGroup);












module.exports=router