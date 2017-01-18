import $             from "jquery";
import svg4everybody from 'svg4everybody';

/* HMR */
if (module.hot) module.hot.accept();

window.cl = (...args) => (!PRODUCTION) ? console.log(...args) : false;

$(() => {
    svg4everybody();
    cl('Ready');
});