const analyzerService = require('../src/services/analyzer.service');

describe('Analyzer Service', () => {
    it('detects Billing category', () => {
        const res = analyzerService.analyze('I have a problem with my invoice and billing');
        expect(res.category).toBe('Billing');
    });

    it('detects Technical category', () => {
        const res = analyzerService.analyze('The app keeps crashing and is very slow');
        expect(res.category).toBe('Technical');
    });

    it('assigns P0 and Security category for security threats', () => {
        const res = analyzerService.analyze('My account was hacked and data is stolen');
        expect(res.category).toBe('Security');
        expect(res.priority).toBe('P0');
    });

    it('assigns P1 for multiple urgency signals', () => {
        const res = analyzerService.analyze('This is urgent and needs to be fixed asap');
        expect(res.priority).toBe('P1');
    });

    it('assigns P2 for single urgency signal', () => {
        const res = analyzerService.analyze('I need this fixed asap');
        expect(res.priority).toBe('P2');
    });

    it('defaults to P3 and Other category', () => {
        const res = analyzerService.analyze('Just saying hello');
        expect(res.category).toBe('Other');
        expect(res.priority).toBe('P3');
    });
});
