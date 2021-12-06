const collegeModel = require("../models/collegeModel")
const internModel = require('../models/internModel')



const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}
  
const ValidURL =  function (str) {
    var regex = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
      alert("Please enter valid URL.");
      return false;
    } else {
      return true;
    }
  }

const createCollege = async function (req, res) {
    try {
        const requestBody = req.body;
        if(!isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide college details'})
            return
        }

        // Extract params
        const {name, fullName,logoLink,isDeleted} = requestBody; // Object destructing

        // Validation starts
        if(!isValid(name)) {
            res.status(400).send({status: false, message: 'name is required'})
            return
        }
        if(!isValid(fullName)) {
            res.status(400).send({status: false, message: 'fullName is required'})
            return
        }
        if(!ValidURL(logoLink)) {
            res.status(400).send({status: false, message: 'logolink is required'})
            return
        }

           
           
        // Validation ends


        const Data = {name, fullName,logoLink,isDeleted}
        let savedData = await collegeModel.create(Data)
        res.status(201).send({ status: true, data: savedData })
    } catch (error) {
        res.status(500).send({ status: false, msg: 'some thing went wrong' })
    }
}
module.exports.createCollege = createCollege;


/*
GET /functionup/collegeDetails
Returns the college details for the requested college (Expect a query parameter by the name collegeName. This is anabbreviated college name. For example iith)
Returns the list of all interns who have applied for internship at this college.
The response structure should look like this



*/



 //Q 3 
 const getAllIntern = async function (req, res) {
    try{
           
          let collegeName= req.query.collegeName;
         
          if(!collegeName){
            res.status(400).send({status:false,msg:'put CollegeName' })
           }

        let collegeDetail = await collegeModel.findOne({name:collegeName})
         
        if(!collegeDetail){
            res.status(400).send({status:false,msg:'college name not present' })
           }


        let internDetail = await internModel.find({collegeId : collegeDetail._id}).select({_id:1,name:1,email:1,mobile:1})
       // console.log( internDetail)
       if(!internDetail){
           return res.status(400).send({status:false,msg:'intern Details not present' })
       }

        let result ={
            name:collegeDetail.name,
            FullName:collegeDetail.fullName,
            LogoLink:collegeDetail.logoLink,
            interests:internDetail
        }
        if(!result){
            res.status(400).send({status:false,msg:'data is not present' })
           }
      //  console.log(result)

        res.status(200).send(result)
}catch(error){
    res.status(500).send({status:false,msg:'some thing went wrong' })
    }
}

module.exports.getAllIntern = getAllIntern;


