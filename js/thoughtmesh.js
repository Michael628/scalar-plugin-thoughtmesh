/**
 * @requires bootbox
 */
var telamon = {};
var thoughtMesh = {};
(function($) {

    var defaults = {
        'namespace': 'thoughtmesh',
        'platform':'scalar',
        'render':true,
        'data':{},
        'externalTags':[],
        'skip_words': ['rsquo', 'lsquo', 'rdquo', 'ldquo', 'nbsp', 'is', 'through', 'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us']
    };
    
    var strip_tags = function(input, allowed) { // http://locutus.io/php/strings/strip_tags/
        allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
        var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return input.replace(commentsAndPhpTags, '').replace(tags, function($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
        });
    };
    
    var current_script_path = function() {
    	var elements = document.getElementsByTagName("script");
    	for (var i = 0; i < elements.length; i++) {
    		if (-1 != elements[i].src.indexOf('thoughtmesh.js')) return elements[i].src.replace('thoughtmesh.js','');
    	}
    	return false;
    };
    
    defaults.proxy_url = current_script_path().replace('js/','');
    if (-1 != defaults.proxy_url.indexOf('?')) defaults.proxy_url = defaults.proxy_url.substr(0, defaults.proxy_url.indexOf('?'));
    defaults.proxy_url += 'proxy.php';

    //  Globally visible function called by implementing DOM element.
    $.fn.thoughtmesh = function(options) {
    	
        var $this = $(this);
        var opts = $.extend({}, defaults, options);
        
        // List excerpts here and there based on a tag
        var tagModal = function() {
            var $this = $(this);
            var tag = $this.data('tm-tag');
            bootbox.dialog({
                size: 'large',
                message: '<div id="bootbox-thoughtmesh-content" class="heading_font"></div>',
                title: 'ThoughtMesh pages related to "' + tag + '"',
                className: 'thoughtmesh_bootbox',
                animate: ((navigator.userAgent.match(/(iPod|iPhone|iPad)/)) ? false : true) // Panel is unclickable if true for iOS
            });
            var $box = $('.thoughtmesh_bootbox');
            var $content = $box.find('#bootbox-thoughtmesh-content');
            $content.append('<h5>Loading...</h5>');
            $box.find('.modal-body').height(parseInt($(window).height()) * 0.83);
            $box.find('.bootbox-close-button').empty();
            $box.find('.modal-title').addClass('heading_font');
            // Get live data because the data might have changed since last saved to Scalar's resources table
            $.getScript(opts.proxy_url+'?tag=' + encodeURIComponent(tag) + '&documentid=0&groupid=0', function() {
                outsideLexiasFun();
                if ('undefined' == typeof(outsideLexiasObj)) {
                    alert('Something went wrong attempting to get tag information from ThoughtMesh. Please try again');
                    return false;
                }
                $content.empty();
                var $container = $('<div />').addClass('container-fluid').appendTo($content);
                var $tabs = $('<ul class="nav nav-tabs" role="tablist"><li role="presentation" class="active"><a href="#out" aria-controls="out" role="tab" data-toggle="tab">Excerpts out</a></li><li role="presentation"><a href="#here" aria-controls="here" role="tab" data-toggle="tab">Excerpts here</a></li></ul>').appendTo($container);
                var $tab_content = $('<div class="tab-content"><div role="tabpanel" class="tab-pane active" id="out"></div><div role="tabpanel" class="tab-pane" id="here"></div></div>').appendTo($container);
                // Build table of data from text internal to the platform related to tag
                var $internal = $('<div />').addClass('row').appendTo($tab_content.find('div:last'));
                $internal.text('This feature has yet to be implemented.').css('margin-left',0);
                /*
                for (var j in obj.data.internal) {
                        var lexias = {};
                        for (var k in obj.data.internal[j].lexias) {
                            if (-1 == obj.data.internal[j].lexias[k].tags.indexOf(tag)) continue;
                            lexias[k] = obj.data.internal[j].lexias[k];
                        };
                        if ($.isEmptyObject(lexias)) continue;
                        $('<div></div>').appendTo($internal).html(obj.data.internal[j].author + ',&nbsp;"<a href="' + obj.data.internal[j].url + '" target="_blank">' + obj.data.internal[j].title + '</a>"').addClass('col-md-12 tm-header');
                        for (var k in lexias) {
                            if (opts.page_id==lexias[k].lexiaId) continue;
                            $('<div></div>').appendTo($internal).html('<a href="' + lexias[k].url + ((lexias[k].anchor.length)?'#'+lexias[k].anchor:'') + '" target="_blank">' + lexias[k].heading + '</a>').addClass('col-md-11 col-md-offset-1 tm-anchor body_font');
                            $('<div></div>').appendTo($internal).html(strip_tags(lexias[k].excerpt)).addClass('col-md-11 col-md-offset-1 tm-excerpt body_font');
                        };
                        if ($internal.is(':empty')) {
                          $('<div>There are no related pages for this tag in this document.<br /><br /></div>').appendTo($internal).addClass('col-md-12');
                        };
                };
                */
                // Build table of external tag-related data (from thoughtmesh)
                var $external = $('<div />').addClass('row').appendTo($tab_content.find('div:first'));
                if ($.isEmptyObject(outsideLexiasObj)) $('<div>There are outside pages for this tag.</div>').appendTo($external).addClass('col-md-12');
                for (var j in outsideLexiasObj) {
                    var entry = outsideLexiasObj[j];
                    $('<div></div>').appendTo($external).html(entry.author + ',&nbsp;"<a href="' + entry.url + '" target="_blank">' + entry.title + '</a>"').addClass('col-md-12 tm-header');
                    for (var k in entry['lexias']) {
                        var lexia = entry['lexias'][k];
                        $('<div></div>').appendTo($external).html('<a href="' + entry.url + ((lexia.anchor.length)?'#'+lexia.anchor:'') + '" target="_blank">' + lexia.heading + '</a>').addClass('col-md-11 col-md-offset-1 tm-anchor body_font');
                        $('<div></div>').appendTo($external).html(strip_tags(lexia.excerpt).trim()).addClass('col-md-11 col-md-offset-1 tm-excerpt body_font');
                    }
                };
                $('<div class="row">&nbsp;</div>').appendTo($container);
            });
        };

        var renderScalar = function() {
        	console.log('Rendering Scalar');
        	console.log(opts);
            // Plugin shell
            var $wrapper = $('<div class="tm_footer container-fluid"></div>').appendTo($this.hide().empty().fadeIn('slow'));
            var $logo = $('<div class="tm_logo caption_font">ThoughtMesh &nbsp; <a href="javascript:void(null);" class="glyphicon glyphicon-question-sign" title="What is ThoughtMesh?"></a></div>').appendTo($this);
            var $tags = $('<div class="tm_doc_tags caption_font"><b>Tags:</b>&nbsp; '+opts.data.internal.tags.join(', ')+' &nbsp; <a href="javascript:void(null);" class="glyphicon glyphicon-question-sign" title="Edit this document\'s tags"></a></div>').appendTo($this);
            if ($.isEmptyObject(opts.data.external)) {
                var $header = $('<div class="row"><div class="col-xs-12 tm-no-match">Unfortunately, no pages in the ThoughtMesh network match\ the tags for this Scalar book.</div></div>').appendTo($wrapper);
            } else {
                var $header = $("<div class='row'><div class='col-md-2 col-sm-2 col-xs-2'></div><div class='col-md-6 col-sm-6 col-xs-10'><div class=\"tm-header\">Related documents</div></div><div class='col-md-4 col-sm-4 hidden-xs'><div class=\"tm-header\">Related keywords</div></div></div>").appendTo($wrapper);
            };
            // Opens Information box modal
            $logo.find('.glyphicon:first').click(function() {
                bootbox.dialog({
                    message: '<p>ThoughtMesh is an unusual model for publishing and discovering scholarly papers online. It gives readers a tag-based navigation system that uses keywords to connect excerpts of essays published on different Web sites.</p><p>Add your Scalar book to the mesh, and ThoughtMesh gives readers a tag cloud that enables nonlinear access to text excerpts. You can navigate across excerpts both within the original essay and from related essays distributed across the mesh.</p>By clicking tags in the ThoughtMesh plugin you can view a list of excerpts of other pages of this book or of other articles similarly tagged, and jump right to one of those sections.</p><form class="to_tm_button" action="http://thoughtmesh.net" target="_blank"><button class="btn btn-primary" type="submit">ThoughtMesh home page</button></form>',
                    title: 'What is ThoughtMesh?',
                    className: 'thoughtmesh_bootbox',
                    animate: ((navigator.userAgent.match(/(iPod|iPhone|iPad)/)) ? false : true) // Panel is unclickable if true for iOS
                });
                $(this).blur();
            });
            // List most relevant articles and their tags
            for (var i in opts.data.external) {
                var $row = $('<div class="row"><div class="tm-tag col-md-2 col-sm-2 col-xs-2"></div><div class="tm-article col-md-6 col-sm-6 col-xs-10"></div><div class="tm-key col-md-4 col-sm-4 hidden-xs"></div></div>').appendTo($wrapper);
                var $article = $row.children('.tm-article:first');
                // Author
                if (opts.data.external[i].author.length) $("<span class='tm-author'></span>").html(opts.data.external[i].author + ',&nbsp;').appendTo($article);
                // Title
                $('<a href="' + opts.data.external[i].url + '" target="_blank" class="tm-text"></a>').html(opts.data.external[i].title).appendTo($article);
                // Tags
                var their_tags = opts.data.external[i].tags;
                for (var j in opts.data.external[i].matched_tags) {
                    var $glyph = $('<a href="javascript:void(null);" class="glyphicon glyphicon-tag" data-toggle="tooltip" data-placement="top" title="' + opts.data.external[i].matched_tags[j] + '"></a>').appendTo($row.children('.tm-tag'));
                    $glyph.data('tm-tag', opts.data.external[i].matched_tags[j]);
                };
                $row.children('.tm-tag').children().click(tagModal);
                // Keywords
                var keyhtml = '';
                $keys = $row.children('.tm-key');
                for (var j = 0; j < their_tags.length; j++) {
                    if (0 != j) $keys.append(',&nbsp;');
                    var $key = $('<a href="javascript:void(null);" class="tm-link"></a>');
                    $key.html(their_tags[j]);
                    $key.data('tm-tag', their_tags[j]);
                    $key.appendTo($keys);
                };
                $keys.children().click(tagModal);
            };
            // Load dependancies
            $('[data-toggle="tooltip"]').tooltip();
            $.getScript(current_script_path()+'bootbox.min.js', function(data, textStatus, jqxhr) {});
        };

        var renderWordpress = function() {
        	console.log('Rendering WordPress');
            console.log(opts);
            // Plugin shell
            var $wrapper = $('<div class="tm_footer container-fluid"></div>').appendTo($this.hide().empty().fadeIn('slow'));
            var $logo = $('<div class="tm_logo caption_font">ThoughtMesh &nbsp; <a href="javascript:void(null);" class="glyphicon glyphicon-question-sign" title="What is ThoughtMesh?"></a></div>').appendTo($this);
            var $tags = $('<div class="tm_doc_tags caption_font"><b>Tags:</b>&nbsp; '+opts.data.internal.tags.join(', ')+' &nbsp; <a href="javascript:void(null);" class="glyphicon glyphicon-question-sign" title="Edit this document\'s tags"></a></div>').appendTo($this);
            if ($.isEmptyObject(opts.data.external)) {
                var $header = $('<div class="row"><div class="col-xs-12 tm-no-match">Unfortunately, no pages in the ThoughtMesh network match\ the tags for this Scalar book.</div></div>').appendTo($wrapper);
            } else {
                var $header = $("<div class='row'><div class='col-md-2 col-sm-2 col-xs-2'></div><div class='col-md-6 col-sm-6 col-xs-10'><div class=\"tm-header\">Related documents</div></div><div class='col-md-4 col-sm-4 hidden-xs'><div class=\"tm-header\">Related keywords</div></div></div>").appendTo($wrapper);
            };
            // Opens Information box modal
            $wrapper.find('.icon-tag:first').click(function() {
                bootbox.dialog({
                    message: '<p>ThoughtMesh is an unusual model for publishing and discovering scholarly papers online. It gives readers a tag-based navigation system that uses keywords to connect excerpts of essays published on different Web sites.</p><p>Add your Scalar book to the mesh, and ThoughtMesh gives readers a tag cloud that enables nonlinear access to text excerpts. You can navigate across excerpts both within the original essay and from related essays distributed across the mesh.</p>By clicking tags in the ThoughtMesh plugin you can view a list of excerpts of other pages of this book or of other articles similarly tagged, and jump right to one of those sections.</p><form class="to_tm_button" action="http://thoughtmesh.net" target="_blank"><button class="btn btn-primary" type="submit">ThoughtMesh home page</button></form>',
                    title: 'What is ThoughtMesh?',
                    className: 'thoughtmesh_bootbox',
                    animate: ((navigator.userAgent.match(/(iPod|iPhone|iPad)/)) ? false : true) // Panel is unclickable if true for iOS
                });
                $(this).blur();
            });
            // List most relevant articles and their tags
            for (var i in opts.data.external) {
                var $row = $('<div class="row"><div class="tm-tag col-md-2 col-sm-2 col-xs-2"></div><div class="tm-article col-md-6 col-sm-6 col-xs-10"></div><div class="tm-key col-md-4 col-sm-4 hidden-xs"></div></div>').appendTo($wrapper);
                var $article = $row.children('.tm-article:first');
                // Author
                $("<span class='tm-author'></span>").html(opts.data.external[i].author + ',&nbsp;').appendTo($article);
                // Title
                $('<a href="' + opts.data.external[i].url + '" target="_blank" class="tm-text"></a>').html(opts.data.external[i].title).appendTo($article);
                // Tags
                var their_tags = opts.data.external[i].tags;
                for (var j in opts.data.external[i].matched_tags) {
                    var $glyph = $('<a href="javascript:void(null);" class="icon-tag" data-toggle="tooltip" data-placement="top" title="' + opts.data.external.lexias[i].matched_tags[j] + '"></a>').appendTo($row.children('.tm-tag'));
                    $glyph.data('tm-tag', opts.data.external[i].matched_tags[j]);
                };
                $row.children('.tm-tag').children().click(tagModal);
                // Keywords
                var keyhtml = '';
                $keys = $row.children('.tm-key');
                for (var j = 0; j < their_tags.length; j++) {
                    if (0 != j) $keys.append(',&nbsp;');
                    var $key = $('<a href="javascript:void(null);" class="tm-link"></a>');
                    $key.html(their_tags[j]);
                    $key.data('tm-tag', their_tags[j]);
                    $key.appendTo($keys);
                };
                $keys.children().click(tagModal);
            };
            $.getScript(current_script_path()+'bootbox.min.js', function(data, textStatus, jqxhr) {});
        }        

        // Set internal data for Scalar (Wordpress handles this in the plugin)
        if ('scalar' == opts.platform.toLowerCase() && $.isEmptyObject(opts.data)) {
        	opts.data = {};
            $.fn.thoughtmesh.scalarSetInternalData({
                    callback: function(obj) {
                    	opts.data.internal = obj;
                        $.fn.thoughtmesh.setExternalData({
                            'documentId': 0,
                            'tags': obj.tags,
                            callback: function(obj) {
                            	opts.data.external = obj;
                            	$this.thoughtmesh(opts);
                            }
                        });
                    }
            });
            return;
        } else if ('wordpress' == opts.platform.toLowerCase() && $.isEmptyObject(opts.data)) {
        	opts.data = {};
        	opts.data.internal = {};
        	opts.data.internal.tags = opts.externalTags;
            $.fn.thoughtmesh.setExternalData({
                'documentId': 0,
                'tags': opts.externalTags,
                callback: function(obj) {
                	opts.data.external = obj;
                	$this.thoughtmesh(opts);
                }
            });        	
        };
        
        // Scalar or Wordpress?
        if ('undefined' == typeof(opts.render) || opts.render) {
            switch(opts.platform) {
                case 'scalar':
                    renderScalar();
                    break;
                case 'wordpress':
                    renderWordpress();
                    break;
                default:
                	alert('Invalid "render" platform');
            };
        } else {
        	return;
        };
        
    }; // $.fn.thoughtmesh

    // returns most common tags from text provided
    $.fn.thoughtmesh.getLexiaTags = function(text, maxTags, options) {
        var opts = $.extend({}, defaults, options);
        if(typeof(maxTags) == 'undefined') maxTags = 3;
        // if (-1!=window.location.href.indexOf('lireneocalhost')) 
            // return ['art','performance','media'];  // Temp for demo
        // Get word count
        if (!text.length) return text;
        var words = text.match(/\b\w+\b/g);
        if (!words.length) return [];
        var counts = {};
        for (var i = 0, len = words.length; i < len; i++) {
            var word = words[i].toLowerCase();
            if (word.length < 4) continue;  // magic number
            if (-1 != opts.skip_words.indexOf(word)) continue;
            counts[word] = (counts[word] || 0) + 1;
        };
        // Get top words
        var sortable = [];
        for (var word in counts) {
            sortable.push([word, counts[word]]);
        };
        if (!sortable.length) return sortable;
        sortable.sort(function(a, b) {
            return b[1] - a[1]
        });
        var tags = sortable.slice(0, maxTags);
        var to_return = [];
        for (var j = 0; j < tags.length; j++) {
            to_return.push(tags[j][0]);
        }
        return to_return;
    };

    $.fn.thoughtmesh.scalarSetInternalData = function(options) {
        var opts = $.extend({}, defaults, options);
        var parent = opts.parent;
        if ('undefined' == typeof(opts.parent) && $('link#parent').length) {
            parent = $('link#parent').attr('href');
        } else if ('undefined' == typeof(opts.parent)) {
            alert('Can\'t find "parent" string in order to set internal data');
            return;
        };
        if ('undefined' == typeof(opts.skip_words)) {
            opts.skip_words = ['nbsp', 'is', 'through', 'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'];
        };
        // !!!WP what will these (book_name, book_id, book authors) look like? Just provide using options?
        if ('undefined' == typeof(opts.book_name)) {
            opts.book_name = ($('[property="og:site_name"]').length) ? $('[property="og:site_name"]').attr('content') : '(No title)';
        };
        if ('undefined' == typeof(opts.book_id)) {
            opts.book_id = ($('link#book_id').length) ? parseInt($('link#book_id').attr('href')) : 0;
        };
        if ('undefined' == typeof(opts.book_authors)) {
            opts.book_authors = [];
            $('[rel="sioc:has_owner"]').each(function() {
                var user_uri = $(this).attr('href');
                user_uri = user_uri.substr(0, user_uri.indexOf('#'));
                var fullname = $('[resource="' + user_uri + '"]:first').children('[property="foaf:name"]').text();
                opts.book_authors.push(fullname);
            });
            opts.book_authors = opts.book_authors.join(',');
        };
        if ($.isEmptyObject(localStorage[opts.namespace])) {
            var obj = {
                'bookId': opts.book_id,
                'documentGroups': {},
                'internal': {},
                'external': {}
            };
        } else {
            var obj = JSON.parse(localStorage[opts.namespace]);
        };
        var book_urn = 'urn:scalar:book:' + opts.book_id;

        // Builds Tags for entire document
        var getDocumentTags = function(lexias) {
            // Get word count
            var counts = {};
            for (var i = 0; i < lexias.length; i++) {
                for (var j = 0; j < lexias[i].tags.length; j++) {
                    var word = lexias[i].tags[j];
                    if (-1 != opts.skip_words.indexOf(word)) continue;
                    counts[word] = (counts[word] || 0) + 1;
                };
            };
            // Get top words
            var sortable = [];
            for (var word in counts) {
                sortable.push([word, counts[word]]);
            };
            if (!sortable.length) return sortable;
            sortable.sort(function(a, b) {
                return b[1] - a[1]
            });
            var tags = sortable.slice(0, 3);
            var to_return = [];
            for (var j = 0; j < tags.length; j++) {
                to_return.push(tags[j][0]);
            }
            return to_return;
        };

        obj.internal[book_urn] = {
            "documentId": opts.book_id,
            "title": opts.book_name,
            "author": opts.book_authors,
            "url": parent,
            "tags": [],
            "lexias": [],
            "tmp":window.location.href
        };

        if ('/' != parent.substr(parent.length - 1, 1)) parent += '/';
        // !!!WP how will this info be pulled?
        var url = parent + 'rdf/instancesof/page?format=json';
        $.getJSON(url, function(json) {
            if ($.isEmptyObject(json)) return;
            for (var uri in json) {
                // Get lexia text
                if ('undefined' == typeof(json[uri]['http://rdfs.org/sioc/ns#content'])) continue;
                var text = strip_tags(json[uri]['http://rdfs.org/sioc/ns#content'][0].value);
                var title = json[uri]['http://purl.org/dc/terms/title'][0].value;
                var version_urn = json[uri]['http://scalar.usc.edu/2012/01/scalar-ns#urn'][0].value;
                var version_id = parseInt(version_urn.substr(version_urn.lastIndexOf(':') + 1));
                var page_uri = json[uri]['http://purl.org/dc/terms/isVersionOf'][0].value;
                var page_urn = json[page_uri]['http://scalar.usc.edu/2012/01/scalar-ns#urn'][0].value
                var page_id = parseInt(page_urn.substr(page_urn.lastIndexOf(':') + 1));
                var tags = $.fn.thoughtmesh.getLexiaTags(text);
                if (!tags.length) continue;
                var lexia = {
                    "lexiaId": version_id,
                    "anchor": "",
                    "url": page_uri,
                    "heading": title,
                    "excerpt": ((text.length > 100) ? text.substr(0, 100) + ' ...' : text),
                    "tags": tags
                };
                obj.internal[book_urn].lexias.push(lexia);
            };
            // Builds tags for book from page tags
            obj.internal[book_urn].tags = getDocumentTags(obj.internal[book_urn].lexias);
            if ('undefined' != typeof(opts.callback)) {
                opts.callback({
                    'documentId': obj.internal[book_urn].documentId,
                    'tags': obj.internal[book_urn].tags
                });
            };
        });
    }; // $.fn.thoughtmesh.scalarSetInternalData

    // Builds data from connections through thoughtmesh
    $.fn.thoughtmesh.setExternalData = function(options, next) {
        var opts = $.extend({}, defaults, options);
        if ('undefined'==typeof(opts.data)) opts.data = {};
        if ('undefined'==typeof(opts.data.external)) opts.data.external = {};
        var document_id = 0;
        var group_id = 0;
        var tags = opts.tags;
        var tags_to_send = [];
        if ('undefined' == typeof(next)) next = 3;
        switch (next) {
            case 3:
                tags_to_send = tags.slice();
                next = 2.1;
                break;
            case 2.1:
                tags_to_send = tags.slice(0, 2);
                next = 2.2;
                break;
            case 2.2:
                tags_to_send = tags.slice(1, 3);
                next = 2.3;
                break;
            case 2.3:
                tags_to_send = [tags[0], tags[2]];
                next = 1.1;
                break;
            case 1.1:
                tags_to_send = [tags[0]];
                next = 1.2;
                break;
            case 1.2:
                tags_to_send = [tags[1]];
                next = 1.3;
                break;
            case 1.3:
                tags_to_send = [tags[2]];
                next = 0;
                break;
        };
        $.getScript(opts.proxy_url+'?tag=' + encodeURIComponent(tags_to_send.join(',')) + '&documentid=' + document_id + '&groupid=' + group_id, function() {
            outsideLexiasFun();
            if ('undefined' == typeof(outsideLexiasObj)) {
                alert('Something went wrong attempting to get tag information from ThoughtMesh. Please try again');
                return false;
            };
            var count = 0;
            for (var j in outsideLexiasObj) {
            	var _obj = outsideLexiasObj[j];
            	_obj.tags = tags_to_send.slice();
            	_obj.matched_tags = tags_to_send.slice();
            	if ('undefined'==typeof(opts.data.external[j])) opts.data.external[j] = outsideLexiasObj[j];
            	for (var k in outsideLexiasObj[j].lexias) {
            		if ('undefined'==typeof(opts.data.external[j].lexias[k])) opts.data.external[j].lexias[k] = outsideLexiasObj[j].lexias[k];
            	}
            	if ('undefined'==typeof(opts.data.external[j].tags)) {
            		opts.data.external[j].tags = tags_to_send.slice(); 
            	} else {
            		opts.data.external[j].tags.concat(tags_to_send.slice());
            	};
                //if (2==tags_to_send.length && count > 0) break;  // For now, cap the number of results per match
                //if (1==tags_to_send.length && count > 0) break;  // For now, cap the number of results per match
                count++;
            };
            if (0 != next) {
                $.fn.thoughtmesh.setExternalData(options, next);
            } else if ('undefined' != typeof(opts.callback)) {
                opts.callback(opts.data.external);
            }
        });
    }; // $.fn.thoughtmesh.setExternalData
}(jQuery));