import $             from "jquery";
import svg4everybody from 'svg4everybody';

/* HMR */
if (module.hot) module.hot.accept()

window.cl = (a) => (process.env.NODE_ENV !== 'production') ? console.log(a) : false;

$(() => {
    svg4everybody();
    cl('Ready');
});