const express = require('express');
const router = express.Router();
const {getProfile} = require('../middleware/getProfile');
const {Op} = require('sequelize');
const {sequelize} = require('../model');
const getProfileJobs = require('../services/jobsService');

router.use(getProfile);

/**
 * @returns get unpaid jobs
 */
router.get('/jobs/unpaid', async (req, res) =>{
    var ClientId = req.get('profile_id');

    const jobs = await getProfileJobs(ClientId, {
        [Op.or]: [
            {paid: false},
            {paid: null},
        ]
    });

    console.log(';;;', jobs);
    if(!jobs)
        return res.status(404).send(`Can't find jobs`).end()

    return res.json(jobs)
});

/**
 * @returns get paid jobs by id
 */
router.post('/jobs/:job_id/pay', async (req, res) => {
    const { Job, Profile } = req.app.get('models');
    const {job_id} = req.params;

    var ClientId = req.get('profile_id');

    const transaction = await sequelize.transaction();

    try {
        const user = await Profile.findOne({id: ClientId}, {transaction})
        const job = await Job.findOne({id: job_id}, {transaction});

        if (user.balance < job.price) {
            throw new Error('Not enough balance');
        }

        const result = await user.update({
            balance: user.balance - job.price
        }, {transaction});

        if(result) {
            await job.update({
                paid: true
            }, {transaction});
        }

        await transaction.commit();
    } catch(e) {
        await transaction.rollback();
        return res.status(400).json(e.message);
    }
    return res.json("Paid Thanks");
});


module.exports = router;
