const {Op} = require('sequelize');
const { Job, Contract } = require('../model');

async function getProfileJobs(clientId, condition = {}) {
    return await Job.findAll({
        where: condition,
        include: {
            model: Contract,
            as: 'Contract',
            where: {
                ClientId: { [Op.eq]: clientId }
            }
        }
    });
}

module.exports = getProfileJobs;
