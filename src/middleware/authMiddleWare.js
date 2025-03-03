import jwt from 'jsonwebtoken'
const authMiddleWare = ((req, res, next) => {
    const token = req.headers["authorization"];
    console.log("Token: ",token)
    const bearer = token.split(" ")[1]
    console.log(token)
    if(!token){
        return res.status(401).json({message: "Unauthorized"})
    }
    try{

      jwt.verify(bearer, process.env.JWT_SECRET_KEY,(err, decoded) => {
        if(err){
          return res.status(402).json({message: "Invalid token"})
        }
        req.userId = decoded.id
        next()
      })
    }
    catch(err){
        return res.status(403).json({message: "token expired"})
    }
    
})
export default authMiddleWare
