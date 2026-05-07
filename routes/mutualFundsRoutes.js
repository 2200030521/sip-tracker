import express from 'express';
import { createFund, getFunds, updateFundNAV } from '../controllers/fundController.js';

const mutualRoute=express.Router();

mutualRoute.post('/',createFund);
mutualRoute.get('/',getFunds);
mutualRoute.put('/:fundId/nav',updateFundNAV);

export default mutualRoute