const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./routes/ticket.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/tickets', ticketRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is operational' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});
