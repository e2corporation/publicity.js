/**
 * App.js
 * REV2 API Contenst 2015
 *
 * @filesource  app.js
 * @author      Julien Chinapen <julien@revcontent.com>
 * @version     1.0.0
 * @category    pi-contest
 * @package     publicity
 * @subpackage  javascripts
 * @license     Private, Copyright (c) Julien Chinapen
 * @todo        Compress and Uglify
 */

;
(function ($, window, document, Headroom, hljs, undefined) {


    var App = {
        init: function () {


            $('#footer').headroom();
            $('#nav').headroom({
                offset: 800
            });


            hljs.initHighlightingOnLoad();
        }

    };


    $(document).ready(App.init);


}(jQuery, window, document, Headroom, hljs));