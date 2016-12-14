import $             from "jquery";
import svg4everybody from 'svg4everybody';

/* HMR */
if (module.hot) module.hot.accept();

window.cl = (process.env.NODE_ENV !== 'production') ? console.log.bind(this) : () => {};

$(() => {
    svg4everybody();
    cl('Ready');
});