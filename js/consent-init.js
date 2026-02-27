/**
 * Google Consent Mode V2 - Initial State
 * This script must be placed in the <head> before GTM/GA4.
 */

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

// Initialize consent with defaults (denied)
gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'wait_for_update': 500
});

// Load existing consent from localStorage if available
const savedConsent = localStorage.getItem('cookie-consent');
if (savedConsent) {
    try {
        const consent = JSON.parse(savedConsent);
        gtag('consent', 'update', {
            'ad_storage': consent.marketing ? 'granted' : 'denied',
            'ad_user_data': consent.marketing ? 'granted' : 'denied',
            'ad_personalization': consent.marketing ? 'granted' : 'denied',
            'analytics_storage': consent.analytics ? 'granted' : 'denied'
        });
    } catch (e) {
        console.error('Error loading saved consent:', e);
    }
}
