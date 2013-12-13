module.exports = function(grunt) {
    'use strict';

    // Project config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: {
          full: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * http://nativevml.github.io/NOS-UI/\n *\n' +
            ' * Copyright (c) <%= _.pluck(pkg.contributors, "name").join(", ") %>\n' +
            ' * <%= pkg.license %> License\n */' +
            ' \n' +
            '/*\n' +
            ' * NOS UI is a jQuery framework mainted and developed by the Native team to\n' +
            ' * help streamline workflow.\n' +
            ' */'
        },
        jshint: {
            options: {
                boss: true,
                browser: true,
                curly: false,
                devel: true,
                eqeqeq: false,
                eqnull: true,
                expr: true,
                evil: true,
                immed: false,
                laxcomma: true,
                newcap: false,
                noarg: true,
                quotmark: 'single',
                smarttabs: true,
                sub: true,
                trailing: true,
                undef: true,
                unused: true,
                globals: {
                    jQuery: true,
                    NosUIApp: true,
                    Modernizr: true,
                    define: true,
                    require: true
                },
                ignores: ['src/load.js', 'src/require.js']
            },
            files: [
                'src/*.js'
            ],
            tests: {
                options: {
                    jquery: true,
                    globals: {
                        Modernizr: true,
                        TEST: true,
                        QUnit: true
                    }
                },
                files: {
                    src: ['test/js/*.js']
                }
            },
            lib: {
                options: {
                    node: true
                },
                files: {
                    src: ['lib/*.js']
                }
            }
        },
        concat: {
            dist: {
                src: [
                    'src/*.js'
                ],
                dest: 'public/jquery.<%= pkg.name %>.min.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'public/jquery.<%= pkg.name %>.min.js',
                dest: 'public/jquery.<%= pkg.name %>.min.js'
            }
        },
        compass: {
            dist: {
                options: {
                    outputStyle: 'compressed',
                    config: 'scss/config.rb',
                    sassDir: 'scss',
                    cssDir: 'css',
                    imageDir: 'img'
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/*.js'],
                tasks: ['concat', 'uglify'],
                options: {
                    spawn: false,
                }
            },
            css: {
                files: ['scss/*.scss'],
                tasks: ['compass'],
                options: {
                    livereload: true,
                    spawn: false,
                }
            }
        }
    });

    // Load Tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default tasks
    grunt.registerTask('default', [
        'jshint',
        'concat',
        'uglify',
        'compass',
        'watch'
    ]);
};