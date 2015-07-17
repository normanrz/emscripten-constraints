// Karma configuration
// Generated on Sun May 10 2015 18:54:32 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai', 'jquery-2.1.0'],


    // list of files / patterns to load in the browser
    files: [
      'node_modules/cassowary/bin/c.js',

      { pattern: 'tests/*.js', included: false },
      { pattern: 'rhea/*.js', included: false },
      { pattern: 'z3/*.js', included: false },
      { pattern: 'z3/*.js.mem', included: false },
      { pattern: 'loader.js', included: false },

      'tests/config.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    customLaunchers: {
        Chrome_Travis_CI: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },

    browserNoActivityTimeout: 60000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    plugins: [
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-requirejs',
      'karma-chai',
      'karma-jquery',
      'karma-chrome-launcher',
    ]
  });

  if(process.env.TRAVIS){
    config.browsers = ['Chrome_Travis_CI'];
  }

};
