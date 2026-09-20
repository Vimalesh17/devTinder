export const adminAuth= (req,res,next)=>{
    console.log("admin auth checking....")
   const token ='admin1234';
   const isAuthorized = token === 'admin1234';
   if(!isAuthorized){
       return res.sendStatus(401)
   }else{
       next()
   }
}

export const userAuth= (req,res,next)=>{
    console.log("user auth checking....")
   const token ='user1234';
   const isAuthorized = token === 'user1234';
   if(!isAuthorized){
       return res.sendStatus(401)
   }else{
       next()
   }
}