module.exports = function (grunt) {

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            /*build: {
             src: 'src/js/<%= pkg.name %>.js',
             dest: 'build/js/<%= pkg.name %>.min.js'
             }*/
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: ['*.js', '!*.min.js'],
                    dest: 'build/js',
                    ext: '.min.js'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/css',
                    ext: '.min.css'
                }]
            }
        },
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/img',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/img'
                }]
            }
        },
        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: ['**/*.jsx'],
                        dest: 'src/js',
                        ext: '.js'
                    }
                ]
            }

        }
    });

    // Uglify
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // CSS Minification
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Image Minification
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // React/JSX Compilation
    grunt.loadNpmTasks('grunt-react');

    // Register Default task(s).
    grunt.registerTask('default', ['react', 'uglify', 'cssmin', 'imagemin']);

};