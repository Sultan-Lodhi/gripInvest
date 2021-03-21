const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/get',controller.checkWalletBalance);
router.get('/ledger',controller.getLedger);
router.post('/post',controller.addAmountToWallet);
router.put('/put',controller.withdrawAmount);
router.post('/invest',controller.investAmount);
router.post('/returns',controller.sendReturnsToWallet);
module.exports = router;