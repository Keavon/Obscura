<template>
<input placeholder="Search Layers" class="search" />
<div class="layer-area">
	<div class="layers">
		<div v-for="layer in layers" @mousedown="grab($index, $event)" :class="['layer', { 'selected': layer.selected }]">
			<i class="material-icons visibility" @click="hideShowLayer($index)">{{ layer.visible ? "visibility" : "visibility_off" }}</i>
			<layer-thumbnail :context="layer.context"></layer-thumbnail>
			<span>{{ layer.name }}</span>
		</div>
	</div>
	<div class="spacer" @click="grab()"></div>
	<div class="ghosts"></div>
	<div class="drag-to"></div>
</div>
<div class="new">
	<i title="New Image Layer" @click.prevent="newImageLayer" class="material-icons">library_add</i>
	<i title="New Group" class="material-icons">create_new_folder</i>
	<i title="New Fill Layer" class="material-icons">texture</i>
	<i title="New Filter Layer" class="material-icons">tune</i>
	<i title="Apply Mask" class="material-icons">vignette</i>
	<i title="Delete Selection" @click.prevent="deleteSelected" class="material-icons">delete</i>
</div>
</template>

<style lang="stylus" scoped>
.search
	background none
	border none
	outline none
	color #fff
	padding 0 8px
	line-height 36px
	font-size 14px
	flex 0 0

.layer-area
	list-style none
	padding 0
	color #fff
	margin 0
	display flex
	flex-direction column
	flex 1 1 auto
	position relative
	user-select none
	
	.layers
		flex 0 1 auto
		display flex
		flex-direction column-reverse
		overflow-y auto
	
	.layer
		font-size 0
		border-top 1px solid rgba(0, 0, 0, 0.12)
		white-space nowrap
		display flex
		flex 0 0
		
		&.selected
			background rgba(255, 255, 255, 0.15)
		
		*
			vertical-align middle
		
		.visibility
			height 48px
			line-height 48px
			font-size 18px
			padding 0 8px
			cursor pointer
			
			&:hover
				color rgba(255, 255, 255, 0.87)
		
		.dropdown
			font-size 24px
			height 48px
			cursor pointer
			display inline-block
			position relative
			
			&:hover
				color rgba(255, 255, 255, 0.87)
			
			i
				line-height 48px
				margin-left -6px
				transition transform 0.25s
			
			&.closed i
				transform rotateZ(-90deg)
				transition transform 0.25s
		
		img
		canvas
			height 48px
			background url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAMAAADz0U65AAAABlBMVEXMzMz////TjRV2AAAAEklEQVR4AWMAAUYgwMMgKA8EAATIACG3xHQrAAAAAElFTkSuQmCC")
		
		.folder
			line-height 48px
			cursor default
		
		.trace-container
			display inline-block
			width 20px
			height 48px
			position relative
			
			.trace
				width 3px
				height auto
				position absolute
				top -16px
				bottom 0
				left 5px
				background #607d8b
		
		span
			line-height 48px
			height 48px
			font-size 14px
			margin 0 8px
			display inline-block
			text-overflow ellipsis
			white-space nowrap
			overflow hidden
	
	/*.spacer
		flex 1 1 auto
		display flex
		border-collapse collapse
		flex-direction column
	
	.spacer::before
		content ""
		flex 0 1 1px
		background rgba(0, 0, 0, 0.12)*/
		
	.ghosts
		position absolute
		top 0
		bottom 0
		left 0
		right 0
		pointer-events none
		overflow hidden
		/*background rgba(255, 0, 0, 0.1)*/
		
		.layer
			position absolute
			left 0
			right 0
			border-bottom 1px solid rgba(0, 0, 0, 0.12)
			background #37474f
			opacity 0.75
			
			&.selected
				background none

	.drag-to
		position absolute
		left 0
		right 0
		height 3px
		background white
		display none

.new
	flex 0 0
	display flex
	flex-direction row
	text-align center
	font-size 0
	user-select none
	border-top 1px solid rgba(0, 0, 0, 0.12)
	
	i
		color #fff
		vertical-align middle
		padding 4px
		font-size 18px
		cursor pointer
		font-size 18px
		flex 1 1
		
		&:hover
			color rgba(255, 255, 255, 0.87)
</style>

<script>
"use strict";

var DocumentManager = require("../../src/DocumentManager.js");
var LayerManager = require("../../src/LayerManager.js");
var RenderManager = require("../../src/RenderManager.js");

// Temp
var docIndex = 0;

