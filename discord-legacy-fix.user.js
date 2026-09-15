// ==UserScript==
// @name         Fix Discord on old Chrome
// @namespace    discord.com
// @version      2
// @description  Load legacy Discord JavaScript and fix legacy login
// @match        https://discord.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Fix Discord's old login request:
    // old client sends { email, password }
    // current API expects { login, password }

    function fixLoginBody(body) {
        if (typeof body !== 'string') return body;

        try {
            const data = JSON.parse(body);

            if (data.email && data.password && !data.login) {
                data.login = data.email;
                delete data.email;

                console.log('[Discord Legacy Fix] Changed email -> login');

                return JSON.stringify(data);
            }
        } catch (e) {
            // Not JSON
        }

        return body;
    }

    // XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
        this._discordUrl = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function (body) {
        if (
            this._discordUrl &&
            String(this._discordUrl).indexOf('/api/v6/auth/login') !== -1
        ) {
            body = fixLoginBody(body);
        }

        return originalSend.call(this, body);
    };

    // fetch
    if (window.fetch) {
        const originalFetch = window.fetch;

        window.fetch = function (input, init) {
            const url = typeof input === 'string'
                ? input
                : (input && input.url);

            if (
                url &&
                String(url).indexOf('/api/v6/auth/login') !== -1 &&
                init &&
                init.body
            ) {
                init = Object.assign({}, init);
                init.body = fixLoginBody(init.body);
            }

            return originalFetch.call(this, input, init);
        };
    }

    // Load the legacy Discord bundles
    const scripts = [
        'https://discord.com/assets/0ef846b4f5ea8910fe2c.js',
        'https://discord.com/assets/124c3c29284ec03a7ed3.js',
        'https://discord.com/assets/25d80c8900edab77d429.js',
        'https://discord.com/assets/60985e9aa8a769bb3e54.js',
        'https://discord.com/assets/6e7cd5e58dabc750839d.js',
        'https://discord.com/assets/7d500467fda6657ccb9e.js',
        'https://discord.com/assets/83446b8c2ef1bf276580.js',
        'https://discord.com/assets/a26bf48b6d5dfe2a0617.js'
    ];

    for (const src of scripts) {
        const script = document.createElement('script');
        script.src = src;
        document.documentElement.appendChild(script);
    }
})();
