import './helpers';
import svg4everybody from 'svg4everybody';

/* HMR */
if (module.hot) module.hot.accept();

document.addEventListener('DOMContentLoaded', () => {
    svg4everybody();
    cl('ready');
});
