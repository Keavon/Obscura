"use strict";

// Import internals
var RenderManager = require("./RenderManager.js");

// Initialize array of documents
var documents = [];

// Create a new document
// Return the index of the created document
function create(x, y, name) {
	// Add a new document to the array
	documents.push({
		name: name || "Untitled Document",
		imageData: [],
		nodes: [],
		historyEvents: [],
		resolution: {
			width: x,
			height: y,
			pixelDensity: 72,
			pixelDensityUnit: "ppi"
		},
		viewport: {
			scrollOffsetX: 0,
			scrollOffsetY: 0,
			zoom: 100
		}
	});
	
	// Return the index of this new document
	return documents.length - 1;
}

// Open an existing document
function open() {
	alert("DocumentManager.open is not yet implemented");
}

// Update previous document save
function save(docIndex) {
	alert("DocumentManager.save is not yet implemented");
}

// Save or export document to new location
function saveAs(docIndex) {
	alert("DocumentManager.saveAs is not yet implemented");
}

// Change the name of an open document
function rename(docIndex, newName) {
	documents[docIndex].name = newName;
}

// Return the document object of the requested index
function getDocument(docIndex) {
	return documents[docIndex];
}

// Set a new zoom percentage value or change the existing value by a percentage
function zoom(docIndex, value, delta) {
	// Determine if a new value is being set or changed by a percentage
	if (value) {
		// Set the new value
		documents[docIndex].viewport.zoom = value;
	} else if (delta) {
		// Change the existing value by a given percentage
		documents[docIndex].viewport.zoom *= Math.abs(delta) / delta * 0.1 + 1;
	}
	
	// Limit minimum zoom to 1%
	if (documents[docIndex].viewport.zoom < 1) {
		documents[docIndex].viewport.zoom = 1;
	}
	
	// Redraw any viewport with this document open
	getContextsFromDocIndex(docIndex).forEach(function(context) {
		RenderManager.redraw(context);
	});
}

// Return the contexts with the requested document index open
function getContextsFromDocIndex(docIndex) {
	// Initialize an array of contexts
	var contexts = [];
	
	// Find canvases in the DOM showing the requested document
	document.querySelectorAll("canvas[data-open-document-index='" + docIndex + "']").forEach(function(canvas) {
		// Add any found canvas context to the array
		contexts.push(canvas.getContext("2d"));
	});
	
	// Return the array of contexts
	return contexts;
}

// Export public functions
exports.create = create;
exports.open = open;
exports.save = save;
exports.saveAs = saveAs;
exports.rename = rename;
exports.getDocument = getDocument;
exports.zoom = zoom;
exports.getContextsFromDocIndex = getContextsFromDocIndex;
