"use strict";

// Import interals
var DocumentManager = require("./DocumentManager.js");
var RenderManager = require("./RenderManager.js");

// Add a new layer
function create(docIndex, name) {
	// Store the current document
	var doc = DocumentManager.getDocument(docIndex);
	
	// Create a new image layer
	var newLayer = {
		name: name || "New Layer",
		blendMode: "source-over",
		opacity: 100,
		visible: true,
		selected: false,
		context: document.createElement("canvas").getContext("2d")
	};
	
	// Set canvas size to match document dimensions
	newLayer.context.canvas.width = doc.resolution.width;
	newLayer.context.canvas.height = doc.resolution.height;
	
	// Add the new layer to the current document
	doc.imageData.push(newLayer);
}

// Remove a layer given its index
function remove(docIndex, layerIndex) {
	// Store the layers for the given document
	var layers = DocumentManager.getDocument(docIndex).imageData;
	
	// Determine if all selected layers should be deleted or just a given layer
	if (typeof layerIndex === "undefined") {
		// Go through each layer and delete selected ones
		layers.forEach(function(layer) {
			// Start from the back of the array and delete ones that are selected
			for (var i = layers.length - 1; i >= 0; i--) {
				// Check if this layer is selected
				if (layers[i].selected) {
					// Remove this layer from the array
					layers.splice(i, 1);
				}
			}
		});
	} else {
		// Remove the requested layer from its layer index
		layers.splice(layerIndex, 1);
	}
}

// Duplicate a layer given its index
function duplicate(docIndex, layerIndex) {
	// Store array of layers in the current document
	var layers = DocumentManager.getDocument(docIndex).imageData;
	
	// Add the given layer to the end of the array
	layers.push(layers[layerIndex]);
}

// Place a given image on a new layer
function placeImage(docIndex, image, name) {
	// Create a new layer for this image to go on
	create(docIndex, name);
	
	// Store array of layers in the current document
	var layers = DocumentManager.getDocument(docIndex).imageData;
	
	// Draw the image on the canvas of the top layer
	layers[layers.length - 1].context.drawImage(image, 0, 0);
}

// Set the given image to the given blend mode
function setBlendMode(docIndex, layerIndex, mode) {
	// Get the requested layer and set its color blending mode
	DocumentManager.getDocument(docIndex).imageData[layerIndex].blendMode = mode;
}

// Toggle or set the visibility of a requested layer
function changeVisibility(docIndex, layerIndex, state) {
	// Store the requested layer
	var layer = DocumentManager.getDocument(docIndex).imageData[layerIndex];
	
	// Determine if the state should be toggled or set
	if (typeof state === "undefined") {
		// Toggle the layer visibility
		layer.visible = !layer.visible;
	} else {
		// Set the visibility to the given state
		layer.visible = state;
	}
	
	// Redraw any viewports with this document open
	DocumentManager.getContextsFromDocIndex(docIndex).forEach(function(context) {
		RenderManager.redraw(context);
	});
}

// Manipulate the selected state of layers
function select(docIndex, layerIndexes, addToSelection) {
	// If no layer indexes are provided, set it to an empty array
	if (typeof layerIndexes === "undefined") {
		layerIndexes = [];
	}
	
	// If a single layer index is provided instead of an array, put it in an array
	if (!Array.isArray(layerIndexes)) {
		layerIndexes = [layerIndexes];
	}
	
	// Store the layers in the requested document
	var layers = DocumentManager.getDocument(docIndex).imageData;
	
	// Reset all layers to deselected if not adding to the selection
	if (!addToSelection) {
		// Go through every layer
		layers.forEach(function(layer) {
			// Set the selection state to deselected
			layer.selected = false;
		});
	}
	
	// Go through each layer and set its selection state
	layerIndexes.forEach(function(layerIndex) {
		// Select layer if not adding to the selection, and toggle existing selection value if adding to selection
		layers[layerIndex].selected = !layers[layerIndex].selected || !addToSelection;
	});
}

// Export public functions
exports.create = create;
exports.remove = remove;
exports.duplicate = duplicate;
exports.placeImage = placeImage;
exports.setBlendMode = setBlendMode;
exports.changeVisibility = changeVisibility;
exports.select = select;
