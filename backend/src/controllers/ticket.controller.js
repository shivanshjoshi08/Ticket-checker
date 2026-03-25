const analyzerService = require('../services/analyzer.service');
const db = require('../db/database');

exports.analyzeTicket = (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Invalid input message.' });
    }

    try {
        const analysis = analyzerService.analyze(message);

        const stmt = db.prepare(`INSERT INTO tickets (message, category, priority, urgency_signals, confidence) VALUES (?, ?, ?, ?, ?)`);
        const urgencySignalsStr = JSON.stringify(analysis.urgencySignals);

        stmt.run([message, analysis.category, analysis.priority, urgencySignalsStr, analysis.confidence], function (err) {
            if (err) {
                console.error("Database persistence error:", err);
                return res.status(500).json({ error: 'Failed to persist ticket data.' });
            }

            res.status(201).json({
                id: this.lastID,
                message,
                ...analysis,
                created_at: new Date().toISOString()
            });
        });

        stmt.finalize();
    } catch (error) {
        console.error("Analysis execution error:", error);
        res.status(500).json({ error: 'Failed to complete ticket analysis.' });
    }
};

exports.getTickets = (req, res) => {
    db.all(`SELECT * FROM tickets ORDER BY created_at DESC LIMIT 50`, [], (err, rows) => {
        if (err) {
            console.error("Database fetch error:", err);
            return res.status(500).json({ error: 'Failed to fetch tickets.' });
        }

        const mappedRows = rows.map(r => ({
            ...r,
            urgency_signals: JSON.parse(r.urgency_signals || '[]')
        }));

        res.status(200).json(mappedRows);
    });
};
