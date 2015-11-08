(function() {

    'use strict';

    module.exports = function(grunt) {

        var config, environment, errorHandler, name, open, pkg, taskArray, taskName, tasks, verbose, _results;

        pkg = grunt.file.readJSON('package.json');
        //environment = process.env.VTEX_HOST || 'vtexcommercestable';
        verbose = grunt.option('verbose');
        open = pkg.accountName ? 'http://' + pkg.accountName + '.com.br/?debugcss=true&debugjs=true' : void 0;

        errorHandler = function(err, req, res, next) {
            var errString, _ref, _ref1;
            errString = (_ref = (_ref1 = err.code) !== null ? _ref1.red : void 0) !== null ? _ref : err.toString().red;
            return grunt.log.warn(errString, req.url.yellow);
        };

        config = {
            clean: {
                main: ['build']
            },
            preprocess: {
                options: {
                    context: {
                        DEBUG: true
                    }
                },
                // html: {
                //     src: 'src/index.html',
                //     dest: 'src/index.processed.html'
                // },
                js: {
                    src: 'src/scripts/core.js',
                    dest: 'src/scripts/_core.js'
                },
                // multifile: {
                //     files: {
                //         'test/test.processed.html': 'test/test.html',
                //         'test/test.processed.js': 'test/test.js'
                //     }
                // },
                // inline: {
                //     src: ['processed/**/*.js'],
                //     options: {
                //         inline: true,
                //         context: {
                //             DEBUG: false
                //         }
                //     }
                // },
                // all_from_dir: {
                //     src: '**/*.tmpl',
                //     ext: '.html',
                //     cwd: 'src',
                //     dest: 'build',
                //     expand: true
                // }
            },
            copy: {
                main: {
                    files: [{
                        expand: true,
                        cwd: 'src/',
                        src: ['**', '!**/*.js', '**/_*.js', '!**/*.sass', '!**/*.scss'],
                        dest: 'build/'
                    },
                    {
                        expand: true,
                        cwd: 'resources/',
                        src: ['createjs-2015.05.21.min.js'],
                        dest: 'build/resources/'
                    }]
                }
            },
            compass: {
                dist: {
                    options: {
                        config: 'config.rb'
                    }
                }
            },
            cssmin: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1
                },
                // main: {
                //     expand: true,
                //     cwd: 'src/styles/',
                //     src: ['**/*.css', '!**/*.min.css'],
                //     dest: 'build/styles',
                //     ext: '.min.css'
                // },
                target: {
                    files: [{
                        'build/styles/bug.css': ['build/styles/*.css']
                    }]
                }
            },
            uglify: {
                options: {
                    compress: {
                        drop_console: false
                    }
                },
                main: {
                    files: [{
                        'build/scripts/bug.min.js': [
                            'src/scripts/core.js',
                            'src/scripts/character/*/*.js'
                        ]
                    }]
                }
            },
            concat: {
                dist: {
                  src: [
                    'src/scripts/core.js',
                    'src/scripts/character/*/*.js'
                  ],
                  dest: 'build/bug.dev.js'
                },
            },
            /*imagemin: {
                main: {
                    files: [{
                        expand: true,
                        cwd: 'src/images',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'build/files/'
                    }]
                }
            },*/
            /*connect: {
                http: {
                    options: {
                        hostname: '*',
                        open: open,
                        port: process.env.PORT || 80,
                        middleware: [
                            require('connect-livereload')({
                                disableCompression: true
                            }),
                            require('connect-http-please')({
                                replaceHost: (function(h) {
                                    return h.replace("vtexlocal", environment);
                                })
                            }, {
                                verbose: verbose
                            }),
                            require('connect-tryfiles')('**', "http://portal." + environment + ".com.br:80", {
                                cwd: 'build/',
                                verbose: verbose
                            }), require('connect')['static']('./build/'), errorHandler
                        ]
                    }
                }
            },*/
            watch: {
                /*options: {
                    livereload: true
                },*/
                // images: {
                //     files: ['src/**/*.{png,jpg,gif}'],
                //     tasks: ['imagemin']
                // },
                // main: {
                //     files: ['src/**/*.html', 'src/**/*.css', 'src/**/*.css'],
                //     tasks: ['copy']
                // },
                css: {
                    files: ['build/**/*.css']
                },
                js: {
                    files: [
                        'src/scripts/**/*.js',
                        '!**/_core.js'
                    ],
                    tasks: ['preprocess','uglify']
                },
                compass: {
                    files: ['src/styles/**/*.scss'],
                    tasks: ['compass']
                },
                grunt: {
                    files: ['Gruntfile.js']
                }
            }
        };
        tasks = {
            build: ['clean', 'compass', 'cssmin', 'preprocess', 'uglify', 'copy'],
            devJs: ['concat'],
            'default': ['build', 'watch'],
            devoff: ['build', 'watch']
        };

        grunt.initConfig(config);
        for (name in pkg.devDependencies) {
            if (name.slice(0, 6) === 'grunt-') {
                grunt.loadNpmTasks(name);
            }
        }

        _results = [];
        for (taskName in tasks) {
            taskArray = tasks[taskName];
            _results.push(grunt.registerTask(taskName, taskArray));
        }
        return _results;
    };

}).call(this);
