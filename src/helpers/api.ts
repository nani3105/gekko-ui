// global window.CONFIG

// move this to a file and load before the vue inits
const config =
{
  headless: false,
  api: {
    host: '127.0.0.1',
    port: 3000,
    timeout: 120000, // 2 minutes
  },
  ui: {
    ssl: false,
    host: 'ec2-34-210-9-52.us-west-2.compute.amazonaws.com', // ec2-34-210-9-52.us-west-2.compute.amazonaws.com
    port: 3000,
    path: '/',
  },
  adapter: 'mongodb',
}.ui;
const endpoint = `${config.host}${config.port === 80 ? '' : `:${config.port}`}${config.path}`;

let basePath;
let restPath: string;
let wsPath: string;

// rest API path
if ( config.ssl) {
  basePath = `https://${endpoint}`;
} else {
  basePath = `http://${endpoint}`;
}

restPath = basePath + 'api/';

// ws API path
if (config.ssl) {
  wsPath = `wss://${endpoint}/api`;
} else {
  wsPath = `ws://${endpoint}/api`;
}

export {
  wsPath,
  restPath,
  basePath,
};
