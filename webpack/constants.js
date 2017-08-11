import path from 'path';
import config from '../config';

export const ABSOLUTE_BASE = path.normalize(path.join(__dirname, '..'));

const constants = Object.freeze({
    ABSOLUTE_BASE,
    DIST_DIR: path.join(ABSOLUTE_BASE, `${config.outputPath}`),
    SRC_DIR: path.join(ABSOLUTE_BASE, `${config.assetsPath}`),
    PORT: `${config.port}`
});

export const DIST = constants.DIST_DIR;
export const SRC = constants.SRC_DIR;
export const PORT = constants.PORT;

export default constants;
