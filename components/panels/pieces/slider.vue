<template>
<div class="slider" @mousedown.prevent="hold">
	<span>{{ property }}</span>
	<span>{{ current }}</span>
	<input @keydown.enter="apply" @blur="cancel" />
	<div v-bind:style="percentage"></div>
</div>
</template>

<style lang="stylus" scoped>
.slider
	background #eee
	border-radius 12px
	height 24px
	width 192px
	position relative
	overflow hidden
	display flex
	user-select none
	
	span:first-of-type
		flex 1
		margin-left 8px
	
	span:last-of-type
		flex 0
		margin-right 8px
	
	span
		color rgba(0, 0, 0, 0.87)
		font-size 16px
		line-height 24px
		vertical-align middle
		z-index 2
		cursor default
	
	input
		display none
		border 0
		outline 0
		padding 0
		margin 0 8px
		width calc(100% - 16px)
		background none
		text-align center
		font-size 16px
	
	div
		position absolute
		height 100%
		top 0
		left 0
		background #e57373
		z-index 1

.slider.entry

	span
	div
		display none
	
	input
		display block
</style>

<script>
"use strict";

module.exports = {
	props: {
		property: {
			type: String,
			default: ""
		},
		prefix: {
			type: String,
			default: ""
		},
		suffix: {
			type: String,
			default: ""
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		step: {
			type: Number,
			default: 1
		},
		ctrlstep: {
			type: Number,
			default: 10
		},
		value: {
			type: Number,
			default: 0
		}
	},
	computed: {
		current: function() {
			return this.prefix + this.value + this.suffix;
		},
		percentage: function() {
			var percent = (this.value - this.min) / (this.max - this.min);
			if (percent < 0) {
				percent = 0;
			} else if (percent > 1) {
				percent = 1;
			}
			return { width: percent * 100 + "%" };
		}
	},
	methods: {
		hold: function(e) {
			var target = e.currentTarget;
			window.addEventListener("mousemove", drag);
			window.addEventListener("mouseup", release);
			
			var v = this;
			var dragged = false;
			
			function drag(e) {
				if (!dragged) {
					dragged = true;
				}
				
				var step = v.step;
				if (e.ctrlKey) {
					step = v.ctrlstep;
				}
				
				var percentage = (e.clientX - target.offsetLeft) / target.offsetWidth;
				
				var snapIncrement = step / (v.max - v.min);
				percentage = snapIncrement * Math.round(percentage / snapIncrement);
				
				if (percentage < 0) {
					percentage = 0;
				} else if (percentage > 1) {
					percentage = 1;
				}
				
				v.value = parseFloat((v.min + (v.max - v.min) * percentage).toFixed(3));
			}
			
			function release(e) {
				if (!dragged) {
					target.className = "slider entry";
					var input = target.getElementsByTagName("input")[0];
					input.value = v.value;
					input.select();
				}
				
				window.removeEventListener("mousemove", drag);
				window.removeEventListener("mouseup", release);
			}
		},
		apply: function(e) {
			this.value = parseInt(e.target.value);
			e.target.parentElement.className = "slider";
		},
		cancel: function(e) {
			e.target.parentElement.className = "slider";
		}
	}
};
</script>
