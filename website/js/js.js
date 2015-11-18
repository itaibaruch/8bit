// window.scrollTo(0,0);
var windowHeight;
var windowWidth;
var docWidth;
var docHeight;
var lastScrollTop = 0;

$(document).ready(function(){
    BrowserDetect.init();
    
    if(BrowserDetect.browser == 'Explorer' && BrowserDetect.version <= 9){
        $('body').html(oldBrowser);   
    }

    windowWidth = $(window).width();
    windowHeight = $(window).height();
    docWidth = $(document).width();
    docHeight = $(document).height();
    rockStar.checkIfToActiveNavLink();
});

$(window).on('scroll',function(){
   if(windowWidth > 544){
        rockStar.checkScrollForParallax();
   }else{
        rockStar.checkIfToShowMainNavbar(); 
   }
   rockStar.checkIfToActiveNavLink();
});

$(window).load(function(){
    //after the content is loaded we reinitialize all the waypoints for the animations
    if(windowWidth > 544){
        rockStar.initAnimationsCheck();
    }
}); 


// open jobs description on clicking on job title
$('#jobs-options li a').click(function(e){
    e.preventDefault();
    var tab_target = $(this).attr('href');
    $('#careers .scroll-arrow').hide();
    $('#job-detail').addClass('in');
    $('#job-detail .tab-content div').removeClass('active');
    $('#job-detail .tab-content').find(tab_target).addClass('active');
});

// on clicking on the X button in the job description
$('#job-detail .btn-close').click(function(e){
    e.preventDefault();
    $('#job-detail').removeClass('in');
    $('#careers .scroll-arrow').show();
})

// on click a[data-scroll="true"] animate scroll to id. the small down arrow on bottom of each section
$('a[data-scroll="true"]').click(function(e){         
    var _this = this;
    var scroll_target = $(this).data('id');
    var scroll_trigger = $(this).data('scroll');
    
    if(scroll_trigger == true && scroll_target !== undefined){
        e.preventDefault();
        $('nav.navbar-nav a[data-scroll="true"]').removeClass('active');

        $('html, body').stop().animate({
             scrollTop: $(scroll_target).offset().top - 65
        }, 1000, 'linear', function(){
            $(_this).addClass('active');
        });
    }
});


//when user click on job tile
// $('.job-title small[data-target="#job-form"]').click(function(e){
//     var $jobForm = $('#job-form');
//     var careerH = $('#careers').height();
//     if($jobForm.attr('class') === 'collapse in'){
//         $('#careers').css('height' , careerH - 400);
//         $('#careers .parallax').css('height' , careerH - 400);
//     }else{
//         $('#careers').css('height' , careerH + 400);
//         $('#careers .parallax').css('height' , careerH + 400);
//     }
// });

var rockStar = {
    initAnimationsCheck: function(){
        // on scroll animate [class*="waypoint"] fade in/out 
        $('[class*="waypoint"]').each(function(){
           offset_diff = 30;
           if($(this).hasClass('title')){
               offset_diff = 110;
           }
           
           var waypoints = $(this).waypoint(function(direction) {
                if(direction == 'down'){
                        $(this.element).addClass('animate');    
                   } else {
                       $(this.element).removeClass('animate');
                   }
                }, {
                  offset: windowHeight - offset_diff
           });
        });
  
    },
    checkScrollForParallax: debounce(function() {   
        // on scroll .parallax if in view will show paralex
        $('.parallax').each(function() {
            var $el = $(this);
            
            if(isElementInViewport($el)){
                var parentTop = $el.offset().top;          
                var windowBottom = $(window).scrollTop();
                var $image = $el.find('img').first();
                
                var iVal = ((windowBottom - parentTop) / 30);
                $image.css('transform','translate3d(0rem, ' + iVal + 'rem, 0rem)'); 

                var $logo = $el.find('.black-ball');
                if($logo){
                    var lVal = ((windowBottom - parentTop) / 60);
                    $logo.css('transform','translate3d(0rem, ' + lVal + 'rem, 0rem)');    
                }

                var $wwd = $el.find('.what-we-do');
                if($wwd){
                    var wVal = ((windowBottom - parentTop) / 120);
                    $wwd.css('transform','translate3d(0rem, ' + wVal + 'rem, 0rem)');    
                }

                var $career = $el.find('.career');
                if($career){
                    var cVal = ((windowBottom - parentTop) / 120);
                    $career.css('transform','translate3d(0rem, ' + cVal + 'rem, 0rem)');    
                }
            }
        });
            
    }, 5),
    checkIfToActiveNavLink: debounce(function() {   
        // when a section is seen on the screen, we active the relevent nav-item
        $('section').each(function() {
            var $el = $(this);
            var elId = $el.attr('id');
            // fix for #about section (becuse the hight of that section is small)
            // TODO : make it smarter
            if($el.attr('id') === 'what-we-do' && $(window).scrollTop() > 700 && $(window).scrollTop() < 1100 ){
                $('#nav-links a').each(function(){
                    var $link = $(this);
                    if($link.attr('data-id') === '#about'){
                        $link.addClass('active');
                    } else {
                        $link.removeClass('active');    
                    }
                });
            } else {
                if(isElementInViewport($el)){
                    $('#nav-links a').each(function(){
                        var $link = $(this);
                        if($link.attr('data-id') === '#'+elId){
                            $link.addClass('active');
                        } else {
                            $link.removeClass('active');
                        }

                        //exceptions - when one data-id can be active for two sections
                        if($link.attr('data-id') === '#contact-us' && elId === 'map' ){
                            $link.addClass('active');
                        }
                    })
                }
            }
        });
    }, 10),
    checkIfToShowMainNavbar: debounce(function() {   
        // hideing navbar on mobile 
        var delta = 5;
        var navbarHeight = $('#main-navbar').outerHeight();

        var st = $(window).scrollTop();
        
        // Make sure they scroll more than delta
        if(Math.abs(lastScrollTop - st) <= delta)
            return;
        
        // If they scrolled down and are past the navbar, add class .nav-up.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight){
            // Scroll Down
            $('#main-navbar').slideUp();
        } else {
            // Scroll Up
            if(st + windowHeight < docHeight) {
                $('#main-navbar').slideDown();
            }
        }
        
        lastScrollTop = st;

    }, 10)
}

