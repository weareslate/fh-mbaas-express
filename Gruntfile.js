module.exports = function(grunt) {
  'use strict';

  // Just set shell commands for running different types of tests
  // the NO_FLUSH_TIMER env var stops the reporting flush interval function from being set up and
  grunt.initConfig({
    _test_runner: 'mocha',
    _unit_args: '-A -u exports --recursive -t 10000 ./test/unit',
    _unit_single_args: '-A -u exports --recursive -t 10000',
    _accept_args: '-A -u exports --recursive -t 10000 ./test/setup.js ./test/accept',

    // These are the properties that grunt-fh-build will use
    unit: 'NO_FLUSH_TIMER=true <%= _test_runner %> <%= _unit_args %>',
    unit_cover: 'NO_FLUSH_TIMER=true istanbul cover --dir cov-unit <%= _test_runner %> -- <%= _unit_args %>',
    unit_single: 'NO_FLUSH_TIMER=true <%= _test_runner %> <%= _unit_single_args %> ./test/unit/**/<%= unit_test_filename %> --grep=<%= unit_test_param1 %>',

    accept: 'NO_FLUSH_TIMER=true <%= _test_runner %> <%= _accept_args %>',
    accept_cover: 'NO_FLUSH_TIMER=true istanbul cover --dir cov-accept <%= _test_runner %> -- <%= _accept_args %>',
    integrate:['NO_FLUSH_TIMER=true <%= _test_runner %> ./test/integrate']
  });

  grunt.loadNpmTasks('grunt-fh-build');
  grunt.registerTask('default', ['fh:default']);
};
