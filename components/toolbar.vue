<template>
<div class="toolbar">
	<div class="tools">
		<i title="Layer Move" @click="pickTool('layer-move')" class="material-icons" :class="{'active': activeTool.name === 'layer-move'}" style="transform: scaleX(-1)">near_me</i>
		<i title="Point Move" @click="pickTool('point-move')" class="material-icons" :class="{'active': activeTool.name === 'point-move'}" style="transform: scaleX(-1); -webkit-text-stroke: 2px white; color: transparent; font-size: 20px;">near_me</i>
		<div class="partition"></div>
		<i title="Shape Selection" @click="pickTool('shape-selection')" class="material-icons" :class="{'active': activeTool.name === 'shape-selection'}">crop_free</i>
		<i title="Lasso Selection" @click="pickTool('lasso-selection')" class="material-icons" :class="{'active': activeTool.name === 'lasso-selection'}">gesture</i>
		<i title="Area Selection" @click="pickTool('area-selection')" class="material-icons" :class="{'active': activeTool.name === 'area-selection'}">flare</i>
		<div class="partition"></div>
		<i title="Brush" @click="pickTool('brush')" class="material-icons" :class="{'active': activeTool.name === 'brush'}">brush</i>
		<i title="Spot Heal" @click="pickTool('spot-heal')" class="material-icons" :class="{'active': activeTool.name === 'spot-heal'}">healing</i>
		<i title="Fill" @click="pickTool('fill')" class="material-icons" :class="{'active': activeTool.name === 'fill'}">format_color_fill</i>
		<i title="Gradient" @click="pickTool('gradient')" class="material-icons" :class="{'active': activeTool.name === 'gradient'}">gradient</i>
		<div class="partition"></div>
		<i title="Pen" @click="pickTool('pen')" class="material-icons" :class="{'active': activeTool.name === 'pen'}">show_chart</i>
		<i title="Line" @click="pickTool('line')" class="material-icons" :class="{'active': activeTool.name === 'line'}" style="transform: rotateZ(-45deg)">remove</i>
		<i title="Shape" @click="pickTool('shape')" class="material-icons" :class="{'active': activeTool.name === 'shape'}">bubble_chart</i>
		<i title="Text" @click="pickTool('text')" class="material-icons" :class="{'active': activeTool.name === 'text'}">title</i>
		<div class="partition"></div>
		<i title="Crop" @click="pickTool('crop')" class="material-icons" :class="{'active': activeTool.name === 'crop'}">crop</i>
		<i title="Zoom Canvas" @click="pickTool('zoom-canvas')" class="material-icons" :class="{'active': activeTool.name === 'zoom-canvas'}">search</i>
		<i title="Pan Canvas" @click="pickTool('pan-canvas')" class="material-icons" :class="{'active': activeTool.name === 'pan-canvas'}">pan_tool</i>
		<i title="Rotate Canvas" @click="pickTool('rotate-canvas')" class="material-icons" :class="{'active': activeTool.name === 'rotate-canvas'}" style="transform: rotateZ(45deg)">rotate_right</i>
	</div>
	<component :is="activeTool.name"></component>
</div>
</template>

<style lang="stylus">
.toolbar
	flex 1 1 auto
	display flex
	flex-direction column

	.tools
		background #263238
		display flex
		flex 1 1 auto
		flex-direction row
		
		i
			flex 0 1 48px
			display block
			width 48px
			height 48px
			line-height 48px
			vertical-align middle
			text-align center
			font-size 24px
			color #fff
			cursor pointer
			user-select none
			-webkit-user-select none
			
			&:hover
				color rgba(255, 255, 255, 0.87)
			
			&.active
				background #37474f
		
		.partition
			width 1px
			flex 0 0 1px
			background rgba(0, 0, 0, 0.24)

	.tray
		display flex
		flex 1 1 auto
		flex-direction row
		background #37474f
		font-size 14px
		color #fff
		height 40px
		line-height 40px
		padding 0 12px
		box-sizing border-box
		
		label
			vertical-align middle
		
		input[type="checkbox"]
			width 14px
			height 14px
			margin 13px 0
			margin-right 8px
			vertical-align middle
		
		i
			font-size 18px
			width 18px
			height 18px
			padding 11px
			cursor pointer
			
			&:hover
				color rgba(255, 255, 255, 0.87)
		
		.partition
			width 1px
			height auto
			background rgba(0, 0, 0, 0.12)
			margin 8px 11px
</style>

<script>
"use strict";

var ToolManager = require("../src/ToolManager.js");

module.exports = {
	components: {
		"layer-move": require("./toolbar/layer-move.vue"),
		"point-move": require("./toolbar/point-move.vue"),
		"shape-selection": require("./toolbar/shape-selection.vue"),
		"lasso-selection": require("./toolbar/lasso-selection.vue"),
		"area-selection": require("./toolbar/area-selection.vue"),
		"brush": require("./toolbar/brush.vue"),
		"spot-heal": require("./toolbar/spot-heal.vue"),
		"fill": require("./toolbar/fill.vue"),
		"gradient": require("./toolbar/gradient.vue"),
		"pen": require("./toolbar/pen.vue"),
		"line": require("./toolbar/line.vue"),
		"shape": require("./toolbar/shape.vue"),
		"text": require("./toolbar/text.vue"),
		"crop": require("./toolbar/crop.vue"),
		"zoom-canvas": require("./toolbar/zoom-canvas.vue"),
		"pan-canvas": require("./toolbar/pan-canvas.vue"),
		"rotate-canvas": require("./toolbar/rotate-canvas.vue")
	},
	data: function() {
		return {
			activeTool: ToolManager.getActiveTool()
		};
	},
	methods: {
		pickTool: function(tool) {
			this.activeTool.name = tool;
		}
	}
};
</script>
