(function( $ ) {
	
	var defaults = {
        'results': [
        {
            'text':"Articles",
            'keys':["Related Keywords"]
        },
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
        }],
        'style':{
            'color':'#26d19d',
            'bg': ''
        }
	};  	
	
    $.fn.thoughtmesh = function(options) {
        var self = this;
        var $this = $(this);
        var opts = $.extend( {}, defaults, options );
        var base = opts.style.color;

        var adjustColor = function  (col, amt) {
          
            var usePound = false;
          
            if (col[0] == "#") {
                col = col.slice(1);
                usePound = true;
            }
         
            var num = parseInt(col,16);
         
            var r = (num >> 16) + amt;
         
            if (r > 255) r = 255;
            else if  (r < 0) r = 0;
         
            var b = ((num >> 8) & 0x00FF) + amt;
         
            if (b > 255) b = 255;
            else if  (b < 0) b = 0;
         
            var g = (num & 0x0000FF) + amt;
         
            if (g > 255) g = 255;
            else if (g < 0) g = 0;
         
            return (usePound?"#":"") + ('0'+r.toString(16)).slice(-2) + ('0'+b.toString(16)).slice(-2) + ('0'+g.toString(16)).slice(-2);
        }

        var getRelated = function(tag) {
            return {
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
            }
        };

        var openModal = function() {
            var self = this;
            var $this = $(this);
            var tag = $(this).attr('tm-tag');
            var results = getRelated(tag);

            bootbox.dialog({
                message: '<div id="bootbox-thoughtmesh-content" class="heading_font"></div>',
                title: 'Pages related to "'+tag+'"',
                className: 'thoughtmesh_bootbox',
                animate: ( (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) ? false : true )// Panel is unclickable if true for iOS
            });
            $('.bootbox-close-button').empty();

            $('.bootbox').find( '.modal-title' ).addClass( 'heading_font' );

            var $box = $('<div />').addClass('container-fluid').appendTo($('#bootbox-thoughtmesh-content'));
            $('<div>Scalar Pages</div>').appendTo($box).addClass('h5 heading_font col-md-12').wrap($('<div />').addClass('row'));
            var $internal = $('<div />').addClass('row tm-scroll').appendTo($box);
            for(var i in results['internal']) {
                var entry = results['internal'][i];
                $('<div></div>').appendTo($internal).html(entry.author+',&nbsp;"'+entry.title+'"').css('color','#aaa').addClass('col-md-12');
                $('<div></div>').appendTo($internal).html(entry.lexia).css('color',base).addClass('col-md-11 col-md-offset-1');
                $('<div></div>').appendTo($internal).html(entry.excerpt).addClass('col-md-11 col-md-offset-1 tm-excerpt');
            }
            $('<div />').html('<hr />').addClass('row').wrapInner($('<div />').addClass('col-md-12')).appendTo($box);

            $('<div>Thoughtmesh Lexias</div>').appendTo($box).addClass('h5 heading_font col-md-12').wrap($('<div />').addClass('row'));
            var $external = $('<div />').addClass('row tm-scroll').appendTo($box);
            for(var i in results['external']) {
                var entry = results['external'][i];
                $('<div></div>').appendTo($external).html(entry.author+',&nbsp;"'+entry.title+'"').css('color','#aaa').addClass('col-md-12');
                $('<div></div>').appendTo($external).html(entry.lexia).css('color',base).addClass('col-md-11 col-md-offset-1');
                $('<div></div>').appendTo($external).html(entry.excerpt).addClass('col-md-11 col-md-offset-1 tm-excerpt');
            }

            $('.tm-excerpt').css('overflow','hidden');
            $('.tm-excerpt').css('display','-webkit-box');
            $('.tm-excerpt').css('-webkit-line-clamp','3');
            $('.tm-excerpt').css('-webkit-box-orient','vertical');
            $('.tm-scroll').css('overflow-x','hidden');
            $('.tm-scroll').css('overflow-y','auto');
            $('.tm-scroll').css('max-height','300px');
        };

        $this.append('<div id="tm_footer" class="col-md-9 col-sm-12 col-xs-12"></div>');
        for(var i in opts.results) {
            var $row = $("<div class='row'><div class='tm-tag col-md-2 col-sm-2 col-xs-4'></div><div class='tm-article col-md-5 col-xs-8 col-sm-6'></div><div class='tm-key col-md-4 col-sm-4 hidden-xs'></div></div>");
            var $article = $row.children('.tm-article');

            if(typeof(opts.results[i].author) != 'undefined'){
                $("<span class='tm-author'></span>").html(opts.results[i].author+',&nbsp;').appendTo($article);
            }
            $("<span class='tm-text'></span>").html(opts.results[i].text).appendTo($article);

            $row.children('.tm-tag').html(('<span class="glyphicon glyphicon-tag"></span>').repeat(opts.results[i].keys.length));

            var keyhtml = '';
            $keys = $row.children('.tm-key');

            for(var j in opts.results[i].keys) {
                if(j!=0)
                    $keys.append(',&nbsp;');
                var $key = $('<span></span>');
                $key.addClass('tm-link');
                $key.html(opts.results[i].keys[j]);
                $key.attr('tm-tag',opts.results[i].keys[j]);
                $key.appendTo($keys);
            }
            $("#tm_footer").append($row);
        }
        $('.tm-link:first').removeClass('tm-link');
        $('.tm-link').click(openModal);
        $('.tm-tag').wrapInner('<div style="float:right"></div>');
        $('.tm-tag:first').empty();

        //Styling w/o an external sheet
        $('.tm-link').css('cursor','pointer');
        $('.tm-link').hover(function() {
            $(this).css('text-decoration','underline');
        },function() {
            $(this).css('text-decoration','none');
        });
        $('.tm-article').css('color',adjustColor(base,-60));
        $('.tm-key').css('color',base);
        $('.tm-tag').css('color',base);
        $('#tm_footer').css('border','3px solid '+base);
        $('#tm_footer').css('border-radius','10px');
        $('#tm_footer').css('padding','10px 0');
        $('.tm-author').css('font-weight','bold');
        $('.tm-text:first, .tm-key:first').css('color','#aaa');


    }
}( jQuery ));