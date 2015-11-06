(function() {

    'use strict';

    module.exports = function(grunt) {

        var config, environment, errorHandler, name, open, pkg, taskArray, taskName, tasks, verbose, _results;

        pkg = grunt.file.readJSON('package.json');
        environment = process.env.VTEX_HOST || 'vtexcommercestable';
        verbose = grunt.option('verbose');
        open = pkg.accountName ? 'http://' + pkg.accountName + '.vtexlocal.com.br/?debugcss=true&debugjs=true' : void 0;

        errorHandler = function(err, req, res, next) {
            var errString, _ref, _ref1;
            errString = (_ref = (_ref1 = err.code) !== null ? _ref1.red : void 0) !== null ? _ref : err.toString().red;
            return grunt.log.warn(errString, req.url.yellow);
        };

        config = {
            clean: {
                main: ['build']
            },
            copy: {
                main: {
                    files: [{
                        expand: true,
                        cwd: 'src/',
                        src: ['**', '!**/*.sass', '!**/*.scss'],
                        dest: 'build/'
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
                main: {
                    expand: true,
                    cwd: 'src/styles/',
                    src: ['*.css'],
                    dest: 'build/'
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
                        expand: true,
                        cwd: 'src/vendor/bower_components/modernizr/',
                        src: ['modernizr.js'],
                        dest: 'build/arquivos'
                    }, {
                        'build/arquivos/general-motos.min.js': [
                            'src/vendor/bower_components/slick.js/slick/slick.min.js',
                            'src/scripts/general-motos.js',
                            'src/scripts/app/constructors/**/*.js',
                            'src/scripts/app/modules/**/*.js',
                            'src/scripts/app/pages/**/*.js',
                            'src/scripts/app/*.js'
                        ]
                    }, {
                        'build/arquivos/vtex-smartResearch.min.js': [
                            'src/scripts/vendor/vtex-smartResearch.dev.js'
                        ]
                    }]
                }
            },
            concat: {
                dist: {
                  src: [
                    'bower-components/slick.js/slick/slick.min.js',
                    'src/scripts/general-motos.js',
                    'src/scripts/app/constructors/**/*.js',
                    'src/scripts/app/modules/**/*.js',
                    'src/scripts/app/pages/**/*.js',
                    'src/scripts/app/*.js'
                  ],
                  dest: 'build/arquivos/general-motos.dev.js'
                },
            },
            imagemin: {
                main: {
                    files: [{
                        expand: true,
                        cwd: 'src/images',
                        src: ['*.{png,jpg,gif}'],
                        dest: 'build/arquivos/'
                    }]
                }
            },
            connect: {
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
            },
            watch: {
                options: {
                    livereload: true
                },
                images: {
                    files: ['src/**/*.{png,jpg,gif}'],
                    tasks: ['imagemin']
                },
                css: {
                    files: ['build/**/*.css']
                },
                main: {
                    files: ['src/**/*.html', 'src/**/*.css'],
                    tasks: ['copy']
                },
                js: {
                    files: ['src/scripts/**/*.js'],
                    tasks: ['uglify']
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
            build: ['clean', 'compass', 'imagemin', 'uglify'],
            devJs: ['concat'],
            'default': ['build', 'connect', 'watch'],
            devoff: ['build', 'watch']
            // devmin: ['build', 'min', 'connect:http:keepalive']
            // min: ['uglify', 'cssmin'],
            // dist: ['build', 'min'],
            // test: [],
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
