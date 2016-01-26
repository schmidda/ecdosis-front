/**
 * Object to represent manuscript viewer
 */
function msviewer(target,docid)
{
    this.target = target;
    this.docid = docid;
    this.inFullScreenMode = false;
    this.currPage = 0;
    var self = this;
    /**
     * Get the actual dimension value from a 123px value
     * @param d the parameter with "px" on the end
     * @return the dimension sans px as a number
     */
    this.dimen = function(d)
    {
        var pos = d.indexOf("px");
        return parseInt(d.substr(0,pos));
    };
    /**
     * Get the index of the next recto page
     * @param start the current page index
     * @return the page index of the next recto (or centre) or the same if no more
     */
    this.nextR = function( start )
    {
        if ( typeof start == "string" )
            start = parseInt(start);
        var i = start+1;
        var seenV = false;
        for ( ;i<this.pages.length;i++ )
        {
            if ( this.pages[i].o=='r' || this.pages[i].o=='c' )
                break;
            else if ( seenV )
                return i-1;
            else
                seenV = true;
        }
        return (i>=this.pages.length)?this.pages.length-1:i;
    };
    /**
     * Get the previous recto page
     * @param start the index of the current page 
     * @return the previous recto/verso or centre aligned index
     */
    this.prevR = function( start )
    {
        var i = (start==0)?0:start-1;
        var seenV = this.pages[start].o=='v';
        for ( ;i>0;i-- )
        {
            if ( this.pages[i].o=='r' || this.pages[i].o=='c' )
                break;
            else if ( seenV )
                return i;
            else
                seenV = true;
        }
        return (i<0)?start:i;
    };
    /**
     * Get the javascript object of the preceding left page
     * @param page the recto or centre aligned page index
     * @return the page object of the corresponding verso or null
     */
    this.leftPage = function( page )
    {
        if ( this.pages[page].o=='c' )
            return null;
        else if ( this.pages[page].o == 'r' )
        {
            page--;
            if ( page >= 0 )
            {
                if ( this.pages[page].o == 'c' )
                    return null;
                else if ( this.pages[page].o == 'v' )
                    return this.pages[page];
                else    // need verso, recto, not recto, recto
                    return null;
            }
            else 
                return null;
        }
        else
            return this.pages[page];
    };
    /**
     * Set the image height and width
     * @param jImg the jQuery image object
     * @param maxW its maximum width
     * @param maxH its maximum height
     * @param otherH 0 or the i=height of the other img
     */
    this.setImageWidth = function( jImg, maxW, maxH, otherH )
    {
        var h = jImg.height();
        var w = jImg.width();
        //console.log("w="+w+" h="+h);
        var scaledW = Math.round((maxH/h)*w);
        var scaledH = Math.round((maxW/w)*h);
        var realW = scaledW;
        var realH = maxH;
        if ( scaledW > maxW )
        {
            realW = maxW;
            realH = scaledH;
        }
        // force the 2 sides to be the same
        if ( otherH != 0 )
            realH = otherH;
        //console.log("realW="+realW+" realH="+realH);
        jImg.height(realH);
        jImg.css("max-width",maxW+"px");
        jImg.css("max-height",maxH+"px");
        return realW;
    };
    /**
     * Get the width of the left, right or centre image as available
     * @return the image width
     */
    this.oneImageWidth = function() {
        var jImg = jQuery("#ms-right img");
        if ( jImg == undefined || jImg.width()==0 )
            jImg = jQuery("#ms-left img");
        if ( jImg == undefined || jImg.width()==0 )
            jImg = jQuery("#ms-centre img");
        return (jImg!=undefined)?jImg.width():0;    
    };
    /**
     * Draw either side or the centre aligned image aleady set
     * @param side the side to redraw
     */
    this.redraw = function( side )
    {
        var vmargin = jQuery("#ms-wrapper").offset().top+jQuery("#ms-slider").outerHeight(true);
        var maxH = Math.round(Math.max(jQuery(window).height(),window.innerHeight)-vmargin);
        var maxW = jQuery("#ms-main").parent().width();
        if ( this.inFullScreenMode )
        {
            var gap = this.oneImageWidth()/20;
            maxW = jQuery(window).width() 
                - (jQuery("#left-nav").width()+jQuery("#right-nav").width() + gap*2);
        }
        maxW = Math.round(maxW/2);
        maxH = Math.round(maxH);
        switch ( side )
        {
            case 'v':
                this.setImageWidth(jQuery("#ms-left img"),maxW,maxH,0);
                break;
            case 'r':
                this.setImageWidth(jQuery("#ms-right img"),maxW,maxH,jQuery("#ms-left img").height());
                break;
            case 'c':
                this.setImageWidth(jQuery("#ms-centre img"),maxW*2,maxH);
                break;
        }
    };
    /**
     * Load an image and wait for it to load fully before you draw it
     * @param jImg the jQuery image object
     * @param side the side to redraw it on ('r', 'v' or 'c')
     */
    this.loadImage = function( jImg, side )
    {
        if ( jImg[0].complete )
        {
            self.redraw(side);
            jImg.fadeIn(250);
        }
        else
        {
            window.setTimeout(self.loadImage,10,jImg,side);
        }
    };
    /**
     * Draw both lhs and rhs page names only
     */
    this.drawPageNames = function(leftPage,rightPage) 
    {
        if ( leftPage != null )
            this.updatePageNo(jQuery("#ms-page-left"),leftPage);
        else
        {
            jQuery("#ms-page-left").text("");
            jQuery("#ms-page-left").siblings("span").remove();
        }
        if ( rightPage != null )
            this.updatePageNo(jQuery("#ms-page-right"),rightPage);
        else
        {
            jQuery("#ms-page-right").text("");
            jQuery("#ms-page-right").siblings("span").remove();
        }
    };
    /**
     * Resize and position the two navigation divs
     */
    this.resizeNavs = function()
    {
        var lNav = jQuery("#ms-left-nav");
        var rNav = jQuery("#ms-right-nav");
        var gap = Math.round(this.oneImageWidth()/20);
        if ( gap == 0 )
            gap = 20;
        if ( !this.inFullScreenMode )
        {
            lNav.css("left","-"+(gap+Math.round(lNav.width()))+"px");
            rNav.css("right","-"+(gap+Math.round(rNav.width()))+"px");
        }
        else
        {
            lNav.css("left",(gap+Math.round(lNav.width()))+"px");
            rNav.css("right",(gap+Math.round(rNav.width()))+"px");           
        }
        var resizeElem = jQuery("#ms-tools");
        resizeElem.css("right","-"+(gap+resizeElem.width())+"px");
    };
    /**
     * Set the page no separately (needed by slider)
     * @param elem the span whose content is to be set
     * @param page the page metadata object
     */
    this.updatePageNo = function(elem,page)
    {
        var content = page.n;
        if ( page.refs != undefined )
        {
            content += " (";
            elem.siblings("span").remove();
            var curr = elem;
            var refs = page.refs;
            for ( var i=0;i<refs.length;i++ )
            {
                curr.after('<span class="pageref" title="'+refs[i].title+'">'+refs[i].value+'</span>');
                curr = elem.siblings("span").last();
                if ( i < refs.length-1 )
                    curr.text(curr.text()+",");
            }
            curr.after("<span>)</span>");
        }
        else
            elem.siblings("span").remove();
        elem.text(content);
    }; 
    /**
     * Draw both lhs and rhs images
     */
    this.drawImgs = function(leftPage,rightPage) 
    {
        if ( leftPage != null )
        {
            if ( jQuery("#ms-left").css("display") == 'none' )
                jQuery("#ms-left").css("display","table-cell");
            var jImg = jQuery("#ms-left img");
            jImg.hide();
            jImg.attr("src","/corpix/"+this.docid+"/"+leftPage.src);
            this.loadImage( jImg, 'v' );
            this.updatePageNo(jQuery("#ms-page-left"),leftPage);
            if ( rightPage != null )
                jQuery("#ms-centre").css("display","none");
        }
        else
        { 
            jQuery("#ms-left img").removeAttr("src");
            jQuery("#ms-left").css("display",'none' );
            jQuery("#ms-page-left").text("");
            jQuery("#ms-page-left").siblings("span").remove();
        }
        if ( rightPage != null )
        {
            if ( rightPage.o=='c' )
            {
                var jImg = jQuery("#ms-centre img");
                jImg.attr("src","/corpix/"+this.docid+"/"+rightPage.src);
                jImg.hide();
                this.loadImage( jImg, 'c' );
                if ( jQuery("#ms-centre").css("display") == 'none' )
                    jQuery("#ms-centre").css("display","table-cell");
                jQuery("#ms-left").css("display","none");
                jQuery("#ms-right").css("display","none");
                this.updatePageNo(jQuery("#ms-page-right"),rightPage);
            }
            else
            {
                var jImg = jQuery("#ms-right img");
                if ( jQuery("#ms-right").css("display") == 'none' )
                    jQuery("#ms-right").css("display","table-cell");
                if ( jQuery("#ms-centre").css("display") == 'table-cell' )
                    jQuery("#ms-centre").css("display","none");
                jImg.hide();
                jImg.attr("src","/corpix/"+this.docid+"/"+rightPage.src);
                this.loadImage( jImg,'r');
                this.updatePageNo(jQuery("#ms-page-right"),rightPage);
            }
        }
        else
        {
            jQuery("#ms-right img").removeAttr("src");
            jQuery("#ms-centre img").removeAttr("src");
            jQuery("#ms-page-right").text("");
            jQuery("#ms-page-right").siblings("span").remove();
        }
        self.resizeNavs();
    };
    /**
     * Check that the page index in question is for a recto
     * @param page index into the pages array
     * @return the same index if recto already else the preceding recto
     */
    this.checkRecto = function( page )
    {
        if ( this.pages[page].o == 'r'||this.pages[page].o =='c' )
            return page;
        else 
        {
            var i=page;
            for ( ;i<this.pages.length;i++ )
            {
                if ( this.pages[i].o=='r' || this.pages[i].o=='c' )
                    break;
            }
            if ( i == page || i == this.pages.length )
            {
                i = page;
                for ( ;i>=0;i-- )
                    if ( this.pages[i].o=='r' || this.pages[i].o=='c' )
                        break;
                if ( i==-1||this.pages[i].o == 'v' )
                    return 0;
            }
            return i;
        }
    };
    /* actually create the view here */
    /* these functions are called by the event handlers directly */
    /* div that we hide and make visible contianing the magnified portion */
    this.magnifyDiv = undefined;
    /**
     * Get the image side based on current coordinates
     * @param x the document x-coordinate 
     * @param y the document y coordinate
     */
    this.getSide = function( x, y )
    {
        lImg = jQuery("#ms-left img");
        rImg = jQuery("#ms-right img");
        cImg = jQuery("#ms-centre img");
        var lOff = lImg.offset();
        var rOff = rImg.offset();
        var cOff = cImg.offset();
        if ( x >= lOff.left && x <= lOff.left+lImg.width()
            && y >= lOff.top && y <= lOff.top+lImg.height() )
            return 'r';
        else if ( x >= rOff.left && x <= rOff.left+rImg.width()
            && y >= rOff.top && y <= rOff.top+rImg.height() )
            return 'v';
        else if ( x >= cOff.left && x <= cOff.left+cImg.width()
            && y >= cOff.top && y <= cOff.top+cImg.height() )
            return 'c';
        else 
            return undefined;
    }
    /**
     * Set the background image of the magnify zone
     * @param m the magnify zone div
     * @param side the letter (r,v,c) of the current side
     * @param x the document x-coordinate 
     * @param y the document y coordinate
     */
    this.setBackground = function(m,side,x,y)
    {
        var img;
        switch ( side )
        {
            case 'r':
                img = jQuery("#ms-left img");
                break;
            case 'v':
                img = jQuery("#ms-right img")
                break;
            case 'c':
                img = jQuery("#ms-centre img")
                break;
        }
        var src = img.attr("src");
        var pos = img.offset();
        var iW = img.width();
        var iH = img.height();
        var localX = x - pos.left;
        var localY = y - pos.top;
        var xOff = (localX*100)/iW+11;
        var yOff = (localY*100)/iH+11;
        m.css("background-image",'url("'+src+'")');
        m.css("background-position",xOff+"% "+yOff+"%");
    }
    /**
     * Make the magnify zone visible
     * @param x the global x coordinate of the mouse click
     * @param y the global y coordinate of the mouse click
     * @param side the letter (r,v,c) of the side
     */
    this.makeZone = function( x, y, w, side )
    {
        var src = "";
        var pos;
        var iW, iH;
        var localX,localY;
        var origX = x;
        var origY = y;
        var xOff=0,yOff=0;
        self.magnifyDiv = jQuery("#ms-magnify-zone");
        x -= w/2;
        y -= w/2;
        self.magnifyDiv.width(w);
        self.magnifyDiv.height(w);
        self.magnifyDiv.offset({top:y,left:x});
        self.setBackground(self.magnifyDiv,side,origX,origY);
        self.magnifyDiv.css("visibility","visible");
    }
    /**
     * Move to the next recto/verson on the left
     */
    this.goLeft = function() {
        self.currPage = self.prevR(self.currPage);
        // NB currPage might be a verso if it's the last
        jQuery("#ms-slider").slider("value",self.currPage);
        var leftPg = self.leftPage(self.currPage);
        var rightPg = (self.pages[self.currPage].o=='r'
            ||self.pages[self.currPage].o=='c')
            ?self.pages[self.currPage]:null;
        self.drawImgs(leftPg,rightPg);                    
    };
    /**
     * Move to the next recto/verson on the right
     */
    this.goRight = function() {
        var oldR = self.currPage;
        self.currPage = self.nextR(self.currPage);
        // NB currPage might be a verso
        jQuery("#ms-slider").slider("value",self.currPage);
        var leftPg = self.leftPage(self.currPage);
        var rightPg = (self.pages[self.currPage].o=='r'
            ||self.pages[self.currPage].o=='c')
            ?self.pages[self.currPage]:null;
        self.drawImgs(leftPg,rightPg);
    };
    /**
     * Copy the generated html into the document and set everything up
     * @param html the html to append to the target
     */
    this.setHtml = function( html )
    {
        var tgt = jQuery("#"+this.target);
        tgt.append(html);
        jQuery("#ms-title").text(this.title);
        /**
         * Handle slider events
         */
        jQuery("#ms-slider").slider(
        {
            min:0,
            max:self.pages.length-1,
            /* called when we slide but don't release */
            slide:function(){
                var value = jQuery("#ms-slider").slider("value");
                self.currPage = self.checkRecto(value);
                var leftPg = self.leftPage(self.currPage);
                var rightPg = self.pages[self.currPage];
                self.drawPageNames(leftPg,rightPg);
                self.resizeNavs();
            },
            /* called when we release the mouse */
            stop: function() {
                var value = jQuery("#ms-slider").slider("value");
                self.currPage = self.checkRecto(value);
                var leftPg = self.leftPage(self.currPage);
                var rightPg = self.pages[self.currPage];
                self.drawImgs(leftPg,rightPg);
            }
        });        
        self.currPage = (self.pages[0].o=='r')?0:self.nextR(0);
        self.drawImgs(self.leftPage(self.currPage),self.pages[self.currPage]);
        jQuery("#go-left").click( function(){
            self.goLeft();
        });
        jQuery("#go-right").click(function(){
            self.goRight();
        });
        jQuery("#ms-left").mousedown(function(e){
            self.makeZone(e.pageX,e.pageY,Math.round(jQuery("#ms-left").width()/2),'r');
            return false;
        });
        jQuery("#ms-right").mousedown(function(e){
            self.makeZone(e.pageX,e.pageY,Math.round(jQuery("#ms-right").width()/2),'v');
            return false;
        });
        jQuery("#ms-centre").mousedown(function(e){
            self.makeZone(e.pageX,e.pageY,Math.round(jQuery("#ms-centre").width()/4),'c');
            return false;
        });
        jQuery("#ms-magnify-zone").mousemove(function(e){
            if ( self.magnifyDiv != undefined )
            {
                var w = jQuery("#ms-magnify-zone").width();
                var x = e.pageX-w/2;
                var y = e.pageY-w/2;
                var side = self.getSide(e.pageX,e.pageY);
                if ( side !== undefined )
                {
                    if ( self.magnifyDiv.css("visibility")=="hidden" )
                        self.magnifyDiv.css("visibility","visible");
                    self.magnifyDiv.offset({top:y,left:x});
                    self.setBackground(self.magnifyDiv,side,x,y);
                }
                else
                    self.magnifyDiv.css("visibility","hidden");
            }
        });
        jQuery("#ms-left").mousemove(function(e){
            if ( self.magnifyDiv != undefined )
            {
                var w = jQuery("#ms-magnify-zone").width();
                var x = e.pageX-w/2;
                var y = e.pageY-w/2;
                var side = self.getSide(e.pageX,e.pageY);
                if ( side !== undefined )
                {
                    if ( self.magnifyDiv.css("visibility")=="hidden" )
                        self.magnifyDiv.css("visibility","visible");
                    self.magnifyDiv.offset({top:y,left:x});
                    self.setBackground(magnifyDiv,side,x,y);
                }
                else
                    self.magnifyDiv.css("visibility","hidden");
            }
        });
        jQuery("#ms-right").mousemove(function(e){
            if ( self.magnifyDiv != undefined )
            {
                var w = jQuery("#ms-magnify-zone").width();
                var x = e.pageX-w/2;
                var y = e.pageY-w/2;
                var side = self.getSide(e.pageX,e.pageY);
                if ( side !== undefined )
                {
                    if ( self.magnifyDiv.css("visibility")=="hidden" )
                        self.magnifyDiv.css("visibility","visible");
                    self.magnifyDiv.offset({top:y,left:x});
                    self.setBackground(self.magnifyDiv,side,x,y);
                }
                else
                    self.magnifyDiv.css("visibility","hidden");
            }
        });
        jQuery(document).mouseup(function(){
            if ( self.magnifyDiv !== undefined )
            {
                self.magnifyDiv.css("visibility","hidden");
                self.magnifyDiv = undefined;
            }
        });
        jQuery("#ms-fullscreen").click(function(){
            var elem = document.getElementById("ms-main");
            var req = elem.requestFullScreen || elem.webkitRequestFullScreen 
                || elem.mozRequestFullScreen || elem.msRequestFullscreen;
            req.call(elem);
        });
        jQuery(document).keydown(function(e) {
            switch(e.which) 
            {
                case 37: // left
                    self.goLeft();
                    return false;
                case 39: // right
                    self.goRight();
                    return false;  
                default: 
                    return true;
            }
            return true;
        });
        var changeHandler = function(){                                           
            if ( document.webkitIsFullScreen 
            || document.mozFullScreenElement 
            || document.msFullscreenElement !== null )
            self.inFullScreenMode = !self.inFullScreenMode;
            var lImg = jQuery("#ms-left img");
            if ( lImg.attr("src")!= undefined )
            {
                lImg.hide();
                self.redraw("v");
                lImg.fadeIn(250);
                //console.log("redrew left side");
            }
            if ( jQuery("#ms-right img").attr("src") != undefined )
                self.redraw("r");
            if ( jQuery("#ms-centre img").attr("src") != undefined )
                self.redraw("c");
            self.resizeNavs();
        };
        document.addEventListener("fullscreenchange", changeHandler, false);      
        document.addEventListener("webkitfullscreenchange", changeHandler, false);
        document.addEventListener("mozfullscreenchange", changeHandler, false);    
        document.addEventListener('MSFullscreenChange', changeHandler, false );
    };
    /* Download all the page specifications in JSON format */
    jQuery.get( "http://"+window.location.hostname+"/pages/anthology/?docid="+this.docid,
    function(data)
    {
        self.pages = data.ranges;
        self.title = data.title;
        var html = '<div id="ms-main">';
        html += '<div id="ms-title"></div>';
        html += '<div id="ms-tools" title="full-screen mode"><i id="ms-fullscreen" class="fa fa-2x fa-expand"></i></div>';
        html += '<div id="ms-left-nav">';
        html += '<span id="ms-page-left"></span>';
        html += '<div id="left-sidebar"><i id="go-left" class="fa fa-chevron-left fa-3x"></i></div>';
        html += '</div>'; // end of left nav
        html += '<div id="ms-wrapper">';
        html += '<div id="ms-slider"></div>';
        html += '<div id="ms-left"><img></div>';
        html += '<div id="ms-centre"><img></div>';
        html += '<div id="ms-right"><img></div>';
        html += '</div>';
        html += '<div id="ms-right-nav">';
        html += '<div id="right-sidebar"><i id="go-right" class="fa fa-chevron-right fa-3x"></i></div>';
        html += '<span id="ms-page-right"></span>';
        html += '</div>';
        html += '</div>'; // end main div
        html += '<div id="ms-magnify-zone"></div>'; // magnify zone to hide/show
        self.setHtml(html);
    });
} 
/**
 * This reads the "arguments" to the javascript file
 * @param scrName the name of the script file minus ".js"
 */
function getArgs( scrName )
{
    var scripts = jQuery("script");
    var params = new Object ();
    scripts.each( function(i) {
        var src = jQuery(this).attr("src");
        if ( src != undefined && src.indexOf(scrName) != -1 )
        {
            var qStr = src.replace(/^[^\?]+\??/,'');
            if ( qStr )
            {
                var pairs = qStr.split(/[;&]/);
                for ( var i = 0; i < pairs.length; i++ )
                {
                    var keyVal = pairs[i].split('=');
                    if ( ! keyVal || keyVal.length != 2 )
                        continue;
                    var key = unescape( keyVal[0] );
                    var val = unescape( keyVal[1] );
                    val = val.replace(/\+/g, ' ');
                    params[key] = val;
                }
            }
            return params;
        }
    });
    return params;
}
/* main entry point - gets executed when the page is loaded */
jQuery(function(){
    // DOM Ready - do your stuff 
    var params = getArgs('msviewer');
    var viewer = new msviewer(params['target'],params['docid']);
}); 

