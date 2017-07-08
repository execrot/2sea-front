module.exports = function(grunt) {

    var build = grunt.option('build') || 'build';

    grunt.option('force', true);

    grunt.file.delete(build + "/.htaccess");
    grunt.file.delete(build + "/app.min.css");
    grunt.file.delete(build + "/app.min.js");
    grunt.file.delete(build + "/fonts");
    grunt.file.delete(build + "/img");
    grunt.file.delete(build + "/index.html");

    var configuration = {
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                files: [
                    {cwd: 'img', src: [ '**' ], dest: build+'/img', expand: true},
                    {cwd: 'node_modules/font-awesome/fonts', src: [ '**' ], dest: build+'/fonts', expand: true},
                    {src: 'index.html', dest: build+'/index.html'},
                    {src: '.htaccess', dest: build+'/.htaccess'}
                ]
            }
        },
        uglify: {
            build: {
                files: {
                    'js': [

                        // Third party libs
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/bootstrap/dist/js/bootstrap.js',

                        // FrontStar core
                        'front-star/core.js',
                        'front-star/view/view.js',
                        'front-star/view/plugin/date-format.js',
                        'front-star/view/plugin/hex-to-rgba.js',
                        'front-star/view/plugin/partial.js',
                        'front-star/dom.js',
                        'front-star/module.js',
                        'front-star/service.js',
                        'front-star/storage.js',
                        'front-star/router.js',

                        // Application sources
                        'app/modules/**/*.js',
                        'app/services/**/*.js'
                    ]
                }
            }
        },
        cssmin: {
            combine: {
                files: {
                    'css': [

                        // Third party css
                        'node_modules/bootstrap/dist/css/bootstrap.css',
                        'node_modules/animate.css/animate.css',
                        'node_modules/font-awesome/css/font-awesome.css',

                        // Custom css
                        'css/header.css',
                        'css/global.css',
                        'css/index.css',
                        'css/filter.css'
                    ]
                }
            }
        }
    };

    var js = configuration['uglify']['build']['files'];
    configuration['uglify']['build']['files'] = {};
    configuration['uglify']['build']['files'][build+'/app.min.js'] = js['js'];

    var css = configuration['cssmin']['combine']['files'];
    configuration['cssmin']['combine']['files'] = {};
    configuration['cssmin']['combine']['files'][build+'/app.min.css'] = css['css'];

    grunt.initConfig(configuration);

    grunt.registerTask('template', null, function(){

        var concatenated = {};

        grunt.file.recurse('app', function(templateFilePath, a, b, c) {

            if (c.substr(-5) == '.html') {
                var templateId = [b, c.substr(0, c.length -5)].join('/').split('/').slice(1).join('/');
                concatenated[templateId] = grunt.file.read(templateFilePath);
            }
        });

        var allJs = "window.___FrontStarViewTemplates="+JSON.stringify(concatenated)+ ";" + grunt.file.read(build+'/app.min.js');

        grunt.file.write(build+'/app.min.js', allJs);
    });

    grunt.registerTask('layout', null, function(){

        function replaceSection(section, content) {
            var layout = grunt.file.read(build+'/index.html').split('<!-- ' + section + ' -->');
            layout[1] = content;
            grunt.file.write(build+'/index.html', layout.join(''));
        };

        function includeScripts(){
            return '<script src="app.min.js?_=' + Math.random().toString().split('.')[1] + '"></script>';
        };

        function includeStyles(){
            return '<link rel="stylesheet" href="app.min.css?_=' + Math.random().toString().split('.')[1] + '"  />'
        };

        replaceSection('Grunt:JS', includeScripts());
        replaceSection('Grunt:CSS', includeStyles());
    });

    grunt.registerTask('bootstrap', null, function(){

        var appMin = grunt.file.read(build+'/app.min.js') + ';' + grunt.file.read('app/bootstrap.js');

        appMin = appMin.split("\\r\\n        ").join('');
        appMin = appMin.split("\\r\\n").join('');

        appMin = appMin.split("    .").join(' .');
        appMin = appMin.split(";    ").join('');

        appMin = appMin.split("\\n").join('');
        appMin = appMin.split("    ").join('');

        grunt.file.write(build+'/app.min.js', appMin);
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['uglify', 'cssmin', 'copy', 'template', 'layout', 'bootstrap']);
};