const keywords = require('../config/keywords');

/**
 * Service responsible for categorizing and prioritizing incoming support tickets.
 */
class AnalyzerService {
    /**
     * Analyzes standard text to determine associated category, priority, and metadata.
     * @param {string} message - Raw ticket text.
     * @returns {Object} Structured analysis result.
     */
    analyze(message) {
        const text = message.toLowerCase();

        let category = 'Other';
        let maxCategoryMatches = 0;

        for (const [cat, words] of Object.entries(keywords.categories)) {
            const matchCount = words.filter(word => text.includes(word)).length;
            if (matchCount > maxCategoryMatches) {
                maxCategoryMatches = matchCount;
                category = cat;
            }
        }

        const urgencyMatches = keywords.urgency.filter(word => text.includes(word));
        const securityMatches = keywords.security.filter(word => text.includes(word));

        let priority = 'P3';

        if (securityMatches.length > 0) {
            priority = 'P0';
            category = 'Security';
        } else if (urgencyMatches.length > 1) {
            priority = 'P1';
        } else if (urgencyMatches.length === 1) {
            priority = 'P2';
        }

        const totalMatches = maxCategoryMatches + urgencyMatches.length + securityMatches.length;

        let confidence = 50 + (totalMatches * 10);
        if (confidence > 95) confidence = 95;
        if (totalMatches === 0) confidence = 40;

        return {
            category,
            priority,
            urgencySignals: [...urgencyMatches, ...securityMatches],
            confidence: confidence / 100
        };
    }
}

module.exports = new AnalyzerService();
