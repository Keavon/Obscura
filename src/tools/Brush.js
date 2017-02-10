"use strict";

var context = document.createElement("canvas").getContext("2d");

function getRoundBrush(size, hardness, profile, color) {
	// Prepare canvas for properly sized brush
	context.canvas.width = size * 2;
	context.canvas.height = size * 2;
	context.clearRect(0, 0, size * 2, size * 2);
	
	// Determine RGB values of provided color
	var bigint = parseInt(color.replace(/[^0-9A-F]/gi, ""), 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;
	
	// Draw a radial gradient for brushes with softness and a circle for brushes with full hardness
	if (size > hardness * size / 100) {
		var gradient = context.createRadialGradient(context.canvas.width / 2, context.canvas.height / 2, size, context.canvas.width / 2, context.canvas.height / 2, hardness * size / 100);
		
		var granularity = 16;
		if (profile === "sine") {
			for (var i = 0; i < granularity; i++) {
				var a = 1 - Math.pow(Math.cos(5 * i / (granularity * Math.PI)), 2);
				gradient.addColorStop(i / granularity, "rgba(" + r + ", " + g + ", " + b + ", " + a + ")");
			}
		} else {
			gradient.addColorStop(0, "rgba(" + r + ", " + g + ", " + b + ", " + 0 + ")");
			gradient.addColorStop(1, "rgba(" + r + ", " + g + ", " + b + ", " + 1 + ")");
		}
		context.fillStyle = gradient;
		context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	} else {
		context.beginPath();
		context.arc(context.canvas.width / 2, context.canvas.height / 2, size, 0, 2 * Math.PI, false);
		context.fillStyle = color;
		context.fill();
	}
	
	return context.canvas;
}

exports.getRoundBrush = getRoundBrush;
