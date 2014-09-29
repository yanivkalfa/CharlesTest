/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */

// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)

var cssFilesToInject = [

    '/lib/bootstrap/css/bootstrap.css',
    '/lib/font-awesome/css/font-awesome.min.css',
    '/lib/weather-icons/weather-icons.min.css',
    '/lib/effects/menu-effects.css',
    'http://fonts.googleapis.com/css?family=Lobster',//Google Fonts
    'http://fonts.googleapis.com/css?family=Lato:400,100italic,100,300italic,300,400italic,700,700italic,900,900italic',//Google Fonts

    //Assets
    '/lib/jquery-ui/ui-lightness/jquery-ui-1.10.3.custom.css',
    '/lib/morrischarts/morris.css',
    '/lib/fullcalendar/fullcalendar.css',
    '/lib/datatables/jquery.dataTables.css',
    '/lib/icheck/flat/_all.css',
    '/bower/dropzone/downloads/css/dropzone.css',

    // Theme Styles
    '/styles/theme/styles-less.css',
    '/styles/theme/responsive.css',
    '/styles/theme/animate.css',

    //'styles/**/*.css',

    '/styles/main.css'

];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

    // Load sails.io before everything else
    'js/dependencies/sails.io.js',

    // custom loaded scripts start
    '/bower/jquery/dist/jquery.min.js',
    '/bower/jquery.textarea.autoresize/js/jquery.textarea.autoresize.js',
    '/bower/dropzone/downloads/dropzone.js',
    '/lib/nicescroll/jquery.nicescroll.min.js',// Custom Scroll Bar
    '/lib/bootstrap/js/bootstrap.min.js',
    '/lib/charts/table-to-chart.js',
    '/lib/fullcalendar/fullcalendar.min.js',
    '/lib/fullcalendar/gcal.js',
    '/lib/sidebar/min-height.js',
    '/lib/datatables/jquery.dataTables.min.js',// DataTables
    '/lib/jquery-ui/jquery-ui-1.10.3.custom.min.js',// jQuery UI
    '/lib/icheck/icheck.js',// iCheck
    '/lib/_demo/icheck/icheck.js',// Dashboard Charts
    '/lib/_demo/charts/dashboard.js',// Dashboard Charts
    '/lib/_demo/all-pages.js',// Dashboard Charts

    '/js/_customers.js',
    '/js/app.js',
    //'/js/dropzone.js',
    '/js/init.js',
    '/js/moment.js',
    '/js/moment-timezone.js',
    '/js/sails.io.js',
    '/js/socket.io.js',
    '/js/test.js',
    '/js/utilFunc.js',
    '/js/wavesurfer.min.js',
    '/js/songInit.js',
    '/js/playListInit.js'


    // custom loaded scripts End

    // Dependencies like jQuery, or Angular are brought in here

    //'js/dependencies/**/*.js',

    // All of the rest of your client-side js files
    // will be injected here in no particular order.
    //'js/**/*.js'
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
    'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
    return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
    return 'assets/' + path;
});
