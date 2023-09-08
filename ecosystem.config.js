module.exports = {
  apps: [
    {
      name: 'bz-api',
      script: 'index.js',
      log_date_format : "YYYY-MM-DD HH:mm Z",
      env_test: {
        NODE_ENV: 'test'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'bz-events',
      script: 'subscribeEvents.js',
      log_date_format : "YYYY-MM-DD HH:mm Z",
      env_test: {
        NODE_ENV: 'test'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'bz-statistics',
      script: 'updateStatistics.js',
      log_date_format : "YYYY-MM-DD HH:mm Z",
      env_test: {
        NODE_ENV: 'test'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
