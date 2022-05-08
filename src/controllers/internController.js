const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId
const internModel = require('../models/internModel');
const collegeModel = require('../models/collegeModel')

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 




const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.length === 0) return false
    return true
 }

 const isValid2 = function(value) {
    const dv = /[a-zA-Z]/;
    if(typeof value !== 'string') return false
    if(dv.test(value)=== false) return false
    return true
 }

 const isValidRequestBody = function(requestBody) {
     return Object.keys(requestBody).length > 0
 }

 const isValidEmail = function(email) {
     return re.test(email) 
    // validator.isEmail(email);
 }

 const isValidMobleNumber = function(mobileNumber) {
    return /^([+]\d{2}[ ])?\d{10}$/.test(mobileNumber)
 }

 const isValidObjectId = function(objectId) {
     return mongoose.Types.ObjectId.isValid(objectId)
 }

 const registerIntern = async function (req, res) {

    try {
        const requestBody = req.body
     
     if(!isValidRequestBody(requestBody)) {
         res.status(400).send({status: false , Message: 'Invalid request parameters. Please provide intern details'})
         return
     }

     const {name, email, mobile, collegeName , isDeleted} = requestBody

     if(!isValid(name)) {
        res.status(400).send({status: false, message: 'Student name is required'})
        return
    }

    if(!isValid2(name)) {
        res.status(400).send({status: false, message: 'Student name is invalid Name'})
        return
    }

    if(!isValid(email)) {
        res.status(400).send({status: false, message: `Valid Email is required`})
        return
    }

    if(!isValidEmail(email.toLowerCase().trim())) {
        res.status(400).send({status: false, message: `${email} is not a valid email address`})
        return
    }

    if(!isValidMobleNumber( mobile.trim() )) {
        res.status(400).send({status: false, message: `${mobile} is not a valid number`})
        return
    }

    //

    if(!isValid(collegeName)) {
        res.status(400).send({status: false, message: 'College Name is required'})
        return
    }

    if(!isValid2(collegeName)) {
       res.status(400).send({status: false, message: 'College Name is not a valid name'})
       return
   }

   if(collegeName !== collegeName.toLowerCase()){
       res.status(400).send({status: false, message: 'College Name should be in lowerCase only'})
       return
   }

   if (collegeName.split(' ').length > 1) {
       res.status(400).send({status: false, message: 'Please provide the valid Abbreviation'})
       return
   }


    const college = await collegeModel.findOne({name: collegeName});

    if(!college) {
        res.status(404).send( { status: false , message: 'college does not exist'})
        return
    }
    
 
    const duplicateEntries = await internModel.find();
   
    if ( duplicateEntries !== undefined &&  duplicateEntries.length >  0 ) {

                
        // Checking Duplicate Email
        const isEmailUsed = await internModel.findOne({ email: email });
        if (isEmailUsed !== null) {
            console.log(isEmailUsed);
            return res.status(400).send({ status: false, msg: "Email already exists" });
        }
        
        // Checking Duplicate Mobile    
        const duplicateMobile = await internModel.findOne({ mobile: mobile })
        if (duplicateMobile) {
            return res.status(400).send({ status: false, msg: "Mobile Number already exists" });
        }
    }

    // isDeleted Should be False       
    if (isDeleted === true) {
        return res.status(400).send({ status: false, msg: "New entries can't be deleted" });
    }

    
    const internData = {name, email, mobile, collegeName}

    const newIntern = await internModel.create(internData);
     res.status(201).send({status: true, message: 'InternDetail is created Successfully', data: newIntern })

        
    } catch (err) {
        res.status(500).send({status: false , error: err.message})
    }
     
 }

module.exports.registerIntern =  registerIntern 