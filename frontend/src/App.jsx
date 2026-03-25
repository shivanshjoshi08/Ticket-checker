import { useState, useEffect } from 'react';
import { Send, Activity, ShieldAlert, Clock, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');

    const fetchHistory = async () => {
        try {
            const res = await fetch(`${API_URL}/tickets`);
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (err) {
            console.error('Failed to fetch ticket history:', err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/tickets/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (!res.ok) throw new Error("Service unavailable.");

            const data = await res.json();
            setResult(data);
            setMessage('');
            fetchHistory();
        } catch (err) {
            setError("Unable to connect to the backend service. Ensure the server is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSecurityAlert = result?.category === 'Security';

    return (
        <div className="app-container">
            <header className="header">
                <h1>Support Ticket Triage</h1>
                <p>Submit support tickets for automated routing and priority assignment.</p>
            </header>

            <main className="main-grid">
                <section className="glass-panel" style={{ padding: '24px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={20} color="var(--primary-accent)" />
                        Submit a Ticket
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <textarea
                                className="ticket-textarea"
                                placeholder="Enter support ticket details..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

                        <button type="submit" className="btn-primary" disabled={isSubmitting || !message.trim()}>
                            {isSubmitting ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="spinner"></div>
                                    <span>Analyzing ticket...</span>
                                </div>
                            ) : 'Analyze Ticket'}
                        </button>
                    </form>
                </section>

                <section className={`glass-panel result-card ${isSecurityAlert ? 'security-alert' : ''}`}>
                    {result ? (
                        <>
                            <h2>
                                <Activity size={24} color={isSecurityAlert ? "var(--danger)" : "var(--primary-accent)"} />
                                Analysis Results
                            </h2>

                            <div className="metric-grid">
                                <div className={`metric-box ${isSecurityAlert ? 'security-alert' : ''}`}>
                                    <div className="metric-label">Priority Level</div>
                                    <div className={`badge ${result.priority.toLowerCase()}`}>
                                        {result.priority}
                                    </div>
                                </div>

                                <div className="metric-box">
                                    <div className="metric-label">Category</div>
                                    <div className="metric-value" style={{ color: isSecurityAlert ? 'var(--danger)' : 'var(--text-primary)' }}>
                                        {isSecurityAlert && <ShieldAlert size={16} style={{ display: 'inline', marginRight: '6px' }} />}
                                        {result.category}
                                    </div>
                                </div>

                                <div className="metric-box">
                                    <div className="metric-label">Confidence</div>
                                    <div className="metric-value">{Math.round(result.confidence * 100)}%</div>
                                </div>

                                <div className="metric-box">
                                    <div className="metric-label">Urgency Signals</div>
                                    <div className="metric-value">{result.urgencySignals?.length || 0}</div>
                                </div>
                            </div>

                            {result.urgencySignals && result.urgencySignals.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                    <div className="metric-label">Flagged Keywords:</div>
                                    <div className="keyword-chips">
                                        {result.urgencySignals.map((sig, i) => (
                                            <span key={i} className="chip alert">{sig}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', minHeight: '250px' }}>
                            <CheckCircle size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                            <p>Submit a ticket to view triage analysis.</p>
                        </div>
                    )}
                </section>
            </main>

            {history.length > 0 && (
                <section className="glass-panel history-section">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem' }}>
                        <Clock size={20} />
                        Recent Tickets
                    </h2>

                    <div className="history-list">
                        {history.map(item => (
                            <div key={item.id} className="history-item">
                                <div className={`badge ${item.priority.toLowerCase()}`} style={{ width: '40px', textAlign: 'center' }}>
                                    {item.priority}
                                </div>
                                <div className="history-item-message" title={item.message}>
                                    "{item.message}"
                                </div>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {item.category} • {Math.round(item.confidence * 100)}%
                                    </span>
                                    {item.category === 'Security' && <ShieldAlert size={16} color="var(--danger)" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

export default App
