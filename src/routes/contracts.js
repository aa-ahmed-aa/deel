const express = require('express');
const router = express.Router();
const {getProfile} = require('../middleware/getProfile');
const { Op } = require('sequelize');

router.use(getProfile);

/**
 * @returns contract by id
 */
router.get('/contracts/:id', async (req, res) =>{
    const {Contract} = req.app.get('models');
    var ClientId = req.get('profile_id');

    const {id} = req.params;
    const contract = await Contract.findOne({where: {id, ClientId}});

    if(!contract)
        return res.status(404).send(`Can't find this contract`).end()

    return res.json(contract)
});

/**
 * @returns contracts of current
 */
router.get('/contracts', async (req, res) =>{
    const {Contract} = req.app.get('models');
    var ClientId = req.get('profile_id');

    const contracts = await Contract.findAll(
        {
            where:
                {
                    ClientId,
                    status:
                        {
                            [Op.ne]: 'terminated'
                        }
                }
        }
        );

    return res.json(contracts)
});

module.exports = router;
