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
        src: ['public/assets/js/underscore-min.js', 'public/assets/js/html2canvas.js', 'public/assets/js/jquery.autocomplete.js',
          'public/assets/js/global.js', 'public/assets/js/jst.js', 'public/assets/js/components.js',
          'public/assets/js/init.js', 'public/assets/js/strunit.js', 'public/assets/js/setup.js',
          'public/assets/js/courseunit.js'],
        dest: 'public/assets/js/js-built.js'
      }
    },
    jst: {
      compile: {
        options: {
          processName: function(path) {
            var split = path.split('/');
            return split[split.length - 1].split('.')[0];
          }
        },
        files: {
          "public/assets/js/jst.js": ["public/assets/js-templates/*.html"]
        }
      }
    },
    watch: {
      files: [["public/assets/js-templates/*.html"], '<%= uglify.build.src %>'],
      tasks: ['jst', 'uglify']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jst');

};