module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    var banner_tmpl = grunt.file.read('./banner.part');
    
    var SRC_LIST = [
        "src/ABPMobile.js",
        "src/ABPLibxml.js",
        "src/ABPlayer.js",
        "src/CommentCoreLibrary.min.js",
        "src/Blodh.js"
    ]

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            dist: {
                files: {
                    "blodh.min.css" : "src/blodh.css"
                }
            }
        },
        uglify: {
            options: {
                banner: banner_tmpl
            },
            dist: {
                files: {
                    './blodh.min.js': SRC_LIST,
                    './bloader.min.js': 'src/bloader.js'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['uglify', 'cssmin']);
}