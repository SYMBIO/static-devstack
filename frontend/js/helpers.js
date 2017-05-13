/*eslint-disable */
module.exports = (function() {
    /**
     * Globally available console.log
     * that won't print anything in production.
     * Protip: blackbox this file in devtools
     */
    window.cl = (...args) => (!PRODUCTION) ? console.log(...args) : false;
})();
