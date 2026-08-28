/**
 * Async CSS loader - CSP safe
 * Aktivuje stylesheety oznacene [data-async-css] (nactene s media="print"),
 * aby neblokovaly vykresleni. Nahrazuje inline onload="this.media='all'",
 * ktery by porusoval Content-Security-Policy.
 */

(function () {
    var links = document.querySelectorAll('link[data-async-css]');

    var activate = function (link) {
        link.media = 'all';
    };

    Array.prototype.forEach.call(links, function (link) {
        // Stylesheet uz je stazeny (skript bezi s defer) - aktivuj rovnou
        if (link.sheet) {
            activate(link);
        } else {
            link.addEventListener('load', function () {
                activate(link);
            }, { once: true });
        }
    });
})();
