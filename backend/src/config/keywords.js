/**
 * Keyword classifications for ticket categorization and urgency detection.
 */
module.exports = {
    categories: {
        'Billing': ['bill', 'invoice', 'charge', 'payment', 'refund', 'credit card', 'price', 'pricing'],
        'Technical': ['bug', 'error', 'crash', 'not working', 'load', 'slow', 'timeout', 'broken'],
        'Account': ['login', 'password', 'email', 'profile', 'reset', 'auth', 'access'],
        'Feature Request': ['add', 'feature', 'request', 'idea', 'would be nice', 'integration', 'support for']
    },

    urgency: ['urgent', 'asap', 'down', 'immediately', 'critical', 'emergency', 'blocker'],

    security: ['hacked', 'breach', 'stolen', 'leak', 'unauthorized', 'vulnerability', 'exploit']
};
