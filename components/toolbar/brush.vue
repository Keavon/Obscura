<template>
<div class="tray">
	<slider property="Size" suffix="px" :min="1" :max="1000" :value.sync="brushSize"></slider>
	<slider property="Hardness" suffix="%" :value.sync="brushHardness"></slider>
	<canvas width="20" height="20" class="brush-preview"></canvas>
	<div class="partition"></div>
	<slider property="Opacity" suffix="%" :value.sync="brushOpacity"></slider>
	<slider property="Flow" suffix="%" :value.sync="brushFlow"></slider>
</div>
</template>

<style lang="stylus" scoped>
.slider
	margin 8px 0

.slider + .slider
	margin-left 8px

.brush-preview
	margin 8px 0
	margin-left 8px
	background: #eee
	border-radius 50%
	border 2px solid #fff
	user-select none
</style>

<script>
"use strict";

var Brush = require("../../src/tools/Brush.js");

module.exports = {
	components: {
		"slider": require("../panels/pieces/slider.vue")
	},
	ready: function() {
		this.hardnessPreview = document.querySelector("canvas.brush-preview").getContext("2d");
		this.drawHardnessPreview();
	},
	data: function() {
		return {
			brushSize: 50,
			brushHardness: 50,
			brushOpacity: 100,
			brushFlow: 100,
			hardnessPreview: undefined
		};
	},
	methods: {
		drawHardnessPreview: function() {
			var brush = Brush.getRoundBrush(this.hardnessPreview.canvas.width / 2, this.brushHardness, "sine", "#000000");
			this.hardnessPreview.clearRect(0, 0, this.hardnessPreview.canvas.width, this.hardnessPreview.canvas.height);
			this.hardnessPreview.drawImage(brush, 0, 0);
		}
	},
	watch: {
		brushHardness: "drawHardnessPreview"
	}
};
</script>
