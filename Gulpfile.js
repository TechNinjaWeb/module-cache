var gulp = require('gulp'),
	mainBowerFiles = require('main-bower-files'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	concatCss = require('gulp-concat-css'),
	gulpFilter = require('gulp-filter');

gulp.task('bower', function() {
    var filterJS = gulpFilter('**/*.js', { restore: true });
    return gulp.src(mainBowerFiles({
		    paths: {
		        bowerDirectory: 'scripts',
		        bowerrc: '.bowerrc',
		        bowerJson: 'bower.json'
		    },
            overrides: {}
        }))
        .pipe(filterJS)
        .pipe(concat('bower.js'))
        .pipe(uglify())
        .pipe(filterJS.restore)
        .pipe(gulp.dest('./www/js/lib'));
});

gulp.task('basic-serve', function() {
    return gulp.src(mainBowerFiles({
	    paths: {
	        bowerDirectory: 'scripts',
	        bowerrc: '.bowerrc',
	        bowerJson: 'bower.json'
	    }
	}))
	// Serve To Client Destination
	.pipe( gulp.dest('www/js/lib'));
});

// gulp.task('concatCss', function () {
//   return gulp.src('assets/**/*.css')
//     .pipe(concatCss("styles/bundle.css"))
//     .pipe(gulp.dest('out/'));
// });