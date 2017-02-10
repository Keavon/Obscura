<template>
<canvas @click.prevent @DOMMouseScroll="zoomScroll" @mousewheel="zoomScroll" :data-open-document-index="open"></canvas>
</template>

<style lang="stylus" scoped>
.panel canvas
	background #212121
	position absolute
	top 0
	bottom 0
	left 0
	right 0
	//background url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABlBMVEXMzMz////TjRV2AAAAFUlEQVQY02NghAIGGBgggQG2HiYAAEUQAIEnpAxuAAAAAElFTkSuQmCC")
</style>

<script>
"use strict";

var RenderManager = require("../../src/RenderManager.js");
var DocumentManager = require("../../src/DocumentManager.js");

var ElementResizeDetector = require("element-resize-detector");

// Temp
var docIndex = 0;

// Create root Vue instance
module.exports = {
	props: ["open"],
	ready: function() {
		// Store the canvas context
		var context = this.$el.getContext("2d");
		
		// Make this available within the following anonymous function
		var v = this;
		
		// Have canvas dimensions update whenever the viewport changes size
		ElementResizeDetector({ strategy: "scroll" }).listenTo(this.$el.parentElement, function() {
			v.resize(context);
		});
		
		// Resize the canvas to fit current panel size
		this.resize(context);
	},
	methods: {
		zoomScroll: function(e) {
			var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
			DocumentManager.zoom(docIndex, null, delta);
			return false;
		},
		resize: function(context) {
			// Resize canvas resolution if its parent element dimensions differ from current resolution
			// If the size changed, update the canvas dimensions and redraw
			if (context.canvas.width !== context.canvas.parentElement.offsetWidth || context.canvas.height !== context.canvas.parentElement.offsetHeight) {
				// Set the canvas dimensions to the canvas container size
				context.canvas.width = context.canvas.parentElement.offsetWidth;
				context.canvas.height = context.canvas.parentElement.offsetHeight;
				
				// Redraw since the image size changed
				RenderManager.redraw(context);
			}
		}
	}
};
</script>
