const path = require("path");
const directoryName = path.basename(__dirname);

module.exports = {
  apps: [{
    name: directoryName,
    script: './build/index.js',
    node_args: '-r ts-node/register -r tsconfig-paths/register',
    watch: false,
    restart_delay: 10000,
    wait_ready: true,
    env: {
      NODE_ENV: 'production',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],

};