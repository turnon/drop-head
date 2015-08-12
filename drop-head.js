(function ($) {

    // css class help to get th
    var class_drop = '.drop-head';
    var class_list = '.dropp-head-list';
    var class_list_checkbox = '.drop-head-box';
    var class_slide = '.drop-head-slide';
    
    var slide_sign ={
        on : '&or;',
        off : '&and;'
    };
    
    String.prototype.inHtml = function(){
        if(!this.inHtmlStr){
            this.inHtmlStr = this.valueOf().replace(/^(\.|\#)/,'');
        }
        return this.inHtmlStr;
    };
    
    var intv = 1000;

    function addStyle(){        
        var $style = $('<style type="text/css">'
            + class_list + ' {list-style-type : none; padding : 0; font-size : 0.8em; font-weight : normal} '
            + class_slide + ' {font-weight : normal; text-align : left; cursor : pointer} '
            + '</style>');
        $('head:eq(0)').append($style); 
    }
    
    function buildListOnCol(idx, $t){
        
        var td_content_set = {};
        
        $t.find('tbody tr').each(function(){
            var $td = $(this).find('td:nth-child(' + idx +')');
            td_content_set[$td.text()] = null;
        });
        
        var $ul = $('<ul class="' + class_list.inHtml() + '" title="' +idx+  '"  />');
        
        var td_content_arr = Object.keys(td_content_set);
        
        td_content_arr.sort().each(function(content){
            var $li = $('<li/>').append('<input type="checkbox" class="' +class_list_checkbox.inHtml()+ '"/>').append($('<span/>').text(content));
            $ul.append($li);
        });
        
        var $h = $t.find('th:nth-child(' + idx +')');       
        
        $ul.hide();
        
        var $div = $('<div/>');
        
        $div.append($ul).append('<div class="'+ class_slide.inHtml() +'" ><span title="on">'+ slide_sign.on +'</span></div>');
        
        $h.append($div);
        
    }
    
    function buildList($t){
        cols.each(function(i){
            buildListOnCol(i, $t);
        });
    }
    
    function toggleButton($btn){
        var $span = $btn.is('span')?$btn:$btn.find('span');
        if($span.attr('title') === 'on'){
            $span.html(slide_sign.off);
            $span.attr('title','off');
        }else{
            $span.html(slide_sign.on);
            $span.attr('title','on');
        }
    }

    /*
     * init
     */
    var head = {};
    
    var $t = $(class_drop).closest('table');
    
    $t.find('thead th').each(function(idx){
        if($(this).is(class_drop) || $(this).find(class_drop).length > 0){
            var nth_child = idx + 1;
            head[nth_child] = null;
        }
    });
    
    var cols = Object.keys(head);
    
    if(cols.length > 0){
        addStyle();
        buildList($t);
    }    
    
    /*
     * add linstener
     */
    var $listen = $(class_drop).closest('table').parent();
    
    $listen.on('click', class_slide, function(e){
        var $btn = $(e.target);
        $btn.closest('th').find(class_list).toggle();
        toggleButton($btn);
    });
    
   
    $listen.on('click', 'th ' + class_list_checkbox, function(e){
        var $box = $(e.target);
        var content = $box.closest('li').text();
        
        var col = $box.closest('ul').attr('title');
        var n_child = 'td:nth-child(' + col +')';
        
        var wanted = ($box.attr('checked') === 'checked');
        
        var $rows = $box.closest('table').find('tbody tr');        

        $rows.each(function(){
            var $row = $(this);
            var $box_in_row = $row.find(':checkbox');
            var checked  = ($box_in_row.attr('checked') === 'checked');
            
            if($row.find(n_child).text() === content){                
                if(wanted && !checked){
                    $box_in_row.click();
                    $box_in_row.attr('checked','checked');
                }else if(!wanted && checked){
                    $box_in_row.click();
                    $box_in_row.attr('checked',null);
                }
            }
        });

    });
    
    
    /*
     * loop check
     */
    (function monitor(){
        if(cols.length > 0){
            var $drop = $(class_drop).closest('th');
            if($drop.find(class_list).length < 1){
                buildList($drop.closest('table'));
            }            
        }        
        setTimeout(monitor, intv);
    })();
    

    
})(jQuery);