// Create root Vue instance
module.exports = {
	props: ["open"],
	components: {
		"layer-thumbnail": require("./pieces/layer-thumbnail.vue")
	},
	data: function() {
		return {
			layers: DocumentManager.getDocument(docIndex).imageData
		};
	},
	methods: {
		grab: function(layerIndex, e) {
			// Deselect all layers
			if (typeof layerIndex !== "number") {
				// Empty selection
				LayerManager.select(docIndex);
				return;
			}
			
			// Set various initial variables
			var lastSelected;
			var closestIndex;
			var beingDragged = false;
			var layersBeingDragged = [];
			var lastMousePosition = e.clientY;
			var layersPanel = document.getElementsByClassName("layers")[0];
			var dragTo = document.getElementsByClassName("drag-to")[0];
			
			// Select the clicked layer if it's not already selected
			if (!this.layers[layerIndex].selected) {
				// Select the layer
				LayerManager.select(docIndex, layerIndex, e.ctrlKey);
				
				// Record this layer as being the one most recently selected
				lastSelected = layerIndex;
			}
			
			var mouseMove = function(e) {
				var scrollTop = layersPanel.scrollTop; // Height of content out of frame above the current view
				var scrollBottom = layersPanel.scrollHeight - layersPanel.scrollTop - layersPanel.offsetHeight; // Height of content out of frame below the current view
				var scrollHeight = layersPanel.scrollHeight; // Height of all content, even out of frame
				var dragHeight = e.clientY - layersPanel.getBoundingClientRect().top; // Distance from top of container where is
				
				if (!beingDragged && e.clientY !== lastMousePosition) {
					beingDragged = true;
					
					var ghosts = document.getElementsByClassName("ghosts")[0];
					
					document.querySelectorAll(".layers .layer.selected").forEach(function(layer) {
						var layerClone = layer.cloneNode(true);
						layerClone.style.top = layer.offsetTop + scrollBottom + "px";
						layerClone.getElementsByTagName("canvas")[0].getContext("2d").drawImage(layer.getElementsByTagName("canvas")[0], 0, 0);
						ghosts.appendChild(layerClone);
						layersBeingDragged.push(layerClone);
					});
				}
				
				var delta = lastMousePosition - e.clientY;
				lastMousePosition = e.clientY;
				
				layersBeingDragged.forEach(function(layer) {
					layer.style.top = layer.offsetTop - delta + "px";
				});
				
				
				var layers = document.querySelectorAll(".layers .layer");
				
				var offsets = [];
				offsets.push(layers[0].offsetTop + layers[0].offsetHeight + scrollBottom);
				layers.forEach(function(layer) {
					offsets.push(layer.offsetTop + scrollBottom);
				});
				
				var closest = offsets.reduce(function (prev, curr) {
					return (Math.abs(curr - dragHeight) < Math.abs(prev - dragHeight) ? curr : prev);
				});
				
				closestIndex = offsets.indexOf(closest);
				
				if (closest >= 0 && closest <= layersPanel.offsetHeight) {
					// Adjust for extremes
					if (closest === 0 && scrollTop <= 0) {
						// Top
						closest = 0;
					} else if (closest === layersPanel.scrollHeight - scrollTop && scrollBottom <= 0) {
						// Bottom
						closest -= 3;
					} else {
						// Anywhere else
						closest--;
					}
					
					dragTo.style.display = "block";
					dragTo.style.top = closest + "px";
				} else {
					dragTo.removeAttribute("style");
				}
				
			};
			
			var mouseUp = function() {
				document.getElementsByClassName("ghosts")[0].innerHTML = "";
				dragTo.removeAttribute("style");
				
				// Select or deselect
				if (!beingDragged) {
					if (layerIndex !== lastSelected) {
						LayerManager.select(docIndex, layerIndex, e.ctrlKey);
					}
				} else {
					var layers = DocumentManager.getDocument(docIndex).imageData;
					
					var selected = [];
					for (var i = layers.length - 1; i >= 0; i--) {
						if (layers[i].selected) {
							Array.prototype.push.apply(selected, layers.splice(i, 1));
						}
					}
					Array.prototype.splice.apply(layers, [closestIndex, 0].concat(selected));
				}
				
				// Clean up event listeners
				window.removeEventListener("mousemove", mouseMove);
				window.removeEventListener("mouseup", mouseUp);
			};
			
			window.addEventListener("mousemove", mouseMove);
			window.addEventListener("mouseup", mouseUp);
		},
		newImageLayer: function() {
			LayerManager.create(docIndex);
		},
		hideShowLayer: function(layerIndex, state) {
			LayerManager.changeVisibility(docIndex, layerIndex, state);
		},
		deleteSelected: function() {
			LayerManager.remove(docIndex);
		}
	},
	watch: {
		layers: function() {
			document.querySelectorAll("canvas[data-open-document-index='" + docIndex + "']").forEach(function(canvas) {
				RenderManager.redraw(canvas.getContext("2d"));
			});
		}
	}
};
</script>
