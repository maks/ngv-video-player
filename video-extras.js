/**
 * Based on concept from: http://dev.opera.com/articles/view/custom-html5-video-player-with-css3-and-jquery/ 
 * 
 * JS to enahnce a native HTML5 video element with JS based controls displayed SEPERATELY (not overlayed) from the
 * video element. 
 * 
 * Depends on jquery and jquery-ui (slider only).
 * Tested with versions: jquery jquery 1.7.1 and jquery-ui 1.8.17
 * 
 * The following html structure is required:
 * 
 * <div class="video_controlbar">
 *   <a id="play_pause_video" class="play_button" href="#" >Play</a>
 *   <a id="fullscreen" href="#" >Fullscreen</a>
 *   <div class="video-seek"></div>
 *   <div class="video-timer">00:00</div>
 * </div>
 * 
 * The div element could be replaced with other elements as long as the class names are retained.
 * 
 * 
 * @author Maksim Lin <maks@manichord.com>  
 * License and copyright : https://raw.github.com/ngv/ngv-video-player/master/README.textile
 */

var videoJQ,
    video,
    playLinkJQ,
    video_seek,
    video_timer,
    seeksliding;

function playPauseVideo() {    
    if (!video.paused) {
        video.pause();
    } else {
        video.play();
    }            
    return false;
}

function updatePlayPauseButton() {
    if (video.paused) {
        playLinkJQ.text("Play");
        playLinkJQ.removeClass().addClass("play_button");
    } else {
        playLinkJQ.text("Pause");
        playLinkJQ.removeClass().addClass("pause_button");
    }            
}

/**
 * Initialise the timeline scruber 
 */
var createSeek = function() {
    video_seek = $('.video-seek');
    video_timer = $('.video-timer');
    
    if(video.readyState) {
		var video_duration = video.duration;
		video_seek.slider({
			value: 0,
			step: 0.01,
			orientation: "horizontal",
			range: "min",
			max: video_duration,
			animate: true,					
			slide: function(){							
				seeksliding = true;
			},
			stop:function(e,ui){
				seeksliding = false;						
				video.currentTime = ui.value;
			}
		});
	} else {
		setTimeout(createSeek, 150);
	}
};

/**
 * Pretty print time in mm:ss format
 */
function gTimeFormat(seconds) {
	var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
	var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
	return m+":"+s;
};

/**
 * Update timeline scruber
 */
function seekUpdate() {
	var currenttime = video.currentTime;
	if (!seeksliding) {
        video_seek.slider('value', currenttime);
    }
	video_timer.text(gTimeFormat(currenttime));							
};

/**
 * for all gory details about fullscreen,
 * see: https://developer.mozilla.org/en/DOM/Using_full-screen_mod
 */
function makeFullScreen() {
    
    if (video.requestFullScreen) {  
      video.requestFullScreen();  
    } else if (video.mozRequestFullScreen) {  
      video.mozRequestFullScreen();  
    } else if (video.webkitRequestFullScreen) {  
      video.webkitRequestFullScreen();  
    } else if (video.webkitEnterFullScreen) {
        //for iOS
        video.webkitEnterFullScreen();
    }
    return false;
}

function videoInit() {
    
    // Check if HTML5 video supported and do nothing if not
    if( !document.createElement('video').canPlayType ) {
        //console.log("no html5 video!");
        $(".video_controlbar").hide(); // keep the controls hidden
        return;
    }
    
    videoJQ = $("video"),
    video = videoJQ[0],
    playLinkJQ =  $("#play_pause_video");


    videoJQ.removeAttr("controls");
    
    $("#play_pause_video").click(playPauseVideo);
    $("#fullscreen").click(makeFullScreen);

    //attach to events to pick usage of right-click menu video controls
    videoJQ.bind('play', function() {
        updatePlayPauseButton();
    });

    videoJQ.bind('pause', function() {
        updatePlayPauseButton();
    });

    videoJQ.bind('ended', function() {
        updatePlayPauseButton();
    });
    
    createSeek();
    
    videoJQ.bind('timeupdate', seekUpdate);
}

$(videoInit);