// https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
// return true iv the elemnt is visible
function isElementInViewport(el) {

    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    
    var rect = el.getBoundingClientRect();
    
    return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.left < windowWidth &&
        rect.top < windowHeight
    );
}

// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
// return true iv the elemnt is visible
// function isElementInTopViewport(el) {

//     // var distance = el.offset().top,
//     // $window = $(window);
//     // if(el.attr('id') === 'what-we-do'){
//     //     console.log('$window.scrollTop(): ' + $window.scrollTop());
//     //     console.log('distance: ' + distance);
//     // }

//     // if ( $window.scrollTop() >= distance ) {
//     //     return true;
//     // }else{
//     //     return false;
//     // }
//     var $window = $(window);
//     // var windowHeight = $window.height(),
//     gridTop = windowHeight * .25,
//     gridBottom = windowHeight * .7;

//     var thisTop = el.offset().top - $window.scrollTop(); // Get the `top` of this el

//     if(el.attr('id') === 'team'){
//         console.log('el: ' + el.attr('id'));
//         console.log('gridTop: ' + gridTop);
//         console.log('gridBottom: ' + gridBottom);
//         console.log('thisTop: ' + thisTop);
//         console.log('(thisTop + el.height()): ' + (thisTop + el.height()));
//         console.log('--------------');
//     }

//     // Check if this element is in the interested viewport
//     // if (thisTop >= gridTop && (thisTop + el.height()) <= gridBottom) {
//     if (thisTop >= gridTop && thisTop <= gridBottom) {
//         return true;
//     } else if (thisTop <= gridTop && (thisTop + el.height()) <= gridBottom) {
//         return true;
//     } else {
//         return false;
//     }
// }

// https://gist.github.com/iwanbk/5906833
// detect the current browser
var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].string;
            var dataProp = data[i].prop;
            this.versionSearchString = data[i].versionSearch || data[i].identity;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) != -1)
                    return data[i].identity;
            } else if (dataProp)
                return data[i].identity;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [
        { string: navigator.userAgent,subString: "Chrome",identity: "Chrome"}, 
        { string: navigator.userAgent,subString: "OmniWeb",versionSearch: "OmniWeb/",identity: "OmniWeb"}, 
        { string: navigator.vendor,subString: "Apple",identity: "Safari",versionSearch: "Version"}, 
        { prop: window.opera,identity: "Opera",versionSearch: "Version"}, 
        { string: navigator.vendor,subString: "iCab",identity: "iCab"}, 
        { string: navigator.vendor,subString: "KDE",identity: "Konqueror"}, 
        { string: navigator.userAgent,subString: "Firefox",identity: "Firefox"}, 
        { string: navigator.vendor,subString: "Camino",identity: "Camino"}, 
        { string: navigator.userAgent,subString: "Netscape",identity: "Netscape"}, // for newer Netscapes (6+)
        { string: navigator.userAgent,subString: "MSIE",identity: "Explorer",versionSearch: "MSIE"}, 
        { string: navigator.userAgent,subString: ".NET",identity: "Explorer",versionSearch: "rv"}, 
        { string: navigator.userAgent,subString: "Gecko",identity: "Mozilla",versionSearch: "rv"}, 
        { string: navigator.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla"} // for older Netscapes (4-)
        ],
    dataOS: [
        { string: navigator.platform,subString: "Win",identity: "Windows"}, 
        { string: navigator.platform,subString: "Mac",identity: "Mac"}, 
        { string: navigator.userAgent,subString: "iPhone",identity: "iPhone/iPod"}, 
        { string: navigator.platform, subString: "Linux", identity: "Linux"}
    ]
};

// message for unsuported browsers
var oldBrowser = '<div class="container"><div style="width: 150px; margin: 50px auto;"><img src="img/logo_w.png" class="img-responsive"/></div><div class="better-browser row"><div class="col-md-2"></div><div class="col-md-8"><h3>We are sorry but it looks like your Browser doesn\'t support our website Features. <br />In order to get the full experience please download a new version of your favourite browser.</h3></div><div class="col-md-2"></div><br><div class="col-md-4 text-center"><a href="https://www.mozilla.org/ro/firefox/new/" class="btn">Mozilla</a><br></div><div class="col-md-4 text-center"><a href="https://www.google.com/chrome/browser/desktop/index.html" class="btn ">Chrome</a><br></div><div class="col-md-4 text-center"><a href="http://windows.microsoft.com/en-us/internet-explorer/ie-11-worldwide-languages" class="btn">Internet Explorer</a><br></div><br><br></div><h4>Thank you!</h4></div>';
