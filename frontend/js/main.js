/* @flow */

import './helpers';
import svg4everybody from 'svg4everybody';
import objectFitImages from 'object-fit-images';

/* HMR */
if (module.hot) module.hot.accept();

document.addEventListener('DOMContentLoaded', () => {
    svg4everybody();
    objectFitImages();
    cl('ready');
});
