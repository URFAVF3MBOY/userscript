// ==UserScript==
// @name         Fix Discord on old Chrome
// @namespace    discord.com
// @version      1
// @description  Load legacy Discord JavaScript bundles
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

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