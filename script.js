var startCanvas = function (){
		//keeps track of which line is displayed on the canvas
	var currentRow = 0,
		//creating all the canvases, and storing their contexts
		canvas = document.getElementById('image_scan'),
		ctx = canvas.getContext("2d"),
		copyCanvas = document.createElement('canvas'),
		copyCtx = copyCanvas.getContext('2d'),
		finalCanvas = document.createElement('canvas'),
		finalCtx = finalCanvas.getContext('2d'),
		canvasDimensions = (function setUpCanvasDimension() {
			//this function sets the canvas width and 
			//height to the window width and height
			var width = window.innerWidth,
				height = window.innerHeight;
			canvas.width = width;
			canvas.height = height;
			return {
				width: width,
				height: height
			}
		})(),				
		imageData, //will store the image data of the image canvas with the orignal image on it
		image = new Image(),
		getPixelAt = function ( imageArray, x, y, imageWidth ) {
			//utility function to get image data of pixel at specified x and y
			var pos = ((y * imageWidth) + x) * 4,
				val = {
					r: imageArray[pos],
					g: imageArray[pos + 1],
					b: imageArray[pos + 2],
					a: imageArray[pos + 3]};
			return val;
		},
		goingUp = false,//boolean to keep track of whether currentrow will increment or decrement
		drawCanvasImageWithOtherCanvas = function (){
			//worker function that is conintiously called to update the canvas
			if (currentRow < 0) { //check to see whether we have reached to top or bottom row of the canvas
				goingUp = false;
			} else if (currentRow > canvasDimensions.height) {
				goingUp = true;
			}
			//then increment or decrement the currentrow
			currentRow = (!goingUp)? currentRow + 1 : currentRow - 1;
			//get imageData for the current row
			imageData = ctx.getImageData(0, currentRow, canvasDimensions.width, 1);
			//put that on the copycanvas, which is only one pixel tall
			copyCtx.putImageData(imageData, 0, 0, 0, 0, canvasDimensions.width, 1);
			//then copy the image from the one pixel tall copycanvas to
			//  the final canvas which is at whatever height
			finalCtx.drawImage(
				copyCanvas, 0, 0, canvasDimensions.width, canvasDimensions.height);
		},
		animate = function(){
			//this function is what calls the main worker function
			//alert('aniamte')
			//window.requestAnimationFrame(animate)
			drawCanvasImageWithOtherCanvas();
			
		},
		imageLoaded = function(){
			//once an image src has loaded this function sets up all the necceesary
			// canvas elements and copies the image to the the orignal canvas element
			
			//copy the image that was loaded to the orignal canvas so that it can be blurred and copied
			ctx.drawImage(
				image, 0, 0, canvasDimensions.width, canvasDimensions.height);

			//blur the image so that there is less noise on a per-pixel basis
			stackBlurCanvasRGB("image_scan", 0, 0,canvasDimensions.width, canvasDimensions.height, 2);
			
			setInterval(animate, 100)
		},
		loadPic = function(event){
		//the function is called on the ajax call success or error, it sets the 
			if (event.currentTarget.status === 200) {
				// if the ajax call was a success
				var pics = JSON.parse(event.currentTarget.response), //turn the ajax reposone-text into an json object
					numpics = pics.length,//select an image at random
					randomNum = Math.floor(Math.random()*numpics)+1,
					randompic = pics[randomNum];
				
				//set the image source. when the image is loaded the canvas animation will begin
				image.src = 'pics/'+randompic.name;
			} else {
				alert('sorry there was an error loading the picture');
			}

		};
	
	// create ajax call
	pics = new XMLHttpRequest();
	pics.open("GET", "listpics.php", true);
	
	// set ajax call event handlers
	pics.onload = loadPic;
	pics.onerror = loadPic;
	//pics.onprogress = loadPic;
	
	// send ajax call
	pics.send();

	// set the copycanvas properties
	copyCanvas.width = canvasDimensions.width;
	copyCanvas.height = 1;
	copyCanvas.id = "copy";
	
	// set the final canvas properties, this is the canvas the user will see
	finalCanvas.width = canvasDimensions.width;
	finalCanvas.height = canvasDimensions.height;
	finalCanvas.id = "final";
	
	// append the canvases to the dom
	// only appending the copycanvas so that the stackBlurCanvasRGB 
	// library can select the canvas from the dom
	document.body.appendChild(copyCanvas); 
	document.body.appendChild(finalCanvas);

	canvas.setAttribute('style', 'display:none;')
	copyCanvas.setAttribute('style', 'display:none;')

	// set image object event handlers
	image.onload = imageLoaded;
	image.onerror = setImageSrc;
}

// this function call starts the whole script running
$(startCanvas);