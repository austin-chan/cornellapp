module.exports = function(grunt) {

  var js = 'public/js/';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! Built by Chequerd at <%= grunt.template.today("yyyy-mm-dd h:MM:ss TT Z") %> */\n'
      },
      build: {
        src: ['public/assets/js/global.js', 'public/assets/js/init.js'],
        dest: 'public/assets/js/js-built.js'
      }
    },
    watch: {
      files: ['<%= uglify.build.src %>'],
      tasks: ['uglify']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

};