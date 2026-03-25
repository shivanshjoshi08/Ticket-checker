const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');

router.post('/analyze', ticketController.analyzeTicket);
router.get('/', ticketController.getTickets);

module.exports = router;
