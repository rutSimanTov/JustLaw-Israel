import { Router } from "express";




import express from 'express';
// import { sendDonationReceipt } from '../controllers/donationController';
import handleSendReceipt from '../routes/receiptRoutes'
import { addDonation, getActiveRecurringDonations } from "../controllers/AllDonationsController";
import { cancelStandingOrder, updateActualTimes, updateStandingOrders } from "../controllers/standing_orderController";
import { deleteDonation, getAllDonations, updateDonation } from "../controllers/donationsController";
import { getDonorByEmail, getDonors, updateDonor, deleteDonorIfNoRelationsByEmail} from "../controllers/donorsController";
const DonationRoute = Router();

//  DonationRoute.post('/receipt', sendDonationReceipt);

DonationRoute.post('/receipt', handleSendReceipt);

//AllDonationsController
DonationRoute.post('/add', addDonation);
DonationRoute.get('/getActiveRecurringDonations', getActiveRecurringDonations);

//StandingOrderController
DonationRoute.put('/updateActualTimes/:standing_order_id',updateActualTimes);
DonationRoute.put('/updateStandingOrders',updateStandingOrders);
DonationRoute.put('/cancelStandingOrder/:donor_email',cancelStandingOrder);


//DonationsController
DonationRoute.get('/getAllDonations', getAllDonations);
DonationRoute.put('/updateDonation/:donation_id', updateDonation); 
DonationRoute.delete('/deleteDonation/:donation_id', deleteDonation);

//DonorsController
DonationRoute.delete('/deleteDonorIfNoRelationsByEmail/:donor_email', deleteDonorIfNoRelationsByEmail);
DonationRoute.get('/getAllDonors', getDonors);
DonationRoute.get('/getDonorByEmail/:donor_email', getDonorByEmail);
DonationRoute.put('/updateDonor/:donor_email', updateDonor);
export default DonationRoute;
