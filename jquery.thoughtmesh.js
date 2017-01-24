/**
 * @required bootbox
 */

(function( $ ) {
	
	var defaults = {};
	
	var results = [  // Temp
        {
            'author':"Palin",
            'text':"Why I endorsed Donald Trump",
            'keys':['collaboration','defect','politics']
        },
        {
            'author':"Brooks",
            'text':"Donald Trump and the end of time",
            'keys':['defect','politics']
        },
        {
            'author':"Jones",
            'text':"Problems of collaboration...",
            'keys':['collaboration','defect']
        },
        {
            'author':"Gonzalez",
            'text':"An analysis of community interfaces...",
            'keys':['collaboration']
        }];
	
	var related = {
            'internal': [{
                'author':'Michael Lynch',
                'title':'Twin Paradox',
                'lexia':'It was the best of times',
                'excerpt':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            },{
                'author':'George R.R. Martin',
                'title':'When?',
                'lexia':'Soon',
                'excerpt':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            }],
            'external': [{
                'author':'Richard Feynman',
                'title':'You Must Be Joking...',
                'lexia':'Path Integrals',
                'excerpt':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            },{
                'author':'Bertrand Russell',
                'title':'Logicomix',
                'lexia':'Let\'s play a game',
                'excerpt':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            },{
                'author':'Paul Dirac',
                'title':'Relativistic Quantum Mechanics',
                'lexia':'We got this',
                'excerpt':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            }]
        };
	
    $.fn.thoughtmesh = function(options) {
        var self = this;
        var $this = $(this);
        var opts = $.extend( {}, defaults, options );
        $.getScript($('link#approot').attr('href')+'plugins/thoughtmesh/lib/bootbox.min.js', function(data,textStatus,jqxhr) {});
        
        var openModal = function() {
                var self = this;
                var $this = $(this);
                var tag = $this.data('tm-tag');
                var results = getRelated(tag);

                bootbox.dialog({
                	size: 'large',
                    message: '<div id="bootbox-thoughtmesh-content" class="heading_font"></div>',
                    title: 'ThoughtMesh pages related to <b>'+tag+'</b>',
                    className: 'thoughtmesh_bootbox',
                    animate: ( (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) ? false : true )// Panel is unclickable if true for iOS
                });
                $('.thoughtmesh_bootbox .modal-body').height( parseInt($(window).height()) * 0.83 );
                $('.bootbox-close-button').empty();
                $('.bootbox').find( '.modal-title' ).addClass( 'heading_font' );
                var $box = $('<div />').addClass('container-fluid').appendTo($('#bootbox-thoughtmesh-content'));
                $('<div>Excerpts Here</div>').appendTo($box).addClass('h5 heading_font col-md-12').wrap($('<div />').addClass('row'));
                var $internal = $('<div />').addClass('row').appendTo($box);
                for(var i in results['internal']) {
                    var entry = results['internal'][i];
                    $('<div></div>').appendTo($internal).html(entry.author+',&nbsp;"'+entry.title+'"').addClass('col-md-12 tm-header');
                    $('<div></div>').appendTo($internal).html(entry.lexia).addClass('col-md-11 col-md-offset-1 tm-text');
                    $('<div></div>').appendTo($internal).html(entry.excerpt).addClass('col-md-11 col-md-offset-1 tm-excerpt');
                };
                $('<div>Excerpts Out</div>').appendTo($box).addClass('h5 heading_font col-md-12').wrap($('<div />').addClass('row'));
                var $external = $('<div />').addClass('row').appendTo($box);
                for(var i in results['external']) {
                    var entry = results['external'][i];
                    $('<div></div>').appendTo($external).html(entry.author+',&nbsp;"'+entry.title+'"').addClass('col-md-12 tm-header');
                    $('<div></div>').appendTo($external).html(entry.lexia).addClass('col-md-11 col-md-offset-1 tm-text');
                    $('<div></div>').appendTo($external).html(entry.excerpt).addClass('col-md-11 col-md-offset-1 tm-excerpt');
                };
        };

        var getRelated = function(tag) {
            return related;
        };

        var $wrapper = $('<div class="tm_footer container-fluid"></div>').appendTo($this);
        var $header = $("<div class='row'><div class='col-md-2 col-sm-2 col-xs-4'></div><div class='col-md-5 col-xs-8 col-sm-6'><div class=\"tm-header\">Articles</div></div><div class='col-md-4 col-sm-4 hidden-xs'><div class=\"tm-header\">Related keywords</div></div></div>").appendTo($wrapper);
        for (var i in results) {
            var $row = $("<div class='row'><div class='tm-tag col-md-2 col-sm-2 col-xs-4'></div><div class='tm-article col-md-5 col-xs-8 col-sm-6'></div><div class='tm-key col-md-4 col-sm-4 hidden-xs'></div></div>").appendTo($wrapper);
            var $article = $row.children('.tm-article:first');
            // Author
            if ('undefined' != typeof(results[i].author)) {
                $("<span class='tm-author'></span>").html(results[i].author+',&nbsp;').appendTo($article);
            }
            // Text
            $("<span class='tm-text'></span>").html(results[i].text).appendTo($article);
            // Tags
            $row.children('.tm-tag').html(('<span class="glyphicon glyphicon-tag"></span>').repeat(results[i].keys.length));
            // Keywords
            var keyhtml = '';
            $keys = $row.children('.tm-key');
            for (var j = 0; j < results[i].keys.length; j++) {
                if (0 != j) $keys.append(',&nbsp;');
                var $key = $('<span></span>');
                $key.addClass('tm-link');
                $key.html(results[i].keys[j]);
                $key.data('tm-tag',results[i].keys[j]);
                $key.appendTo($keys);
            };
        }
        $('.tm-link').click(openModal);
        $('.tm-tag').wrapInner('<div style="float:right"></div>');
    }
}( jQuery ));