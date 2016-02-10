module.exports = function(grunt) {
  
  require("load-grunt-tasks")(grunt);
  
  grunt.initConfig({
    
    less: {
      development: {
        files: {
          "css/style.css": ["less/style.less"]
        }
      }
    },
    
    autoprefixer: {
      options: {
        browsers: ["last 2 versions", "ie 10"]
      },
      style: {
        src: ["css/**/*.css"]
      }
    },
    
    csscomb: {
      stage: {
        options: {
          config: ".csscomb.json"
        },
        expand: true,
        src: ["less/**/*.less"]
      }
    },
    
    imagemin: {
      static: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ["graph/**/*.{png,jpeg,gif,svg,jpg}"]
        }]
      }
    },
    
    cssmin: {
      build: {
        options: {
          report: "gzip"
        },
        files: {
          "css/min/style-min.css": ["css/style.css"]
        }
      }
    },
    
    copy: {
      build: {
        files: [{
          expand: true,
          src: [
            "css/**",
            "graph/**",
            "js/**",
            "*.html"
          ],
          dest: "build"
        }]
      }
    },
    
    clean: {
      build: ["build"]
    },
    
    replace: {
      stage_css: {
        options: {
          patterns: [{
            match: /\"\/graph\//g,
            replacement: "\"../graph/"
          }],
          detail: true
        },
        files: [{
          expand: true,
          src: [
            "css/**/*.css"
          ]
        }]
      },
      stage_html: {
        options: {
          patterns: [{
            match: /\"\/graph\//g,
            replacement: "\"./graph/"
          }],
          detail: true
        },
        files: [{
          expand: true,
          src: [
            "*.html"
          ]
        }]
      },
      build: {
        options: {
          patterns: [{
            match: /\.css/g,
            replacement: "-min.css"
          }],
          detail: true
        },
        files: [{
          expand: true,
          src: [
            "*.html"
          ]
        }]
      }
    }
  }),
    
    
  
  grunt.registerTask("stage", [
    "autoprefixer",
    "replace:stage_css",
    "replace:stage_html",
    "imagemin"
  ]);
  
  grunt.registerTask("build", [
    "autoprefixer",
    "imagemin",
    "cssmin",
//    "replace:build", 
    "clean",
    "copy"
  ]);
}












//    watch: {
//        files: ["less/*.less"],
//        tasks: ["less"],
//        options: {
//          spawn: false;
//        }
//    }