import $             from "jquery";
import svg4everybody from 'svg4everybody';

/* HMR */
if (module.hot) module.hot.accept()

$(() => {
    svg4everybody();
    console.log('Ready');
});