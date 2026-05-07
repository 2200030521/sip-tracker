import express from 'express';
import { createSip, oneSipDetails, processSip, sipTransactions } from '../controllers/sipController.js';

const sipRoute=express.Router();

sipRoute.post('/',createSip);
sipRoute.get('/:sid',oneSipDetails);
sipRoute.post('/:sid/process',processSip);
sipRoute.get('/:sid/transactions',sipTransactions);

export default sipRoute;