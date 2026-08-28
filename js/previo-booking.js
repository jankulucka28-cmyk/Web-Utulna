/**
 * Previo booking engine - zavadec
 *
 * Puvodne byl tento kod vlozeny primo ve strance jako <script>, coz
 * neslo skloubit s prisnou Content-Security-Policy (script-src 'self').
 * Konfigurace se proto cte z atributu data-previo-id na kontejneru.
 */

(function () {
    var container = document.getElementById('previo-booking-engine');
    if (!container) return;

    var id = container.getAttribute('data-previo-id');
    if (!id) return;

    // Konfiguraci ocekava loader v globalnim scope
    window.bookingEngineConfig = {
        id: id,
        lang: container.getAttribute('data-previo-lang') || 'cs',
        currency: container.getAttribute('data-previo-currency') || 'CZK'
    };

    var loader = document.createElement('script');
    loader.src = 'https://booking.previo.app/loader/';
    document.head.appendChild(loader);

    // Iframe si sam hlasi svou vysku pres postMessage
    var observer = new MutationObserver(function () {
        var iframe = container.querySelector('iframe');
        if (!iframe) return;
        observer.disconnect();

        window.addEventListener('message', function (e) {
            // Prijimat vysku jen od Previa, ne od libovolneho okna
            if (!/^https:\/\/([a-z0-9-]+\.)*previo\.app$/.test(e.origin)) return;

            var data = e.data;
            var height = null;

            if (typeof data === 'object' && data !== null) {
                height = data.height || data.frameHeight || data.iframeHeight || null;
            } else if (typeof data === 'string') {
                try {
                    var parsed = JSON.parse(data);
                    height = parsed.height || parsed.frameHeight || null;
                } catch (err) {}
            }

            if (height && +height > 50) {
                iframe.style.height = (+height) + 'px';
            }
        });
    });

    observer.observe(container, { childList: true, subtree: true });
})();
