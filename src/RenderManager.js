"use strict";

// Import internals
var DocumentManager = require("./DocumentManager.js");

// Define the grey and white checkerboard transparency background
var transparentTexture = new Image();
transparentTexture.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABlBMVEXNzc3///+dDYgGAAAAE0lEQVR4AWOAAUYoGCCBAbcfCgBFEACB1bzUwAAAAABJRU5ErkJggg==";

// Redraw the view of the document to the viewport
function redraw(context) {
	var docIndex = context.canvas.dataset.openDocumentIndex;
	
	// End execution if the document does not exist
	if (!DocumentManager.getDocument(docIndex)) {
		return;
	}
	
	// Clear the canvas in case the user pans or zooms
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	
	// Store the document
	var doc = DocumentManager.getDocument(docIndex);
	
	// Find dimensions and offsets from the top left of the canvas to the top left of the document
	var width = doc.resolution.width * doc.viewport.zoom * 0.01;
	var height = doc.resolution.height * doc.viewport.zoom * 0.01;
	var offsetX = Math.round(context.canvas.width / 2 - width / 2) + doc.viewport.scrollOffsetX;
	var offsetY = Math.round(context.canvas.height / 2 - height / 2) + doc.viewport.scrollOffsetY;
	width = Math.round(width);
	height = Math.round(height);
	
	// Draw each layer onto the given viewport canvas
	doc.imageData.forEach(function(layer) {
		if (layer.visible) {
			
			// Set the blending mode for the layer
			context.globalCompositeOperation = layer.blendMode;
			
			// Draw the layer in the center of the given canvas
			context.drawImage(layer.context.canvas, offsetX, offsetY, width, height);
		}
	});
	
	// Draw transparent background pattern under image
	context.fillStyle = context.createPattern(transparentTexture, "repeat");
	context.globalCompositeOperation = "destination-over";
	context.fillRect(offsetX, offsetY, width, height);
}

// Export public functions
exports.redraw = redraw;
