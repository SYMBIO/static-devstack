import svg4everybody from 'svg4everybody';

/* HMR */
if (module.hot) module.hot.accept();

window.cl = (...args) => (!PRODUCTION) ? console.log(...args) : false;

document.addEventListener('DOMContentLoaded', () => {
    svg4everybody();
    cl('Ready');
});