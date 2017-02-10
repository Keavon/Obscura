<template>
<section>
	<div class="tabs">
		<span v-if="typeof tabs !== 'undefined'" v-for="tab in tabs" :class="{ 'active': $index === active }">{{ tab }}</span>
		<span v-if="typeof docs !== 'undefined'" v-for="doc in docs" :class="{ 'active': $index === active }">{{ doc }}<i class="material-icons close">close</i></span>
	</div>
	<div class="panel">
		<component v-if="typeof tabs !== 'undefined'" :is="tabs[active]" :open="open"></component>
		<viewport v-if="typeof docs !== 'undefined'" :open="open"></viewport>
	</div>
</section>
</template>

<style lang="stylus" scoped>
section
	overflow hidden
	border-top 1px solid #263238
	background #37474f
	flex 0 0 auto
	display flex
	flex-direction column
	user-select none
	
	.tabs
		flex 0 0
		height 28px
		background #263238
		display block
		
		span
			height 100%
			line-height 28px
			font-size 16px
			vertical-align middle
			display inline-block
			color #fff
			padding 0 8px
			cursor default
			border-right 1px solid rgba(0, 0, 0, 0.24)
			
			&.active
				background #37474f
				border-right 1px solid transparent
			
			.close
				font-size 18px
				vertical-align top
				margin 5px 0
				margin-left 8px
				
				&:hover
					background rgba(255, 255, 255, 0.2)
					border-radius 2px
	
	.panel
		overflow visible
		position relative
		flex 1 1 auto
		display flex
		flex-direction column
</style>

<script>
"use strict";

module.exports = {
	props: ["tabs", "active", "docs", "open"],
	components: {
		"viewport": require("../components/panels/viewport.vue"),
		"history": require("../components/panels/history.vue"),
		"layers": require("../components/panels/layers.vue")
	}
};
</script>
