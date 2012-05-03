/** 
    Based on concept from: http://dev.opera.com/articles/view/custom-html5-video-player-with-css3-and-jquery/ 
 
    @author Maksim Lin <maks@manichord.com>
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


var createSeek = function() {
    video_seek = $('.video-seek');
    video_timer = $('.video-timer');
    
    if(video.readyState) {
		var video_duration = videoJQ.attr('duration');
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


function gTimeFormat(seconds) {
	var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
	var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
	return m+":"+s;
};

function seekUpdate() {
	var currenttime = video.currentTime;
	if (!seeksliding) {
        video_seek.slider('value', currenttime);
    }
	video_timer.text(gTimeFormat(currenttime));							
};

// for all gory details about fullscreen,
// see: https://developer.mozilla.org/en/DOM/Using_full-screen_mod
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
    console.log("video init running");
    
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