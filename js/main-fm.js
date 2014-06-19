/**
	Solidaire – Responsive one page Creative Template
 	Copyright (c) 2012, Subramanian 
	
	Author: Subramanian
	Profile: themeforest.net/user/FMedia/
	
	Version: 1.0.0
	Release Date: 20 July 2012
	
	Built using: jQuery 		version:1.6.2	http://jquery.com/
								jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
	
**/

(function( $ ){	
	
	function mainFm(selector, params){
		
		var defaults = $.extend({}, {
				
				// default variables
				pageBackground : [],
				backgroundOverlay : '',
				pageHolderHeight_desktop : 420,
				pageHolderHeight_ipad : 380,
				homePage : "",
				
				pageAnimationType : "slide",
				
				galleryImageResize : "fill",
				galleryAutoplay : true,
				gallerySlideshowDelay : 1.5
				
			} , params);

			
			// Initialize required variables and objects
			var self = this;
			
			self.pageHolderHeight_desktop = self.pgHigDesk = defaults.pageHolderHeight_desktop;
			self.pageHolderHeight_ipad = self.pgHigIpad = defaults.pageHolderHeight_ipad;
			self.IE_old = $.browser.msie;
			self.mobile = $(window).width() <= 767;
			self.midMobile = $(window).width() <= 767 && $(window).width() > 479;
			self.minMobile = $(window).width() <= 480;
			self.mobileDevice = screen.width < 1024 && screen.height < 1024;
			
			self.bdy = $("body");
			self.mCon = $(".mainContainer");
			self.pHol = $(".pageHolder");
			self.lCon = $(".logo");
			self.tCon = $(".header");
			self.bCon = $(".footer .container");
			self.foot = $(".footer");
			self.pHpg = $(".pageHolder .page");			
			self.pgs = $(".page");
			self.navUl = $('.header .headerContent .nav ul');
			self.mNav = $('#mobile_nav');
			
			self.bHig = self.foot.height();			
			self.backgroundOverlay = defaults.backgroundOverlay;
			self.pageBackground = defaults.pageBackground;
			self.pgHeight = self.pageHolderHeight_desktop;
			self.pageAnimationType = defaults.pageAnimationType;
			self.fadeTopAniDis = self.pageAnimationType=="fade"? 20:0;
			self.preNav = 0;
			self.curNav = 0;
			self.pageLoaded = false;
			self.homePage = defaults.homePage;
			self.txtAniTim = [];
			self.ff = -1;
			self.galHidHig = 60;
			galleryImageResize = defaults.galleryImageResize;
			
			// IE7 fix for overflow property
			if( parseInt($.browser.version, 10) == 7 && $.browser.msie){
				$("body").css({"overflow-y":"hidden"});
			}
			
			// Add background image loaded div
			self.bdy.prepend('<div id="pgBackground" style="width:100%; height:100%; z-index:-10; overflow:hidden; position:absolute; left:0; top:0; "></div>');
			
			var pgB = $('#pgBackground');
			pgB.addClass('menu_color');
			self.menuColor = pgB.css('color');
			pgB.toggleClass('menu_highlight_color', 'menu_color');
			self.menuHighlightColor = pgB.css('color');
			pgB.removeAttr('class');
			
			// Scroll bar added for require div
			var scroll_bar = '<div id="scrollbar_holder"> <div class="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div> <div class="viewport"> <div class="overview" ></div> </div> </div>';		
			self.bdy.find('.add_scroll').each(function(){
				var aa = $(this).children();
				$(this).wrapInner( scroll_bar);
				$(this).find('.overview').append(aa);
			});
			
			// Initialize the site after the required time interval
			var intV = setInterval(function() {
				clearInterval(intV);
				self.initialize();			
			},10);
			
			
			// Full screen Gallery
			self.fsWra = $(".fs_gallery");
			self.fsGal = $(".fs_thumbs");
			
			self.fsView = true;
			self.fsThuHig = $(".fsThumb").outerHeight(true);
			self.fpp = 0;
			
			// create gallery thumbnails close button
			self.pHol.prepend('<div  id="fsCloGal" class="fsCloPos"><div  class="fsClo_inner"> <div class="fsClo_icon"> </div></div></div>');
			self.shGal = self.pHol.children(":first-child");
			// create gallery thumbnails next button
			self.pHol.prepend('<div id="fsGalNex" ><div class="fsNex_icon"> </div></div>');
			self.gNex = $("#fsGalNex");
			// create gallery thumbnails previous button
			self.pHol.prepend('<div id="fsGalPre" ><div class="fsPre_icon"> </div></div>');
			self.gPre = $("#fsGalPre");
			// create gallery Next image button
			self.mCon.prepend('<div id="fsGalNextImg"><div class="fsBtnIcon"> </div> </div>');
			self.fsNxt = $("#fsGalNextImg");
			// create gallery previous button
			self.mCon.prepend('<div id="fsGalPreviousImg"><div class="fsBtnIcon" > </div> </div>');
			self.fsPre = $("#fsGalPreviousImg");
			// create gallery image Text container
			self.mCon.prepend('<div class="container" ><div id="fsTextWarp" ></div></div>');
            self.fsTxt = $("#fsTextWarp");		
			
			self.fsPly = true;
			self.fsArr = [];
			self.fsCur = -1;
			self.fsInt;
			self.fsDly;
			self.fsNum = 0;
			self.fmImgLoaded = true;
			self.fsImgInt;
			self.txtAniInt;
			self.txtEndAni = true;
			self.txtAniSpd = 600; 	// Text animation speed
			self.txtAniDly = 200;	// Text  animation delay
			self.fsAutoPlay = defaults.galleryAutoplay == "true" || defaults.galleryAutoplay == true;	// gallery slideshow autoplay
			self.fsDelay = defaults.gallerySlideshowDelay;	// Gallery slide show delay time
			self.fsTxtSho = false;
			self.isFsGal = false;
			
			// Gallery thumbnail mouse events
			self.bdy.find('.fs_thumbs').each(function(){
				
				($(this).children()).each(function(){
					var thu = $(this);
					
					thu.bind('mouseover mouseup mouseleave', function() {
						self.fsSlideshow("stop");
					});
					thu.bind('mouseout', function() {
						self.fsSlideshow("delay");
					});
					
					thu.click(function(){
						self.fsSlideshow("stop");
						self.fsImgLoad($(this));
					});
					
				});
			});	
			
			// Gallery thumbnails next button mouse event
			self.gNex.bind('mouseover mouseup mouseleave', function() {
				self.fsSlideshow("stop");
			});
			
			self.gNex.bind('mouseout', function() {
				self.fsSlideshow("delay");
			});
			
			self.gNex.click(function(){
				if((self.fsThuHig*(self.fpp+1))<self.fsGal.children(':last-child').position().top+self.fsThuHig){
					self.fpp++;
					if(Modernizr_.csstransitions){
						self.fsGal.css({"top": -(self.fsThuHig*self.fpp)+"px"});
					}else{
						self.fsGal.animate({"top": -(self.fsThuHig*self.fpp)+"px"}, 500,"easeInOutQuart");
					}
				}				
			});
			
			// Gallery thumbnails previous button mouse event
			self.gPre.bind('mouseover mouseup mouseleave', function() {
				self.fsSlideshow("stop");
			});
			
			self.gPre.bind('mouseout', function() {
				self.fsSlideshow("delay");
			});
			
			self.gPre.click(function(){
				if(self.fpp>0){
					self.fpp--;
					if(Modernizr_.csstransitions){
						self.fsGal.css({"top": -(self.fsThuHig*self.fpp)+"px"});
					}else{
						self.fsGal.animate({"top": -(self.fsThuHig*self.fpp)+"px"}, 500,"easeInOutQuart");
					}
				}
			});
			
			
			// Gallery thumbnails Show/hide button mouse event
			self.shGal.bind('mouseover mouseup mouseleave', function() {
				self.fsSlideshow("delay");
			});
			
			self.shGal.click(function(){
				var sel = $(this);
				self.fpp = 0;
				if(self.fsView ){
					self.fsGallShow(true);
				}else{
					self.fsGallHide(true);
				}	
			});
			
			// Gallery next image button mouse event
			self.fsNxt.bind('mouseover mouseup mouseleave', function() {
				self.fsSlideshow("stop");
			});
			
			self.fsNxt.bind('mouseout', function() {
				self.fsSlideshow("delay");
			});
			
			self.fsNxt.click(function(){
				self.fsSlideshow("delay");
				self.fsCur = self.fsCur+1 < self.fsArr.length ? self.fsCur+1 : 0;
				self.fsImgLoad(self.fsArr[self.fsCur]);
			});
			
			
			// Gallery previous image button mouse event
			self.fsPre.bind('mouseover mouseup mouseleave', function() {
				self.fsSlideshow("stop");
			});
			
			self.fsPre.bind('mouseout', function() {
				self.fsSlideshow("delay");
			});
			
			self.fsPre.click(function(){
				self.fsSlideshow("delay");
				self.fsCur = self.fsCur-1 > -1 ? self.fsCur-1 : self.fsArr.length-1;
				self.fsImgLoad(self.fsArr[self.fsCur]);
			});
			
	}	
	
	
	mainFm.prototype = {
		
		// Initialize the require objects and variables 
		initialize : function(){
			
			var self = this;
			self.bdy.css("display","block");			
			self.loading    =  $( '<div />' ).addClass( 'loading' );
			self.bdy.append(self.loading);
			self.loading.css({"left":$(window).width()/2-self.loading.width()/2, "top": $(window).height()/2+30});
			self.loading.css("visibility","visible");	
			self.prePg = "";
			self.curPg = "";
			self.mCon.prepend('<div style="position:absolute"> </div>');	
			self.dumDiv = self.mCon.children(':first-child');
			self.menuList = [];
			
			// Loading object added
			self.bdy.prepend('<div id="preloadImg" style="width:250px; height:250px; visibility:hidden; position:absolute; left:0; top:0; overflow:hidden"> </div>');
			self.dumDiv.addClass('email_loading');
			self.dumDiv.removeClass('email_loading');
			
			$(".headerContent").prepend('<div />');	
			self.higLig = $(".headerContent").children(':first-child');
			self.higLig.addClass("highlight");
			
			self.pgs.css("visibility","hidden");
			self.tCon.hide();
			self.foot.hide();
			
			self.gNex.css({"visibility" : "visible"});
			self.gPre.css({"visibility" : "visible"});
			self.gNex.fadeOut(50);
			self.gPre.fadeOut(50);
			
			// Initialize the menu button action
			var kk = -1;
			var qq = -1;
			self.rez = false;
			
			if( parseInt($.browser.version, 10) == 7 && $.browser.msie){
				$(".header").css({"background":"","filter":"none"});
				self.dumDiv.addClass("mobile_menuBg_ie");
				$(".header").css({"background-color": self.dumDiv.css("background-color")});
			}
			
			try {
				document.createEvent('TouchEvent');
				if(!self.mobile){
					self.mCon.bind('click', function() {
					})
				}
			} catch (e) {
				// nothing to do			
			}
			
			
			self.navUl.each(function() {			

				var slf = $(this);
				qq++;

				if(qq>0){
					slf.children(":first-child").find("a").addClass("first");
					slf.children(":last-child").find("a").addClass("last");
				}
				
				var uuu = slf.parent().children(":first-child");
				var vvv = slf.parent().children(":last-child");
				if(qq>0){
					if(!self.mobile){
						vvv.css({"top": slf.parent().position().top+uuu.outerHeight()+"px", 
						"margin-left": (uuu.outerWidth()-vvv.outerWidth())/2});
					}else{
						vvv.css({"top": "0px", 
						"margin-left": "0px"});
					}
				}
				
				if(qq==0){
					slf.children().each(function() {
						
					 	if(!self.mobile){
							$(this).find("ul").css({"opacity":0, "height":"0px"});
						}
							
						mnu = $(this).children();
						
						mnu.bind('mouseover', function() {
							if(!self.mobile){
								var tpMenu = $(this).parent().find("ul");
								tpMenu.css({"height":"auto"});
								tpMenu.stop();
								tpMenu.animate({"opacity":1},500, false, "easeInOutQuart");
							}
						});
						
						mnu.bind('mouseout', function() {
							if(!self.mobile){
								var tpMenu = $(this).parent().find("ul");
								tpMenu.stop();
								tpMenu.animate({"opacity":0}, 500, "easeInOutQuart", function(){
									tpMenu.css({"height":"0px"});
								});
							}
						});
						
					});
				}
				
				slf.children().each(function() {
					var meu = $(this);
					kk++;
					self.menuList[kk] = $('a', meu).attr("href");
					
					meu.children(":first-child").bind('click', function() {
						if($(this).parent().children().length<2){
							self.navUl.children().each(function() {			
								if($(this).children(":last-child").children().length>0){
									$(this).children(":last-child").css({"height":"0px", "opacity":0});
								}
							});
						}
					});
					
					meu.children(":first-child").bind('mouseover mouseup mouseleave', function() {
						 if(!$(this).data("act")){
							 $(this).css("color", self.menuHighlightColor);
						 }
					});
					
					meu.children(":first-child").bind('mouseout', function() {
						var gg =  $(this).attr("href").split("#");
						if(self.url != gg[1] && !$(this).data("act")){
							 $(this).css("color", self.menuColor);
						}
					});
					
				});
				
			});
			
			// Store the page background path in pageBackground array 
			var ll = self.pageBackground.length;
			if(self.menuList.length > self.pageBackground.length){
				for(var jj=ll; jj< self.menuList.length; jj++){
					self.pageBackground[jj] = ({src : ""});
				}
			}
			
			self.homePg = self.homePage == "" ? self.menuList[0].substr(1, self.menuList[0].length): self.homePage;
			self.cM = $('a[href$="'+self.menuList[0]+'"]').parent();
			
			self.pgs.addClass("pageHidden");
			$("#"+self.homePg).css("visibility","visible");			
			$("#"+self.homePg).hide();
			
			$(".logo").css("visibility","hidden");
			
			// Position the page holder
			if(self.pageAnimationType == "slide"){
				self.pHol.css("left",(($(window).width()-self.pHol.width())/2)+(self.pHol.width()+10)+"px");
			}else{
				if(self.IE_old){
					self.pHol.css({"left":-(self.pHol.width()+50)-(($(window).width()-self.pHol.width())/2)});
				}else{
					self.pHol.css( {"opacity":0});
				}
			}
			
			// Initialize the mobile button action
			self.navUl.data('view',false);
			
			self.mNav.bind('mouseover mouseup mouseleave', function() {
				if(!self.navUl.data('view')){
					$(this).css("color", self.menuHighlightColor);
				}
			});
				
			self.mNav.bind('mouseout', function() {
				if(!self.navUl.data('view')){
					$(this).css("color", self.menuColor);
				}
			});
			
			self.mNav.bind('click', function() {
				if(self.navUl.data('view')){
					self.navUl.css("display","none");
					self.navUl.data('view',false);
					$(this).css("color", self.menuColor);
					
				}else{
					self.navUl.css("display","block");
					self.navUl.data('view',true);
					$(this).css("color", self.menuHighlightColor);
				}
			});
			
			self.bdy.find('img').each(function() {
				$(this).data("src",$(this).attr('src'));
			});
			
			// Initialize the video	
			$('.addVideo').each(function(){	
				var addCover = false;							
				$(this).find('.video_hover').each(function(){
										
					$(this).hover(function() {
					  $(this).stop().animate({opacity:0}, 200);
					}, function() {
					  $(this).stop().animate({opacity:1}, 200);
					});
					
					var vid = $(this).parent();
					vid.find('img').fadeOut(100,function(){
						vid.data("added", true);
					});
					
					vid.click(function(){
						$(".pageHolder .page").find('.addVideo').each(function(){
							$(this).find('#vid').remove();

							if(!$(this).data("added")){
								var vid = $(this);
								var W = vid.attr('data-width') ? vid.attr('data-width') : "100%";
								var H = vid.attr('data-height') ? vid.attr('data-height') : "100%";
								var A = vid.attr('data-autoplay') == "true" && !self.mobileDevice? true : false;
								vid.prepend('<div id="vid" style="visibility:visible; z-index:5"></div>');
								vid.children(':first-child').embedPlayer(vid.attr('data-url'), W, H, A);
							}
							
							$(this).find('img').fadeIn();
							$(this).find('.video_hover').fadeIn();
							$(this).find('.video_hover').css({"z-index":"5"});
						});
						
						$(this).prepend('<div id="vid" style="position:absolute"></div>');
						$(this).find('.video_hover').css({"z-index":"-1"});
						$(this).find('img').fadeOut(100,function(){
							var vid = $(this).parent();
							vid.children(':first-child').embedPlayer(vid.attr('data-url'), vid.width()+"px", vid.height()+"px", vid.width(), false);
						});
					
					});
				});
						
			});
			
			// Add portfolio image mouse over action			
			$("body").find('.portfolio').each(function(){				
				$(this).find('.item').each(function(){
					$(this).bind('mouseover mouseup mouseleave', function() {
						var el = $(this).find('img');
						el.removeClass("portfolio_img_normal");
						el.addClass("portfolio_img_over");
					});
					
					$(this).bind('mouseout', function() {
						var ele = $(this).find('img');
						ele.removeClass("portfolio_img_over");
						ele.addClass("portfolio_img_normal");
					});
				});
			
			});

			if(self.IE_old){
				self.pHol.addClass("pageBackground");
			}

			// Add background overlay patter, only desktop/tablet device
			if(self.backgroundOverlay != "" && !self.mobileDevice){
				$.vegas('overlay', {  src : self.backgroundOverlay });
			}
			
			if(self.mobileDevice){
				for( var ii=0; ii < self.pageBackground.length; ii++){
					if(self.pageBackground[ii].src_small != "" && self.pageBackground[ii].src_small){
						self.pageBackground[ii].src = self.pageBackground[ii].src_small;
					}
				}
			}
			
			// Initialize the window resize function
			clearInterval(self.intr);
			$(window).resize(function() {	
				clearInterval(self.intr);
				self.intr = setInterval(function(){clearInterval(self.intr); self.windowRez();},100);
			});
			
			//Initialize the mobile orientationchange function
			$(window).bind( 'orientationchange', function(){
			  self.windowRez();
			});

			var intt = setInterval(function(){ 
				if(self.bCon.height()>0){ 
					clearInterval(intt);
					// Reposition the footer area when page resize
					var bHig = self.bCon.height()+4 > self.bHig ? self.bCon.height()+4 : self.bHig;
					self.mCon.css('margin' , '0 auto '+ -bHig+'px');
					$(".footer, .push").css("height", bHig+"px");
				}
			},200);

			// The below script open the site, when the google font completely load
			var chkInt = setInterval(function() {
				if(googleFontLoad){
					clearInterval(chkInt);
					var _im =$("<img />");
					 _im.hide();
					 _im.bind("load",function(){
							$(this).remove();	
							self.history();
							self.page_setup();
					 
					   }).error(function () { 		 
							$(this).remove();
							self.history();
							self.page_setup();							
					});
					
					$("#preloadImg").append(_im);
					_im.attr('src',self.pageBackground[0].src);	
				} 
			}, 300);
			
			$('.portfolio').show();
		},
		
		// Gallery slideshow function
		fsSlideshow : function (ev){
			var self = this;
			clearInterval(self.fsInt);
			clearInterval(self.fsDly);
			// pause the slideshow for few seconds
			if(ev == "delay"){
				self.fsDly = setInterval(function(){
					clearInterval(self.fsDly);
					self.fsSlideshow("play");
				},500);
			}
			
			// Play slideshow
			if(ev == "play"){				
				self.fsInt = setInterval(function(){
					if(self.fsAutoPlay){
						self.fsCur = self.fsCur+1 < self.fsArr.length ? self.fsCur+1 : 0;
						self.fsImgLoad(self.fsArr[self.fsCur]);
					}
					clearInterval(self.fsInt);
				}, self.fsDelay*2500);
			}
		},
		
		// Gallery image text fade out animation function
		fsTextOut : function(){
			var self = this;
			clearInterval(self.txtAniInt);

			if(!self.mobileDevice){
			var ii = -1;
			self.txtAniInt = setInterval(function(){
				if(self.txtEndAni){
					clearInterval(self.txtAniInt);
					if(self.fsTxt.children().length>0){
						if($(self.fsTxt.data("con")).data("num") != self.fsNum || !self.fsTxtSho){
							self.fsTxt.find(".fs_caption").each(function(){
								var ll = self.fsTxt.find(".fs_caption").children().length;
								if(!isNaN($(this).data("lt"))){
									var css1 = { "left": $(this).data("lt")-70, "opacity":0 };
								}else{
										css1 = { "right": $(this).data("rt")-70, "opacity":0 };
								}
								self.fsTxt.data("pg", $(".pageHolder .page").attr("data-id"));
								self.fsTxt.find(".fs_caption div").each(function(){
									ii++;

									$(this).data("pos",ii);
									$(this).delay(Number(ii*170)).animate(css1, 250, "easeOutSine", function(){
										if($(this).data("pos") == ll-1){
											self.fsTxt.data("con").append(self.fsTxt.children());
											self.fsTxt.data("con").find(".fs_caption").css("visibility","hidden");
											self.txtEndAni = false;
											if(self.fsTxtSho){
												self.fsTextIn();
											}else{
												self.txtEndAni = true;
											}
											if(parseInt(self.pHol.css("left")) < 0){
												self.bg_setup();				
											}
										}
									});
								});
							});
						}else{
							self.txtEndAni = true;
						}
					}else{
						if(parseInt(self.pHol.css("left")) < 0){
							self.bg_setup();				
						}
						if(self.fsTxtSho){
							self.txtEndAni = false;
							self.fsTextIn();
						}else{
							self.txtEndAni = true;
						}
					}
				}
	
			}, 200);
			}
			
		},
			
		// Gallery image text fade In function
		fsTextIn : function(){
			var self = this;
			var tt = false;
			var ii = 0;
			if(self.fsArr.length > 0){
				self.fsArr[self.fsNum].find(".fs_caption").each(function(){
					tt = true;
				})
			}
			if(tt){
				self.fsArr[self.fsNum].find(".fs_caption").css({"visibility":"visible"});
				self.fsArr[self.fsNum].find(".fs_caption").hide();
				self.fsTxt.append(self.fsArr[self.fsNum].find(".fs_caption"));
				self.fsTxt.data("con",self.fsArr[self.fsNum]);
				
				self.fsTxt.find(".fs_caption").each(function(){
					if(!$(this).data("lt")){
						$(this).data({"lt":parseInt($(this).css("left"))});
						$(this).data({"rt":parseInt($(this).css("right"))});
					}
					$(this).show();
					if(!isNaN($(this).data("lt"))){
						var css1 = { "left": $(this).data("lt")+150, "opacity":0 };
						var css2 = { "left": $(this).data("lt"), "opacity":1 };
					}else{
						css1 = { "right": $(this).data("rt")+150, "opacity":0 };
						css2 = { "right": $(this).data("rt"), "opacity":1 }
					}
					var ll = self.fsTxt.find(".fs_caption").children().length;
					self.fsTxt.find(".fs_caption div").each(function(){
						ii++;
						$(this).data("pos",ii);
						$(this).css(css1);
						$(this).delay(Number(ii*(self.txtAniDly))).animate(css2, self.txtAniSpd , "easeOutSine", function(){
							if($(this).data("pos") == ll){
								self.txtEndAni = true;
							}
						});
					})					
				})
			}else{
				self.txtEndAni = true;
			}
		},
		
		// Gallery image load test function
		fsImgLoadTest : function(){
			var self = this;
			clearInterval(self.fsImgInt);
			self.fsImgInt = setInterval(function(){
				if(self.fmImgLoaded){
					clearInterval(self.fsImgInt);
					if(self.fsNum ==  self.fsCur){
						self.fsSlideshow("play");
						self.loading.fadeOut(300, function(){$(this).css("visibility","hidden")});
					}else{
						self.fsImgLoad(self.fsArr[self.fsCur]);
					}
				}
			}, 500);	
		},
		
		// Gallery image load function
		fsImgLoad : function (ob){
				var self = this;
				if(self.fsArr.length<1 || self.fsCur<0){
					return(0);
				}
				for(var ii=0; ii<self.fsArr.length; ii++){
					if(ii != ob.data("num") && self.fsArr[ii].css("opacity") < .99){
						self.fsArr[ii].css({"opacity":"1"});
					}
				}	
				self.fsArr[ob.data("num")].css({"opacity":".25"});
				self.fsCur = ob.data("num");
				if(self.fsView ){
					if(Modernizr_.csstransitions){
						self.fsGal.css({"top": -(self.fsArr[self.fsCur].position().top)+"px"});
					}else{
						self.fsGal.animate({"top": -(self.fsArr[self.fsCur].position().top)+"px"}, 500,"easeInOutQuart");
					}
					self.fpp = self.fsArr[self.fsCur].position().top/self.fsThuHig;
				}
				
				self.fsImgLoadTest();
				
				if(self.fmImgLoaded){
					self.fmImgLoaded = false;
					var imgSrc = !self.mobile? ob.attr("data-src") : (ob.attr("data-src-small")? ob.attr("data-src-small")  :ob.attr("data-src"));
					self.fsNum = ob.data("num");
					rezType = ob.attr("data-imgResize");

					// initialize to load the image
					if(imgSrc != ""){					
						var _im =$("<img />");
						_im.hide();
						_im.bind("load",function(){
							$(this).remove();
							$.vegas({ src:  imgSrc , fade:500,
								complete:function() {
									self.fmImgLoaded = true;
									self.fsTextOut();
								}
							})
						}).error(function () { 
							$(this).remove();
							self.fmImgLoaded = true;
							self.fsTextOut();
						});				
						$(".loading").fadeIn();
						$("#preloadImg").append(_im);
						_im.attr('src',imgSrc);					
					}else{
						self.fmImgLoaded = true;
						self.fsTextOut();
						$(".vegas-background").fadeOut();
					}
				}
		},
		
		// Gallery thumbnails show function
		fsGallShow : function(ani){
			var self = this;
			var sel = self.shGal;
			self.fsView = false;
			
			self.fsWra = $(".pageHolder .page .fs_gallery");
			self.fsGal = $(".pageHolder .page .fs_thumbs");
			
			var pConTopPos = self.mCon.height()-(self.tCon.height()+self.bCon.height()+self.lCon.height());
			pConTopPos = ((pConTopPos - self.pgHeight)/2)-30;				
			self.pHol.css({"margin" : "20px 0px 20px 0px", "overflow":"hidden"});
			self.gNex.fadeOut();
			self.gPre.fadeOut();
			 
			
			if(!self.mobile){
				self.shGal.stop().animate({ "top":"0px"}, 200,"easeInOutQuart");
				if(ani){
					var vv = false;
					self.pHol.animate({"top": pConTopPos+"px"},{
						duration:600, easing:"easeInOutQuart", queue :false,
					  	step: function(now, fx) {
						  if(Math.round(now)-250 < pConTopPos && !vv){
							  vv = true;
							  $(fx.elem).animate({"height": self.pgHeight},500, "easeInOutQuart", function(){
									self.fsGal.css({"position":"relative"});
									self.fsGalThmSet(true);						
								});
						  }
					  }
					});
					
				}else{		
					self.pHol.css({"height": self.pgHeight, "top": pConTopPos+"px"});						
					self.fsGalThmSet(true);
				}
			}else{
				self.shGal.stop().animate({ "top":"30px"}, 200,"easeInOutQuart");
				if(ani){
					self.pHol.animate({"top": "0px"}, 500,"easeInOutQuart");
					self.fsWra.animate({ "height": self.fsWra.children(':first-child').children(':last-child').position().top+self.fsThuHig+15 }, 500,"easeInOutQuart",function(){
					self.fsGalThmSet(true);	
					});
				}else{
					self.pHol.css({"top": "0px"});
					self.fsWra.css({ "height": self.fsWra.children(':first-child').children(':last-child').position().top+self.fsThuHig+15 });
					self.fsGalThmSet(true);
				}
			}
			
			if(Modernizr_.csstransitions){
				self.fsGal.css({"top": 0+"px"});
			}else{
				self.fsGal.animate({"top": 0+"px"}, 500,"easeInOutQuart");
			}
			
			
			$(".pageHolder .page").animate({"margin-top":"30px"}, 700,"easeInOutQuart");
		},
		
		// Gallery thumbnails hide function
		fsGallHide : function(ani){
			var self = this;
			var sel = self.shGal;
			self.fsView = true;
			
			self.fsWra = $(".pageHolder .page .fs_gallery");
			self.fsGal = $(".pageHolder .page .fs_thumbs");
			
			$(".pageHolder .page").animate({"margin-top":"15px"}, 	{duration:400, easing:"easeInOutQuart", queue :false});
			
			self.fsWra.css({ "height": self.fsWra.children(':first-child').children(':last-child').position().top+self.fsThuHig+15 });					
			var pTpos = $(window).height()-($(".contentWarp").position().top+$(".logo").height()+20+self.galHidHig+self.foot.height())-10;
			
			if(self.fsArr[self.fsCur]){
				if(Modernizr_.csstransitions){
					self.fsGal.css({"top": -(self.fsArr[self.fsCur].position().top)+"px"});
				}else{
					self.fsGal.animate({"top": -(self.fsArr[self.fsCur].position().top)+"px"}, 500,"easeInOutQuart");
				}
				self.fpp = self.fsArr[self.fsCur].position().top/self.fsThuHig;	
			}
			
			if(ani && !self.mobile){
				setTimeout(function(){  
					if(self.fsCur < 0 && self.isFsGal && parseInt(self.pHol.css("left")) == 0 ){ 
						self.fsCur = 0; self.fsImgLoad(self.fsArr[0]); 
					} 
				},500);
			}else{
				if( self.fsCur < 0 && parseInt(self.pHol.css("left") ) == 0){ 
					self.fsCur = 0; self.fsImgLoad(self.fsArr[0]); 
				}
			}
			
			if(!self.mobile){
				self.fsGal.css({"position":"absolute"});
				self.shGal.stop().animate({ "top":"0px"}, 200,"easeOutQuart");
				if(ani){
					var vv = false;
					self.pHol.animate({"height": self.galHidHig+"px"},{
					  	duration:700, easing:"easeInOutQuart", queue :false,
					  	step: function(now, fx) {	 
						  if(Math.round(now)-300 < self.galHidHig && !vv){
							  vv = true;
							  $(fx.elem).animate({"top":(pTpos)},700,"easeInOutQuart", function(){
									self.fsGalThmSet(false);
								});	
						  }
					  	}
					});
					
				}else{
					self.fsGalThmSet(false);
					self.pHol.css({"height": self.galHidHig+"px", "top":(pTpos)});
				}
			}else{
				self.fsGalThmSet(false);
				self.shGal.stop().animate({ "top":"15px"}, 200,"easeInOutQuart");
				pTpos = $(window).height()-($(".contentWarp").position().top+$(".logo").height()+15+self.galHidHig);
				if(ani){
					self.fsWra.animate({"height": 1+"px" }, 500,"easeInOutQuart");
					self.pHol.animate({"top": pTpos+32}, 500,"easeInOutQuart");
				}else{
					self.fsWra.css({"height": 1+"px"});
					self.pHol.css({"top": pTpos+32+"px"});
				}
			}
		},
		
		// Gallery thumbnails reset and arrange function
		fsGalThmSet : function(view){
			var self = this;
			var sel = self.shGal;
			if(!self.mobile && !view){
				self.gNex.fadeIn();
				self.gPre.fadeIn();
			}else{
				self.gNex.fadeOut();
				self.gPre.fadeOut();
			}
			
			if(view){
				sel.children(":first-child").children(":first-child").css({"right" : "-40px"});
				sel.css({"width":"30px"});
				if(!self.mobile){
					$("#scrollbar_holder .thumb").css({"visibility":"visible"});
					self.oScrollbar.tinyscrollbar_update(0);
				}else{
					self.oScrollbar.css('top','0px');		
					self.mCon.css({"position": "relative"});
					self.pHol.css({"height": $(window).height()-(self.tCon.height()+self.lCon.height()+30)});
					self.pHol.css({"position": "relative", "top": "0px", "overflow": "visible"});
					self.fsGal.css({"position":"relative", "top": "0px", "height":"100%"});
					if(!self.IE_old){
						self.pHol.removeClass("pageBackground");
						self.pgs.addClass("pageBackground");
					}
					self.fsGal.css({"position":"relative", "top":"0px"});
				}
			}else{
				sel.children(":first-child").children(":first-child").css({"right" : "0px"});
				
				if(!self.mobile){
					sel.css({"width":"30px"});
					self.oScrollbar.tinyscrollbar_update(0);
				}else{
					sel.css({"width":"100%"});
					self.pHol.css({"overflow":"hidden" });
				}
				$("#scrollbar_holder .thumb").css({"visibility":"hidden"});
			}
			
			setTimeout(function(){ 
				$(".pageHolder .page").find('.fs_gallery').each(function(){
					if(view){
						$(this).css({ "height":$(this).children(':first-child').children(':last-child').position().top+self.fsThuHig+15});
					}
				});
				self.oScrollbar.tinyscrollbar_update(0);
			},400);
		},


		// Page background setup function
		bg_setup : function (){
				var self = this;
				var imgSrc = "";
				rezType = "fill";	
				// Remove the google map if it place on the current page
				$(".pageHolder .page").find('#mapWrapper').each(function(){
					if(!self.IE_old){
						$(this).children(':first-child').remove();
					}
				});
				// Remove the video from the previous page
				$(".pageHolder .page").find('.addVideo').each(function(){
					$(this).find('#vid').remove();
					$(this).find('img').show();
				});
				
				// Find the current page background path
				
				for(var ii=0; ii< self.menuList.length; ii++){
					var gg = self.menuList[ii].split("#");
					if(gg[1] == self.curPg && String(self.pageBackground[ii].src) != ""){
						imgSrc = String(self.pageBackground[ii].src);
					}
				}
				
				var qs = -1;
				
				if(imgSrc == ""){
					self.navUl.each(function() {
						qs++;
						if(qs>0){
							$(this).find("li a").each(function() {
								var gg = $(this).attr("href").split("#");
								if(self.curPg ==  gg[1]){
									var gs = $(this).parent().parent().parent().children(":first-child").attr("href").split("#");
									for(var ii=0; ii< self.menuList.length; ii++){
										var gg = self.menuList[ii].split("#");
										if(gg[1] == gs[1]  && String(self.pageBackground[ii].src) != ""){
											imgSrc = String(self.pageBackground[ii].src);
										}
									}
								}
							});
						}
						
					});
				}

				// initialize to load the page background
				if(imgSrc != ""){					
					var _im =$("<img />");
          			_im.hide();
           			_im.bind("load",function(){
						$(this).remove();
						$.vegas({ src:  imgSrc , fade:500,
							complete:function() {
									self.bg_load();
								}
							});
					}).error(function () { 
						$(this).remove();
						self.bg_load();
					});
										
					$(".loading").fadeIn();
					$("#preloadImg").append(_im);
					_im.attr('src',imgSrc);					
				}else{					
					self.bg_load();
					$(".vegas-background").fadeOut();
				}
		},


		// Page Background load function
		bg_load : function(){
			var self = this;
			
			// Fade-in Header, footer and logo after the first page background loaded
			if(!self.pageLoaded){
				self.pageLoaded = true;
				self.tCon.fadeIn(1000, function(){
					self.menuUpdate();
				});

				self.foot.fadeIn(1000);
				$(".logo").css("visibility","visible");
				$(".logo").hide();
				$(".logo").fadeIn();
				if(!self.IE_old){
					$(".portfolio .item a .img_text").css("visibility","visible");
				}
			}
			
			// Fade-out the loading bar
			self.loading.fadeOut(300, function(){$(this).css("visibility","hidden")});
			// initialize to display the page 
			self.page_display();
			
		},
		

		// The entire page can be reposition, resize and modified by page_setup function
		page_setup : function (){
			
			var self = this;

			// Reset the required variable
			self.mobile = $(window).width() <= 767;
			self.midMobile = $(window).width() <= 767 && $(window).width() > 479;
			self.minMobile = $(window).width() <= 480;
			self.pgHeight = $(window).width() <= 1024 && $(window).width() > 768 ? self.pageHolderHeight_ipad : self.pageHolderHeight_desktop;
			self.pgHeight = 	self.IE_old ? 	self.pageHolderHeight_desktop : self.pgHeight;
			
			// Update the current page scrollbar 
			self.oScrollbar = $('.pageHolder .page #scrollbar_holder');
			self.oScrollbar.tinyscrollbar_update();
			
			self.galHidHig = !self.mobile ? self.fsThuHig+20 : 82;
			
			self.menuUpdate();
			
			// Position the page
			if(!self.mobile || self.IE_old){				
				self.pHol.css({"height": self.pgHeight});
				var pConTopPos = self.mCon.height()-(self.tCon.height()+self.bCon.height()+self.lCon.height());
				
				pConTopPos = isNaN(self.pgHeight) ? 25 : ((pConTopPos - self.pHol.height())/2)-30;
				
				self.pHol.css({"top": pConTopPos+"px", "overflow":"hidden"});
				self.pHol.data("tp",pConTopPos );
				
				if(isNaN(self.pgHeight)){
					self.pHol.css({"margin" : "20px 0px 50px 0px"});
				}else{
					self.pHol.css({"margin" : "20px 0px 20px 0px"});
				}
				
				if(!self.IE_old){
					self.pHol.addClass("pageBackground");
					self.pgs.removeClass("pageBackground");
				}
				
			}else{
				
				self.oScrollbar.css('top','0px');		
				self.mCon.css({"position": "relative"});
				self.pHol.css({"height": $(window).height()-(self.tCon.height()+self.lCon.height()+30)});
				self.pHol.css({"position": "relative", "top": "0px", "overflow": "visible"});
				self.pHol.data("tp", 0 );
				if(!self.IE_old){
					self.pHol.removeClass("pageBackground");
					self.pgs.addClass("pageBackground");
				}
				
			}
			
			self.oScrollbar.tinyscrollbar_update();
			
			if(self.curPg == "" ){
				self.pHol.css("left",(($(window).width()-self.pHol.width())/2)+(self.pHol.width()+50)+"px");
			}
			
			// Change the default image in img tag, if mobile version(data-src-small) image is assign on the img tag
			self.bdy.find('img').each(function() {
				if(!self.mobile || self.IE_old || !$(this).attr('data-src-small')){
					if($(this).data('src')){
						if($(this).data('src') != $(this).attr("src")){
							$(this).attr("src",$(this).data('src'));
						}
					}
				}else{
					if($(this).attr('data-src-small')){
						if(String($(this).attr('src')) != String($(this).attr('data-src-small'))){
							$(this).attr("src",$(this).attr('data-src-small'));
						}
					}
				}
			});
			
			
			// Remove the video if playing and show video cover image
			$(".pageHolder .page").find('.addVideo').each(function(){
				if($(this).data("added")){
					$(this).find('#vid').remove();
				}
				$(this).find('img').show();
				$(this).find('.video_hover').show();
				$(this).find('.video_hover').css({"z-index":"5"});
			});

			// position the footer
			var bHig = self.bCon.height()+4 > self.bHig ? self.bCon.height()+4 : self.bHig;
			self.mCon.css('margin' , '0 auto '+ -bHig+'px');
			$(".footer, .push").css("height", bHig+"px");
			
			// Resize the portfolio
			
			$(".pageHolder .page").find('.portfolio').each(function(){
				if(!self.IE_old){
					var gaIt = $('.portfolio .item');
					if(self.midMobile){
						gaIt.removeClass('large');
						gaIt.removeClass('small');
						gaIt.addClass('medium');
					}else if(self.minMobile){
						gaIt.removeClass('medium');
						gaIt.removeClass('large');
						gaIt.addClass('small');
					}else{
						gaIt.removeClass('medium');
						gaIt.removeClass('small');
						gaIt.addClass('large');
					}
				}
				$(this).isotope( {}, 'reLayout' );						 
			});
			
			self.fsNxt.css({"top":$(window).height()/2+self.fsNxt.height()/2+"px"});
			self.fsPre.css({"top":$(window).height()/2+self.fsPre.height()/2+"px"});
			self.fsTxt.css({"height":$(window).height()});

			self.fsTxtSho = (!self.mobile && !self.mobileDevice);

			$(".pageHolder .page").find('.fs_gallery').each(function(){
				
				if(self.mobile || self.mobileDevice || self.fsTxt.data("pg") != $(".pageHolder .page").attr("data-id")){
					if(self.fsTxt.children().length > 0){
						self.fsTextOut();
					}
				}else{
					if(self.fsTxt.children().length < 1){
						self.fsTextIn();
					}
				}
				
				if(!self.mobile){
					$('.fsThumb').addClass("fsThumbAnimation");
					$('.fs_thumbs').addClass("fsThumbAnimation");
				}else{
					$('.fsThumb').removeClass("fsThumbAnimation");
					$('.fs_thumbs').removeClass("fsThumbAnimation");
				}
				
				self.fpp = 0;
				$(this).css({ "height":$(this).children(':first-child').children(':last-child').position().top+self.fsThuHig+15});
				$(this).children(':first-child').css({ "top":"0px" });
					
				if( parseInt(self.pHol.css("left")) == 0){	
					if(self.fsView){
						self.fsGallHide(false);
					}else{
						self.fsGallShow(false);
					}
				}
			});	
	
		},

		// Update the menu and hightlight bar
		menuUpdate : function(e){
			
			var self = this;
			var curMenuSho = self.cM_;
			var qq = -1;
			
			var sMenu = $(".header .headerContent .nav ul li ul");
			sMenu.removeClass();
			self.navUl.removeClass();
			self.navUl.css("display","block");
			
			if(!self.mobile){
				if(self.IE_old){
					sMenu.addClass("mobile_menuBg_ie");
				}else{
					sMenu.addClass("pageBackground");
				}
			}else{
				self.navUl.addClass('mobile_menuBg');
				sMenu.addClass("mobile_subMenuBg");
			}
			
			self.navUl.each(function() {			
				var slf = $(this);
				qq++;
				
				if(qq == 0){
					slf.children().each(function() {
						if($(this).children().length>1){
							if(!self.mobile){
								$(this).children(":first-child").removeClass("arrow");
							}else{
								$(this).children(":first-child").addClass("arrow");
							}
						}	
					});	
				}
				
				if(qq>0){
					var uuu = slf.parent().children(":first-child");
					var vvv = slf.parent().children(":last-child");
					if(!self.mobile){
						vvv.css({"top": slf.parent().position().top+uuu.outerHeight()+"px", 
						"margin-left": (uuu.outerWidth()-vvv.outerWidth())/2});
						if(self.rez){
							vvv.css({"opacity": 0, "height":"0px"});
						}
					}else{
						vvv.css({"top": "0px", "margin-left": "0px", "height":"auto"});
					}
				}
			});
			
			var qs = -1;

			self.navUl.each(function() {
				qs++;
				if(qs == 0){
					$(this).find("li a").each(function() {
						$(this).data("act",false);
						if(self.cM_.attr("href") == $(this).attr("href")){
							curMenuSho = $(this);
							curMenuSho.css("color", self.menuHighlightColor);
							curMenuSho.data("act",true);
						};
					});
				}
					
				if(qs>0){
					$(this).find("li a").each(function() {
						$(this).data("act",false);
						if(self.cM_.attr("href") == $(this).attr("href")){
							curMenuSho = $(this).parent().parent().parent().children(":first-child");
							curMenuSho.css("color", self.menuHighlightColor);
							curMenuSho.data("act",true);
						}
					});
				}
			})
				
			if(!self.mobile || self.IE_old){
				self.navUl.css("display","block");
				self.higLig.css("display","block");
				self.higLig.animate({"width" : curMenuSho.width(), 
				"left" : (curMenuSho.position()).left+parseInt(curMenuSho.css('padding-left')), 
				"top" : (curMenuSho.position()).top});
			}else{
				self.higLig.css("display","none");
				self.navUl.css("opacity",1);
				if(self.navUl.data('view')){
					self.navUl.css("display","block");
				}else{
					self.navUl.css("display","none");
				}
			}
		},
		
		
		// The page_load function is used to load the current page inside the pageHolder div
		page_load : function (e){

			var self = this;
			self.url = e ? e : self.homePg;
			self.cM = $('a[href$="#'+self.url+'"]').parent();
			self.cM_= $('a[href$="#'+self.url+'"]');
			
			// Check the previous and current page
			if(self.prePg == self.curPg){				
				self.loading.css("visibility","visible");				
				self.pHol.stop();
				
				for(var s=0; s<self.txtAniTim.length; s++){					
					clearInterval(self.txtAniTim[s]);
					self.ff = -1;
				}
								
				// Initialize to load the opening page as per history
				if(self.curPg == "" ){						
					self.curPg = self.prePg = self.url;					
					self.cM = $('a[href$="#'+self.curPg+'"]').parent();
					self.pgs.css("visibility","hidden");
					self.pHpg.removeClass("pageShow");
					self.pHpg.addClass("pageHidden");
					self.bdy.append(self.pHpg);											
					if(self.curPg == self.homePg){
						self.bg_setup();
					}else{
						self.bg_setup();	
					}					
				}else{	
					// Initialize to load current page, background and animate to left side			
					self.curPg = self.url;
					self.pHol.stop();

					self.fsNxt.fadeOut();
					self.fsPre.fadeOut();
					self.fsSlideshow("stop");
					clearInterval(self.fsImgInt);
					self.fsTxtSho = false;
					
					if(self.fsTxt.children().length>0){
						if(!self.mobileDevice){
							self.fsTextOut();
						}
					}
					
					self.isFsGal = false;
					$(".pageHolder .page").find('.fs_gallery').each(function(){
						self.isFsGal = true;
					});
					
					var pp = parseInt(self.pHol.data("tp"));
					if(self.isFsGal){
						if(parseInt(self.pHol.css('height')) == self.pgHeight ){
							if(self.pageAnimationType == "slide"){
								self.pHol.animate(
									{"left":-(self.pHol.width()+50)-(($(window).width()-self.pHol.width())/2)}, 1000, "easeInOutQuart",
									function(){
											self.bg_setup();
								});
							}else{
								if(self.IE_old){
									self.pHol.animate( {"top":pp }, 1000, "easeInOutQuart",
										function(){ self.bg_setup(); self.pHol.css({"left":-(self.pHol.width()+50)-(($(window).width()-self.pHol.width())/2)}); }); 
								}else{
									self.pHol.animate( {"top":pp, "opacity":0}, 1000, "easeInOutQuart",
										function(){ self.bg_setup(); });
								}
								
								
							}
							
						}else{
							self.pHol.animate(
								{"height":0}, 1000, "easeInOutQuart",
								function(){
									if(self.pageAnimationType == "slide"){
										self.pHol.css({"left":-(self.pHol.width()+50)-(($(window).width()-self.pHol.width())/2)});
									}else{
										if(self.IE_old){
											self.pHol.css({"left":-(self.pHol.width()+50)-(($(window).width()-self.pHol.width())/2)});
										}else{
											self.pHol.css( {"opacity":0});
										}
										self.pHol.css( {"top":pp});
									}
									self.bg_setup();
							});							
						}
						
					}else{
						if(self.prePg != self.url){
							if(self.pageAnimationType == "slide"){
								self.pHol.animate(
									{"left":-(self.pHol.width()+50)-(($(window).width()-self.pHol.width())/2)}, 1000, "easeInOutQuart",
									function(){
										self.bg_setup();
									});
							}else{
								if(self.IE_old){
									self.pHol.animate( {"top":pp+self.fadeTopAniDis}, 1000, "easeInOutQuart",
											function(){ 
												self.pHol.css({"left":-(self.pHol.width()+50)-(($(window).width()-self.pHol.width())/2)});
												self.bg_setup(); });
								}else{
									self.pHol.animate( {"top":pp+self.fadeTopAniDis, "opacity":0}, 1000, "easeInOutQuart",
											function(){ self.bg_setup(); });
								}
							}
						}
					}
				}
			}
				
			// Change menu color and position the menu highlight
			$( '.headerContent li a' ).css({"color":self.menuColor});
			
			if(self.mobile){
				self.navUl.data('view',false);
				self.navUl.css({"display":"none"});
				self.mNav.css("color", self.menuColor);
			}
			
			self.menuUpdate();

		},


		// Display the current page
		page_display : function(){
				var self = this;
				// Make visible the current page and position to left side		
				$(".page").hide();							
				var obj = $('body .page[data-id="'+self.curPg+'"]');
				obj.css("visibility","visible");
				obj.show();	
				self.pHol.stop();
				if(self.pageAnimationType == "slide"){
					self.pHol.css("left",(($(window).width()-self.pHol.width())/2)+(self.pHol.width()+50)+"px");
				}else{
					self.pHol.css("left", 0 );
				}
				$(".pageHolder .page").css({"margin":"30px 0px 0px 0px"});
				
				// Remove the video from the previous page
				$(".pageHolder .page").find('.addVideo').each(function(){
					$(this).find('#vid').remove();
					$(this).find('img').show();
				});
				
				$("#scrollbar_holder .thumb").css({"visibility":"visible"});
					
				if(self.curPg != ""){
					// Remove the previous page from the pageHolder
					$("body").append($(".pageHolder .page"));
					// Add the current page to the pageHolder
					$(".pageHolder").append(obj);
					$(".pageHolder .page").removeClass("pageHidden");
					$(".pageHolder .page").addClass("pageShow");
					
					// Set page height
					
					self.pageHolderHeight_desktop = $(".pageHolder .page").attr("data-height-fixed") == "false" ?  "100%" : self.pgHigDesk;
					self.pageHolderHeight_ipad = $(".pageHolder .page").attr("data-height-fixed") == "false" ?  "100%" : self.pgHigIpad;
					
					// Update the portfolio image size
					if(!self.IE_old){
						$(".pageHolder .page").find('.portfolio').each(function(){
							var gaIt = $('.portfolio .item');
							if(self.midMobile){
								gaIt.removeClass('large');
								gaIt.removeClass('small');
								gaIt.addClass('medium');
							}else if(self.minMobile){
								gaIt.removeClass('medium');
								gaIt.removeClass('large');
								gaIt.addClass('small');
							}else{
								gaIt.removeClass('medium');
								gaIt.removeClass('small');
								gaIt.addClass('large');
							}
						});
					}
					
					self.isFsGal = false;	
					$(".pageHolder .page").find('.fs_gallery').each(function(){
						self.isFsGal = true;
					});
					
					// Reset the current page scrollbar variable	
					self.oScrollbar = $('.pageHolder #scrollbar_holder');
				
					// Initialize the scrollbar if it first time load
					if(!self.oScrollbar.data('sLoad')){
						self.oScrollbar.data('sLoad',true);
						self.oScrollbar.tinyscrollbar();
					}else{
						self.oScrollbar.tinyscrollbar_update();
					}
				
					//vegas background resize
					$.vegas('resize_');

					// Update the current page	
					self.page_setup();
						
					var ppg = $('.pageHolder .page');
					
					// Remove the google map before the page display
					ppg.find('#mapWrapper').each(function(){
						if(!self.IE_old){
							$(this).children(':first-child').remove();
						}
					});
						
					// Reset the form field if the page contain contact form
					ppg.find('#reply_message').removeClass();
					ppg.find('#reply_message').html('');
					ppg.find('input#name').val('Name'); 
					ppg.find('input#email').val('Email'); 
					ppg.find('textarea#comments').val('Comments...');
					
					// Graph display	
					ppg.find('.graph_container li').each(function() {
						$(this).each(function() {
							$(this).children(':first-child').css("width","0px");
						});
					});
					
					// Feature Image
					ppg.find("ul.feature_wrap li .fea").css({"height":"0%", "opacity":"0"});
							
					// full screen Gallery
					self.fsCur = -1;
					self.fsView = false;		
					self.shGal.hide();
					self.gNex.hide();
					self.gPre.hide();
					self.fsArr = [];	
					ppg.find('.fs_gallery').each(function(){
						self.fsTxtSho = true;
						self.fsThuHig = ppg.find(".fsThumb").outerHeight(true);
						$(this).find('.fs_thumbs').each(function(){
							($(this).children()).each(function(){	
								self.fsArr.push($(this));
								if($(this).css("opacity")<.99 ){
									$(this).css({"opacity":"1"});
								}
								$(this).data("num",self.fsArr.length-1);
								self.fsArr[0].css("opacity",.25);
							});
						});
						self.shGal.show();
					});

					ppg.find('.animate').each(function(){	
						$(this).css("width","1px");
					});
								
					ppg.find('.animate2').each(function(){	
						$(this).css("opacity","0");
					});
					
					// Animate to show the current page
					self.pHol.css({ "top" : self.pHol.data("tp")+self.fadeTopAniDis+"px" });
					if(self.IE_old){ 
						self.pHol.show(); 
						self.pHol.animate({"left"  : "0px", "top"  : self.pHol.data("tp")+"px"}, 1000, "easeInOutQuart",
							function(){
								self.arrangePgContent();						
							} );	
					}else{
						self.pHol.animate({"left"  : "0px", "top"  : self.pHol.data("tp")+"px", "opacity" : 1}, 1000, "easeInOutQuart",
							function(){
								self.arrangePgContent();						
							} 
						);
					}
					
				}else{
					self.prePg = self.curPg;
				}
		},
		
		// Reset/start page content animation
		arrangePgContent : function(){
			var self = this;
			// Reset the requierd object after page display
			self.prePg = self.curPg;	
			// Reload the page if the current page is not equal to history url								
			if(self.curPg != self.url){
				self.page_load(self.url);
			}								
			ppg = $('.pageHolder .page');	
			// Add the google map if it present on the current page							
			ppg.find('#mapWrapper').each(function(){
				if(!self.IE_old){
					$(this).append($(this).data('map'));
				}
			});

			// Updae the portfolio if it present 

			ppg.find('.portfolio').each(function(){						
				if(!$(this).data('loaded')){
					$(this).isotope({
					itemSelector : '.item',
					animationOptions: {
						complete: function() { self.oScrollbar.tinyscrollbar_update();  }
						}
					});
				}
								
				$(this).isotope({
					_fitRowsReset : function() {
						this.fitRows = { x : 0, y : 0, height : 0 };
						}
	 				});
				$(this).data('loaded',true);
			});	
							

			// full screen Gallery
			ppg.find('.fs_gallery').each(function(){
				self.shGal.show();
				self.fsView = true;
				self.fsGallHide(true);
				self.fsNxt.fadeIn();
				self.fsPre.fadeIn();
			});
							
			// Video 
			ppg.find('.addVideo').each(function(){
				if(!$(this).data("added")){
					var vid = $(this);
					var W = vid.attr('data-width') ? vid.attr('data-width') : "100%";
					var H = vid.attr('data-height') ? vid.attr('data-height') : "100%";
					var A = (vid.attr('data-autoplay') == "true" && !self.mobileDevice);
					vid.prepend('<div id="vid" style="visibility:visible; z-index:5"></div>');
					vid.children(':first-child').embedPlayer(vid.attr('data-url'), W, H, A);
				}
			});
							
			// Feature Tag
			var iu=0;
			if(self.IE_old){
				ppg.find("ul.feature_wrap li").show();
			}
			ppg.find("ul.feature_wrap li .fea").each(function(){
				iu++;
				$(this).parent().show();
				$(this).delay(Number(iu*(150))).animate({"height":"100%", "opacity":"1"}, 1200,"easeInOutQuart");
			});
							
			// Text animation
			for(var s=0; s<self.txtAniTim.length; s++){
				clearInterval(self.txtAniTim[s]);
				self.ff = -1;
			}
							
			ppg.find('.animate').each(function(){
				var sel = $(this);
				self.ff = self.ff+1;
				sel.data('i',self.ff);
				self.txtAniTim[self.ff] = setInterval(function(){
					clearInterval(self.txtAniTim[Number(sel.data('i'))]); 
					sel.animate({"width":"100%"},2000,"easeOutQuart");
				}, Number($(this).attr("data-time"))*200 );		
								
			});
							
			ppg.find('.animate2').each(function(){
				var sel2 = $(this);
				self.ff = self.ff+1;
				sel2.data('i',self.ff);
				self.txtAniTim[self.ff] = setInterval(function(){ 
					clearInterval(self.txtAniTim[Number(sel2.data('i'))]); 
					sel2.animate({"opacity":"1"},1000,"easeOutQuart");
				},  Number($(this).attr("data-time"))*200);						
			});
							
			// Graph display
			ppg.find('.graph_container').each(function(){
				self.graph_display($(this));
			});
							
			// update the scrollbar 
			self.oScrollbar.tinyscrollbar_update();	
			
		},
		
		// Initialize the History 
		history : function(){
			var self = this;

			(function($){
				var origContent = "";			
				function loadContent(hash) {

					if(hash != "") {
						if(origContent == ""  && self.curPg == "") {
							origContent = $(self.homePage);
						}
						if(self.hisPath != hash ){
							
							self.hisPath = hash;
							self.page_load(hash);
						}
					} else if(origContent != "" && self.curPg == "") {
						if(self.hisPath != hash ){
							self.hisPath = hash;
							self.page_load(self.homePg);
						}
					}
					
					if(hash == "" && self.curPg == ""){
						self.page_load(self.homePg);
					}
				}

				$(document).ready(function() {
						$.history.init(loadContent);
						$('#navigation a').not('.external-link').click(function() {
								var url = $(this).attr('href');
								url = url.replace(/^.*#/, '');
								$.history.load(url);
								return false;
							});
					});
			})(jQuery);
			
		},

		
		// Graph display function
		graph_display : function (e){
			e.find('li').each(function() {
					$(this).each(function() {
							$(this).children(':first-child').css("width","0px");
							$(this).children(':first-child').stop();
							$(this).children(':first-child').animate( { width: $(this).attr('data-level') },  1500, "easeInOutQuart");
						});
					});
		},
		
		// Window Resize function
		windowRez : function (){			
			var self = this;
			self.loading.css({"left":$(window).width()/2-self.loading.width()/2, "top": $(window).height()/2+30});
			self.rez = true;
			self.page_setup();
			self.rez = false;
		}

		
	};
		
	// Initizlize and create the main plug-in
	$.fn.mainFm = function(params) {
	var $fm = $(this);
		var instance = $fm.data('GBInstance');
		if (!instance) {
			if (typeof params === 'object' || !params){
				return $fm.data('GBInstance',  new mainFm($fm, params));	
			}
		} else {
			if (instance[params]) {					
				return instance[params].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
		
	};

	
})( jQuery );