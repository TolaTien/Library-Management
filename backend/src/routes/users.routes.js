const express = require('express');
const router = express.Router();
const ControllerUser = require('../controllers/users.controller');

const { authUser, check } = require('../auth/checkAuth');

router.post('/register', check(ControllerUser.registerUser));
router.post('/login', check(ControllerUser.login));
router.get('/auth', authUser, check(ControllerUser.authUser));
router.get('/refresh-token', check(ControllerUser.refreshToken));
router.get('/logout', authUser, check(ControllerUser.logout));

router.post('/update-user', authUser, check(ControllerUser.updateInfoUser))
router.get('/get-users', check(ControllerUser.getUsers));
router.post('/update-user-admin', check(ControllerUser.updateUser));
router.post('/delete-user', check(ControllerUser.deleteUser));

router.post('/request-id-student', authUser, check(ControllerUser.requestIdStudent));
router.post('/confirm-id-student', check(ControllerUser.confirmIdStudent));
router.get('/get-request-list', check(ControllerUser.getListRequest));
router.get('/get-statistics', check(ControllerUser.getStatistics));
router.post('/cancel-request-id', check(ControllerUser.cancelRequestIdStudent));

router.post('/get-fine', authUser, check(ControllerUser.calculateFine))
router.put('/return-book', authUser, check(ControllerUser.returnBoook));

router.get('/get-reminders', authUser, check(ControllerUser.sendReminder))
module.exports = router;
 