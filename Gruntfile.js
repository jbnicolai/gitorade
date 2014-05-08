module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-replace');

  grunt.initConfig({
    'string-replace': {
      dist: {
        files: {
          'app/config.js': 'app/config.js'
        },

        options: {
          replacements: [
            {
              pattern: /setClientId\('.*'\)/g,
              replacement: "setClientId('CLIENT_ID')"
            },
            {
              pattern: /setClientSecret\('.*'\)/g,
              replacement: "setClientSecret('CLIENT_SECRET')"
            }
          ]
        }
      },

      prod: {
        files: {
          'app/config.js': 'app/config.js'
        },

        options: {
          replacements: [
            {
              pattern: /setClientId\('.*'\)/g,
              replacement: "setClientId('<%= grunt.file.read('.github_client_id') %>')"
            },
            {
              pattern: /setClientSecret\('.*'\)/g,
              replacement: "setClientSecret('<%= grunt.file.read('.github_client_secret') %>')"
            }
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerTask('dist', 'string-replace:dist');
  grunt.registerTask('prod', 'string-replace:prod');
};