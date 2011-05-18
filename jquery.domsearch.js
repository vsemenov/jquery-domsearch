/*
 * jQuery DOM search & filter plugin with highlighting
 * @version 0.4.1
 * @requires jQuery 1.3
 * @author Vladimir Semenov
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @example $('#search-field').domsearch({filter: '.content-item', highlight: true});
 */
;(function($) {
	/**
	 * Create plugin: bind search and filter method to text entry event on input field(s)
	 *
	 * @param opts  plugin options
	 */
	$.fn.domsearch = function(opts) {
		$.fn.domsearch.options = $.extend({}, $.fn.domsearch.defaults, opts);
	    return this.each(function() {
	        if($.fn.domsearch.options.focusSearch) {
	            $(this).focus();
	        }
	        $(this).keyup(function() {
				filter($(this).val());
			});
        });		
	};
	// default options
	$.fn.domsearch.defaults = {       
		highlight:          false,          // highlight matches
		highlightClass:     'highlight',    // CSS class name to use for highlighting
		searchIn:           '.item',        // selector for items to search and filter
		caseSensitive:      false,          // perform case sensitive search
		focusSearch:        true,           // focus on search field on load
		minLength:          2               // minimum input length before searching
	};
	$.fn.domsearch.options = {};
	/**
	 * Filter searchIn nodes.
	 *
	 * @param value keyword(s) to search and filter for
	 */
	function filter(value) {
		$($.fn.domsearch.options.searchIn).each(function() {
			if(value.length === 0) {
				$(this).show();
				unhighlightDOMTree($.fn.domsearch.options.searchIn);
			} 
			else if(value.length >= $.fn.domsearch.options.minLength) {
			    if(find(this, value)) {
				    $(this).hide();
			    } else {
				    $(this).show();
				    if($.fn.domsearch.options.highlight) {
                        highlight(this, value);
                    }
			    }
			}
		});
	}
	/**
	 * Searches for a text match within DOM node
	 *
	 * @param o     DOM object to search in
	 * @param value keyword(s) to search and filter for
	 */	
	function find(o, value) {	
	    var matchExp = null;
	    if($.fn.domsearch.options.caseSensitive) {
	        matchExp = value;
	    } else {
            matchExp = new RegExp(value, "i");
        }
        return (0 > $(o).text().search(matchExp));
	}
	/**
	 * Highlights search terms within DOM node
	 *
	 * @param o     DOM object
	 * @param value keyword(s) to search and filter for
	 */		
	function highlight(o, value) {	
        unhighlightDOMTree(o);
        highlightDOMTree(o, value);
	}
	/**
	 * Removes highlighting from search terms
	 *
	 * @param o     DOM object
	 */			
	function unhighlightDOMTree(o) {
        $('.'+$.fn.domsearch.options.highlightClass, o).each(function() {
            var parent = this.parentNode;
            parent.replaceChild(this.firstChild, this);
            parent.normalize();
        }).end();	
	}
	/**
	 * Adds highlighting to search terms
	 *
	 * @param o     DOM object
	 */				
    function highlightDOMTree(o, value) {
        value = value.toLowerCase();    
        if(o.childNodes && o.nodeType === Node.ELEMENT_NODE) {
            for(i = 0; i < o.childNodes.length; i++) {
                i += highlightDOMTree(o.childNodes[i], value);
            }
        }  
        else if(o.nodeType === Node.TEXT_NODE) {
            if(0 <= (i = o.data.toLowerCase().indexOf(value))) {
                var span = document.createElement('span');
                var start = o.splitText(i);
                start.splitText(value.length);
                span.appendChild(start.cloneNode(true));
                span.className = $.fn.domsearch.options.highlightClass;
                start.parentNode.replaceChild(span, start);
                return 1;
            }
        }
        return 0;
    }
})(jQuery);
