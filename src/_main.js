"use strict";

// Import internals
var DocumentManager = require("./DocumentManager.js");
var LayerManager = require("./LayerManager.js");
var RenderManager = require("./RenderManager.js");

// Import libraries
var Vue = require("vue");

// Create root Vue instance
new Vue({
	el: "body",
	components: {
		"obscura": require("../components/obscura.vue")
	},
	init: function() {
		// Create a new document
		var doc = DocumentManager.create(900, 600, "Photo");
		
		var loaded = 0;
		
		// Load sample images
		var photo = new Image();
		var gradient = new Image();
		photo.src = "test-img/wall.jpg";
		gradient.src = "test-img/gradient.png";
		photo.onload = imgLoaded;
		gradient.onload = imgLoaded;
		
		// Initialize document and add images to canvas
		function imgLoaded() {
			loaded++;
			if (loaded >= 2) {
				LayerManager.placeImage(doc, photo, "Wall");
				LayerManager.placeImage(doc, gradient, "Gradient (overlay)");
				LayerManager.placeImage(doc, gradient, "Gradient (difference)");
				LayerManager.setBlendMode(doc, 1, "overlay");
				LayerManager.setBlendMode(doc, 2, "difference");
			}
		}
	}
});
