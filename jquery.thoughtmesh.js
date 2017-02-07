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
                bootbox.dialog({
                	size: 'large',
                    message: '<div id="bootbox-thoughtmesh-content" class="heading_font"></div>',
                    title: 'ThoughtMesh pages related to '+tag,
                    className: 'thoughtmesh_bootbox',
                    animate: ( (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) ? false : true )// Panel is unclickable if true for iOS
                });
                var $box = $('.thoughtmesh_bootbox');
                var $content = $box.find('#bootbox-thoughtmesh-content');
                $content.append('<h5>Loading...</h5>');
                $box.find('.modal-body').height( parseInt($(window).height()) * 0.83 );
                $box.find('.bootbox-close-button').empty();
                $box.find( '.modal-title' ).addClass( 'heading_font' );
                var document_id = 455;  // Temp
                var group_id = 0;
                $.getScript('http://thoughtmesh.net/export/outsideLexias.json.php?tag='+encodeURIComponent(tag)+'&documentid='+document_id+'&groupid='+group_id+'&external=1&time='+$.now(), function() {
                	outsideLexiasFun();
                	if ('undefined'==typeof(outsideLexiasObj)) {
                		alert('Something went wrong attempting to get tag information from ThoughtMesh. Please try again');
                		return false;
                	}
                	$content.empty();
	                var $container = $('<div />').addClass('container-fluid').appendTo($content);
	                /*
	                $('<div>Excerpts Here</div>').appendTo($box).addClass('h5 heading_font col-md-12').wrap($('<div />').addClass('row'));
	                var $internal = $('<div />').addClass('row').appendTo($box);
	                for(var i in results['internal']) {
	                    var entry = results['internal'][i];
	                    $('<div></div>').appendTo($internal).html(entry.author+',&nbsp;"'+entry.title+'"').addClass('col-md-12 tm-header');
	                    $('<div></div>').appendTo($internal).html(entry.lexia).addClass('col-md-11 col-md-offset-1 tm-text');
	                    $('<div></div>').appendTo($internal).html(entry.excerpt).addClass('col-md-11 col-md-offset-1 tm-excerpt');
	                };
	                */
	                $('<div>Excerpts Out</div>').appendTo($container).addClass('h4 heading_font col-md-12').wrap($('<div />').addClass('row'));
	                var $external = $('<div />').addClass('row').appendTo($container);
	                for(var j in outsideLexiasObj) {
	                    var entry = outsideLexiasObj[j];
	                    $('<div></div>').appendTo($external).html(entry.author+',&nbsp;"<a href="'+entry.url+'" target="_blank">'+entry.title+'</a>"').addClass('col-md-12 tm-header');
	                    for(var k in entry['lexias']) {
	                    	var lexia = entry['lexias'][k];
	                    	$('<div></div>').appendTo($external).html('<a href="'+entry.url+'#'+lexia.anchor+'" target="_blank">'+lexia.heading+'</a>').addClass('col-md-11 col-md-offset-1 tm-anchor body_font');
	                    	$('<div></div>').appendTo($external).html(lexia.excerpt).addClass('col-md-11 col-md-offset-1 tm-excerpt body_font');
	                    }
	                };
	                $('<div class="row">&nbsp;</div>').appendTo($container);
                });
        };

        var getRelated = function(tag) {
            return related;
        };

        var $wrapper = $('<div class="tm_footer container-fluid"><div class="tm_logo caption_font">ThoughtMesh &nbsp; <a href="javascript:void(null);" class="glyphicon glyphicon-question-sign" title="What is ThoughtMesh?"></a></div></div>').appendTo($this);
        var $header = $("<div class='row'><div class='col-md-2 col-sm-2 col-xs-4'></div><div class='col-md-5 col-xs-8 col-sm-6'><div class=\"tm-header\">Articles</div></div><div class='col-md-4 col-sm-4 hidden-xs'><div class=\"tm-header\">Related keywords</div></div></div>").appendTo($wrapper);
        $wrapper.find('.glyphicon:first').click(function() {
            bootbox.dialog({
                message: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus tellus in aliquet gravida. Nulla consequat fringilla pharetra. Phasellus feugiat, dolor nec pulvinar vulputate, felis erat tincidunt elit, ac vulputate lectus arcu a urna. Phasellus sed convallis quam. Aenean vel pretium felis. Nam massa nisl, vulputate sed dapibus nec, tristique eu nisi.</p><form class="to_tm_button" action="http://thoughtmesh.net"><button class="btn btn-primary" type="submit">ThoughtMesh home page</button></form>',
                title: 'What is ThoughtMesh?',
                className: 'thoughtmesh_bootbox',
                animate: ( (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) ? false : true )// Panel is unclickable if true for iOS
            });
        	$(this).blur();
        });
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