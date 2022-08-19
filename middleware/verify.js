const jwt = require("jsonwebtoken")
function verify(req,res,){
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
}
module.exports = verify