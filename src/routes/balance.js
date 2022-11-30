const express = require('express');
const router = express.Router();
const getProfileJobs = require('../services/jobsService');
const {Profile, sequelize} = require("../model");

/**
 * @returns get paid jobs by id
 */
router.post('/balances/deposit/:userId', async (req, res) => {
    const { userId } = req.params;
    const { amount } = req.body;

    if(amount <= 0) {
        return res.json("Please enter a valid amount !!");
    }

    const jobs = await getProfileJobs(userId);
    const totalAmount = jobs.reduce((acc, job) => acc + job.price, 0);

    if (amount > 0.25 * totalAmount) {
        return res.json("Can't deposite this amount it is more than 25 % of your jobs")
    }

    const transaction = await sequelize.transaction();

    try{

        const profile = await Profile.findOne({ id: userId }, {transaction});
        await profile.update({balance: profile.balance + amount}, {transaction});

    } catch(e){

        await transaction.rollback();
        return res.status(400).json(e.message);

    }


    return res.json("Deposited success thanks");
});


module.exports = router;
