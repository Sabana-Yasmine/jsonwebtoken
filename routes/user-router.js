const router = require('express').Router();
const userSchema = require('../models/user-models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verify");
 

router.post('/Register', async(req,res) =>{
    console.log("posting data");
    try{
        let username = req.body.username
        let phone = req.body.phone
        let email = req.body.email
        let password = req.body.password
        let role = req.body.role

        if(username){
            let namedata=await userSchema.findOne({"username" : username}).exec();
            if(namedata){
                return res.status(400).json({'status':'failed', 'message':'username already exists'})
            }
        }else{
            return res.status(400).json({'status':'failed', 'message':'please enter your name'})
        }

        if(phone){
            let numdata = await userSchema.findOne({"phone":phone}).exec();
            if(numdata){
                return res.status(400).json({'status':'failed', 'message':'phone number already exists'})
            }
        }else{
                return res.status(400).json({'status':'failed', 'message':'please enter your phone number'})
            }
        

        if(email){
            let emaildata = await userSchema.findOne({"email":email}).exec();
            if(emaildata){
                return res.status(400).json({'status':'failed', 'message':'mail id already exists'})
            }
            }else{
                return res.status(400).json({'status':'failed', 'message':'please enter your phone mail id'})
            }
        

        const userDetails = await userSchema(req.body);
            const salt = await bcrypt.genSalt(10);
            userDetails.password = bcrypt.hashSync(password,salt)

            await userDetails.save().then(result =>{
                res.json({status:'success',message:'register successfull',"result":result})
            }).catch(err=>{
                res.json({status:"failure","err":err.message});
            })

    }catch(err){
        console.log(err.message)
        res.json({'err':err.message})
    }
})

router.post('/login', async(req,res)=>{
    console.log("logging in")
    try {
        
        let email = req.body.email
        let password = req.body.password

        await userSchema.findOne({email:email}).then(data=>{
            bcrypt.compare(password, data.password,function(err,result){
                if(err){
                    return res.json({"err":err.message})
                }
                if(result){
                    const token = jwt.sign({data},process.env.JWTKEY,{expiresIn:"1m"});
                    console.log("token", token)
                    return res.json({status:"success",token})
                }else{
                    return res.json({status:"failed",message:"Invalid password"})
                }
            })
        }).catch (err=>{
            return res.json({status:'failure', message:"invalid mail id"})
            
        })
    } catch(err){
        return res.json({"err":err.message})
    }
})

router.get("/tokenverify", async(req,res)=>{
    try{
        let token = req.header("token")
        if(!token){
            return res.json({status:"failure", message:"token not received"})
        }
        const decode = jwt.verify(token,process.env.JWTKEY);
        return res.json({status:"success", "result":decode})
    }catch(err){
        return res.json({"err":err.message})
    }
})

router.get("/getuser",verify,async(req,res)=>{
    try{
        await userSchema.find().then(data=>{
            return res.json({status:"success", "result":data})
        }).catch(err=>{
            return res.json({status:"failure",message:"user not exist"})
        })
    }catch(err){
        return res.json({"err":err.message})
    }
})

module.exports = router;