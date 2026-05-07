import express from 'express';
import { createInvestor, getAInvestor, getAllInvestors, invalidToken, investorHoldings, login, logout, totalInvestmentOfUser } from '../controllers/investorController.js';
import { verifyJwt } from '../config/authManager.js';

const investorRoute=express.Router();

const authentication=(req,res,next)=>{
    const token=req.headers.authorization;
    const cleanToken = token.startsWith("Bearer ")? token.split(" ")[1]: token;
       // console.log(cleanToken);
    try{
        if(invalidToken.includes(cleanToken)){
         return res.send("token expired");
         //return null;
        }
        const payload=verifyJwt(cleanToken);
        if (!payload) {
            return res.status(401).json({ message: "Invalid token" });
        }
        if(payload.role=="user"){
            next();
        }
        else{
            return res.json({message:"Invalid access"});
        }
    }catch(err){
        console.log(err);
    }
}
    
investorRoute.post('/',createInvestor);
 investorRoute.get('/',getAllInvestors);
investorRoute.get('/:id',getAInvestor);
investorRoute.get('/:id/holdings',investorHoldings);
investorRoute.get('/:id/net',totalInvestmentOfUser); 

investorRoute.post('/login',login);
investorRoute.post('/logout',logout);
export default investorRoute;