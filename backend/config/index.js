import merge from 'lodash.merge';
import common from './env/common';

const env = process.env.NODE_ENV || 'development';
/* eslint import/no-dynamic-require: 0 */
const config = require(`./env/${env}`).default;

export default merge(common, config);
