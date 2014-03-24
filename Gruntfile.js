
module.exports = function(grunt) {
    'use strict';

    // Module configs
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner:
            '/*\n' +
            ' * <%= pkg.name %>\n' +
            ' * <%= pkg.description %>\n' +
            ' * Version: "<%= pkg.version %>"\n' +
            ' * <%= pkg.author %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' * License: <%= pkg.license %>\n' +
            ' */' +
            '\n',

        compass: {
            dist: {
                options: { // Target options
                    specify: 'scss/*.scss',
                    banner: '<%= banner %>',
                    relativeAssets: true,
                    cssDir: 'css',
                    sassDir: 'scss',
                    imagesDir: 'img',
                    outputStyle: 'compressed'
                }
            }
        },

        version: {
            sass_files: {
                options: {
                    prefix: 'Version\:\\s+[\'"]'
                },
                src: ['scss/main.scss']
            },
            js_files: {
                options: {
                    prefix: 'Version\:\\s+[\'"]'
                },
                src: ['js/jquery.nos.js']
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>',
            },
            my_target: {
                files: {
                    'js/jquery.nos.min.js': ['js/jquery.nos.js']
                }
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Register tasks for the `grunt` terminal command
    grunt.registerTask('default', ['compass', 'version', 'uglify']);
};
