const path = require('path');

exports.onCreateWebpackConfig = (args) => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../src/'),
      },
    },
  });
};
