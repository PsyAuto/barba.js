
$(document).ready(function(){

	var myPlayer = $("#jquery_jplayer_1"),
		myPlayerData,
		fixFlash_mp4, // Flag: The m4a and m4v Flash player gives some old currentTime values when changed.
		fixFlash_mp4_id, // Timeout ID used with fixFlash_mp4
		ignore_timeupdate, // Flag used with fixFlash_mp4  
		options = {
			ready: function (event) {
				// Hide the volume slider on mobile browsers. ie., They have no effect.
				if(event.jPlayer.status.noVolume) {
					// Add a class and then CSS rules deal with it.
					$(".jp-gui").addClass("jp-no-volume");
				}
				// Determine if Flash is being used and the mp4 media type is supplied. BTW, Supplying both mp3 and mp4 is pointless.
				fixFlash_mp4 = event.jPlayer.flash.used && /m4a|m4v/.test(event.jPlayer.options.supplied);
				// Setup the player with media.
				$(this).jPlayer("setMedia", {
					// mp3: "http://www.jplayer.org/audio/mp3/Miaow-07-Bubble.mp3",
					m4a: "http://www.jplayer.org/audio/m4a/Miaow-07-Bubble.m4a",
					oga: "http://www.jplayer.org/audio/ogg/Miaow-07-Bubble.ogg"
				});
			},
			timeupdate: function(event) {
				if(!ignore_timeupdate) {
          myControl.progress.val(event.jPlayer.status.currentTime).trigger('change');
				}
			},
			volumechange: function(event) {
				/*if(event.jPlayer.options.muted) {
					myControl.volume.slider("value", 0);
				} else {
					myControl.volume.slider("value", event.jPlayer.options.volume);
				}*/
			},
			swfPath: "../dist/jplayer",
			supplied: "m4a, oga",
			cssSelectorAncestor: "#jp_container_1",
			wmode: "window",
			keyEnabled: true
		},
		myControl = {
			progress: $(options.cssSelectorAncestor + " .jp-progress-dial"),
			volume: $(options.cssSelectorAncestor + " .jp-volume-slider")
		};

	// Instance jPlayer
	myPlayer.jPlayer(options);

	// A pointer to the jPlayer data object
	myPlayerData = myPlayer.data("jPlayer");
  
  // Progress knob controls
  myControl.progress.knob({
    'max': 209.397551, // TODO this will be the song total in seconds
    'width': 70,
    'height': 70,
    'displayInput': false,
    'bgColor': 'rgba(255,255,255, 0.4)',
    'fgColor': '#FFFFFF',
    'thickness': '.1',
    'inline': false,
    'displayPrevious': true,
    'step': 1,
    'change' : function (value) { 
      var sp = myPlayerData.status.seekPercent;
			if(sp > 0) {
				// Apply a fix to mp4 formats when the Flash is used.
				if(fixFlash_mp4) {
					ignore_timeupdate = true;
					clearTimeout(fixFlash_mp4_id);
					fixFlash_mp4_id = setTimeout(function() {
						ignore_timeupdate = false;
					}, 1000);
				}
				// Move the play-head to the value and factor in the seek percent.
    
				myPlayer.jPlayer("playHead", (value / 209.397551 * 100) * (100 / sp));
			} else {
				// Create a timeout to reset this slider to zero.
				setTimeout(function() {
					myControl.progress.val(0).trigger('change');
				}, 0);
			}
    }
  });
});
