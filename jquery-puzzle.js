(function( $ ) {
  $.fn.puzzle = function(options) {
    
    var settings = $.extend( {
      'x' : 4,
      'y' : 4,
      "solved" : function() {}
    }, options);
    
    // extension internals
    var videoHeight, videoWidth;
    var videoOffsetLeft, videoOffsetTop;
    var tileHeight, tileWidth;
    var tiles = [];
    var that = this.get(0);
    var activeDrops = 0;
    
    var drawVideo = function() {
      for (var i = 0; i < tiles.length; i++) {
        tiles[i].context.drawImage(that, tiles[i].sx, tiles[i].sy, 
                                   tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
      }
      setTimeout(drawVideo, 16.7);
    }
    
    var generatePieces = function() {
      // Generate main div in the same space as the original video
      var container = $("<div></div>");
      container.attr("id", "puzzle-container");
      container.css({"height"   : videoHeight,
                     "width"    : videoWidth,
                     "position" : "absolute",
                     "top"      : videoOffsetTop,
                     "left"     : videoOffsetLeft,
                     "border"   : "solid #666 1px" });
                     
      document.body.appendChild(container.get(0));
      
      for (var i = 0; i < settings.x; i++) {
        for (var j = 0; j < settings.y; j++) {
          var piece = $("<canvas></canvas>");
          piece.attr("id", "w" + i + "h" + j);
          piece.addClass("puzzle-piece");
          
          piece.css({"height"   : tileHeight,
                     "width"    : tileWidth,
                     "position" : "absolute",
                     "top"      : Math.floor(Math.random() * videoHeight),
                     "left"     : videoOffsetLeft + videoWidth + 25});
          
          piece.get(0).height = tileHeight;
          piece.get(0).width = tileWidth;
                     
          container.append(piece);
          piece.draggable({stack: ".puzzle-piece"});
          
          tiles.push({ "x": i, 
                       "y": j, 
                       "context": piece.get(0).getContext('2d'),
                       "sx": i * tileWidth,
                       "sy": j * tileHeight});
                       
          var dropZone = $("<div></div>");
          dropZone.css({"height" : tileHeight,
                        "width"  : tileWidth,
                        "position" : "absolute",
                        "top" : j * tileHeight,
                        "left" : i * tileWidth});
          container.append(dropZone);
          activeDrops++;
		      dropZone.droppable({ accept: "#w" + i + "h" + j,
		        drop: function(event, ui) { 
		          ui.draggable.draggable("disable");
		          ui.draggable.get(0).style.top = this.style.top;
		          ui.draggable.get(0).style.left = this.style.left;
		          ui.draggable.get(0).style.zIndex = 0;
		          
		          if (--activeDrops == 0) {
		            settings.solved();
		          }
		        }
		      });        
		    }
      }      
    }
    
    var initPuzzle = function() {
      // Get video properties as it is currently drawn
      videoHeight = that.clientHeight;
      videoWidth = that.clientWidth;
      videoOffsetLeft = that.offsetLeft;
      videoOffsetTop = that.offsetTop;
            
      // Calculate tile width and height
      tileWidth = Math.floor(videoWidth / settings.x);
      tileHeight = Math.floor(videoHeight / settings.y);
      
      // Set low opacity on the original video
      that.style.opacity = 0.3;
      
      generatePieces();
    }
    
    if (that.currentTime > 0) {
      initPuzzle();
      drawVideo();
    } else {
      this.bind("loadedmetadata", function() {
        initPuzzle();
      });
    
      this.bind("play", drawVideo);
    }
    return this;
  };
})( jQuery );