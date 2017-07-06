module.exports = function(grunt) {

    var config = {
        prod : {
            endpoint: 'https://xml.villabet.mx/front/stream',
            feedUpdateInterval: 20000,
            animationDuration: 200,
            adaptiveStartsFrom: 580
        },
        dev: {
            endpoint: 'https://xml.villabet.mx/front/stream',
            feedUpdateInterval: 60000,
            animationDuration: 200,
            adaptiveStartsFrom: 580
        }
    };

    var selectedConfig = config[grunt.option('target') || 'dev'];
    var build = grunt.option('build') || '../www';

    grunt.option('force', true);

    grunt.file.delete(build + "/embed.min.js");

    var configuration = {
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            build: {
                files: {
                    'js': [
                        'app/core.js',
                        'app/services/*.js',
                        'app/modules/**/*.js',
                        'app/bootstrap.js'
                    ]
                }
            }
        }
    };

    var js = configuration['uglify']['build']['files'];
    configuration['uglify']['build']['files'] = {};
    configuration['uglify']['build']['files'][build+'/embed.min.js'] = js['js'];

    grunt.initConfig(configuration);

    grunt.registerTask('concatTemplates', null, function(){

        var concatenated = {};

        grunt.file.recurse('app', function(templateFilePath, a, b, c) {

            if (c.substr(-5) == '.html') {
                var templateId = [b, c.substr(0, c.length -5)].join('/').split('/').slice(1).join('/');
                concatenated[templateId] = grunt.file.read(templateFilePath);
            }
        });

        var allJs = grunt.file.read(build+'/embed.min.js') + ";VillabetVideoFeed.core.view.templates="+JSON.stringify(concatenated)+ ";";
        grunt.file.write(build+'/embed.min.js', allJs);
    });

    grunt.registerTask('config', null, function(){
        var allJs = grunt.file.read(build+'/embed.min.js') + ";VillabetVideoFeed.app.config=" + JSON.stringify(selectedConfig) + ";";
        grunt.file.write(build+'/embed.min.js', allJs);
    });

    grunt.registerTask('replaceSpaces', null, function(){
        var allJs = grunt.file.read(build+'/embed.min.js');

        allJs = allJs.split("\\r\\n        ").join('');
        allJs = allJs.split("\\r\\n").join('');

        allJs = allJs.split("    .").join(' .');
        allJs = allJs.split(";    ").join('');

        allJs = allJs.split("\\n").join('');
        allJs = allJs.split("    ").join('');


        grunt.file.write(build+'/embed.min.js', allJs);
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify', 'concatTemplates', 'config', 'replaceSpaces']);
};