/**
 * Cookie Consent Banner - UI Logic
 * Handles user interaction and Consent Mode V2 updates.
 */

document.addEventListener('DOMContentLoaded', () => {
    const banner = document.createElement('div');
    banner.className = 'cookie-consent-banner';
    banner.id = 'cookieBanner';

    banner.innerHTML = `
        <div class="cookie-header">
            <i class="fa-solid fa-cookie-bite"></i>
            <h3>Nastavení soukromí</h3>
        </div>
        <div class="cookie-content">
            <p>Abychom vám mohli vylepšit zážitek z našeho webu a pochopili, co vás v Rychlebách nejvíc zajímá, potřebujeme váš souhlas s cookies.</p>
            
            <div class="cookie-settings" id="cookieSettings">
                <div class="settings-item">
                    <div class="settings-info">
                        <h4>Nezbytné</h4>
                        <p>Nutné pro správný chod webu. Nelze vypnout.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" checked disabled>
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="settings-item">
                    <div class="settings-info">
                        <h4>Analytické</h4>
                        <p>Pomáhají nám pochopit, kolik lidí náš web navštěvuje a jak ho používají.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="analyticsConsent">
                        <span class="slider"></span>
                    </label>
                </div>
                
                <div class="settings-item">
                    <div class="settings-info">
                        <h4>Marketingové</h4>
                        <p>Zobrazují relevantnější reklamy na sociálních sítích a jiných webech.</p>
                    </div>
                    <label class="switch">
                        <input type="checkbox" id="marketingConsent">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        </div>
        <div class="cookie-actions">
            <button class="cookie-btn btn-accept" id="acceptAll">Přijmout vše</button>
            <button class="cookie-btn btn-reject" id="rejectAll">Odmítnout vše</button>
            <button class="cookie-btn btn-settings" id="toggleSettings">Podrobné nastavení</button>
            <button class="cookie-btn btn-accept" id="saveSettings" style="display: none;">Uložit výběr</button>
        </div>
    `;

    // Create the floating settings trigger (the "cookie circle")
    const trigger = document.createElement('div');
    trigger.className = 'cookie-settings-trigger';
    trigger.id = 'cookieTrigger';
    trigger.innerHTML = '<i class="fa-solid fa-cookie-bite"></i>';
    trigger.setAttribute('aria-label', 'Upravit nastavení cookies');

    document.body.appendChild(banner);
    document.body.appendChild(trigger);

    const btnAcceptAll = document.getElementById('acceptAll');
    const btnRejectAll = document.getElementById('rejectAll');
    const btnToggleSettings = document.getElementById('toggleSettings');
    const btnSaveSettings = document.getElementById('saveSettings');
    const settingsDiv = document.getElementById('cookieSettings');
    const inputAnalytics = document.getElementById('analyticsConsent');
    const inputMarketing = document.getElementById('marketingConsent');

    // Show banner or trigger based on existing consent
    if (!localStorage.getItem('cookie-consent')) {
        setTimeout(() => {
            banner.classList.add('show');
        }, 1000);
    } else {
        trigger.classList.add('visible');
    }

    const updateConsent = (consent) => {
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'ad_storage': consent.marketing ? 'granted' : 'denied',
                'ad_user_data': consent.marketing ? 'granted' : 'denied',
                'ad_personalization': consent.marketing ? 'granted' : 'denied',
                'analytics_storage': consent.analytics ? 'granted' : 'denied'
            });

            // Trigger custom event for GTM
            window.dataLayer.push({
                'event': 'consent_updated',
                'consent_analytics': consent.analytics,
                'consent_marketing': consent.marketing
            });
        }

        localStorage.setItem('cookie-consent', JSON.stringify(consent));
        banner.classList.remove('show');
        setTimeout(() => {
            trigger.classList.add('visible');
        }, 600);
    };

    // Trigger logic
    trigger.addEventListener('click', () => {
        banner.classList.add('show');
        trigger.classList.remove('visible');
    });

    btnAcceptAll.addEventListener('click', () => {
        updateConsent({ analytics: true, marketing: true });
    });

    btnRejectAll.addEventListener('click', () => {
        updateConsent({ analytics: false, marketing: false });
    });

    btnToggleSettings.addEventListener('click', () => {
        settingsDiv.classList.toggle('show');
        btnAcceptAll.style.display = settingsDiv.classList.contains('show') ? 'none' : 'block';
        btnRejectAll.style.display = settingsDiv.classList.contains('show') ? 'none' : 'block';
        btnToggleSettings.style.display = 'none';
        btnSaveSettings.style.display = 'block';
    });

    btnSaveSettings.addEventListener('click', () => {
        updateConsent({
            analytics: inputAnalytics.checked,
            marketing: inputMarketing.checked
        });
    });
});
