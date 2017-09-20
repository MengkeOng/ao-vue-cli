import devEnv from './dev';
import testEnv from './test';
import prodEnv from './prod';

let environment;

switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    environment = prodEnv;
    break;
  case 'test':
  case 'testing':
    environment = testEnv;
    break;
  case 'dev':
  case 'development':
    environment = devEnv;
    break;
  default:
    environment = devEnv;
}

export default environment;