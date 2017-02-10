<template>
<ul>
	<li><i class="material-icons">brush</i>Brush Stroke</li>
	<li><i class="material-icons">brush</i>Brush Stroke</li>
	<li><i class="material-icons">crop_free</i>Shape Selection</li>
	<li><i class="material-icons">format_color_fill</i>Fill</li>
	<li><i class="material-icons" style="transform: scaleX(-1)">near_me</i>Move</li>
	<li><i class="material-icons">gesture</i>Lasso Select</li>
	<li><i class="material-icons">gesture</i>Lasso Select Expansion</li>
	<li><i class="material-icons">delete</i>Delete Pixels</li>
</ul>
</template>

<style lang="stylus" scoped>
ul
	list-style none
	padding 8px 0
	margin 0
	overflow-y auto
	
	li
		color #fff
		font-size 14px
		line-height 24px
		padding 0 8px
		cursor default
		user-select none
		-webkit-user-select none
		
		i
			font-size 18px
			line-height 24px
			vertical-align middle
			margin-right 8px
</style>

<script>
"use strict";

module.exports = {
	data: function() {
		return {
			
		};
	}
};
</script>
