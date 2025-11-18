const express = require('express');
const router = express.Router();
const { authUser, check } = require('../auth/checkAuth');

const ControllerHistoryBook = require('../controllers/historyBook.controller')

router.post('/create', authUser, check(ControllerHistoryBook.createHistoryBook));
router.get('/get-history-user', authUser, check(ControllerHistoryBook.getHistoryUser));
router.post('/cancel-book', authUser, check(ControllerHistoryBook.cancelBook));
router.get('/get-all-history-book', check(ControllerHistoryBook.getAllHistoryBook));
router.post('/update-status-book', check(ControllerHistoryBook.updateStatusBook));

module.exports = router
