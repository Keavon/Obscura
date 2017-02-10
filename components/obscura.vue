<template>
<div class="wrapper">
	<div class="container cols">
		<toolbar></toolbar>
	</div>
	<div class="container rows fluid">
		<div class="container cols fluid">
			<panel :docs="['Untitled Document', 'Untitled Document 2']" :active="0" :open="0" class="fluid"></panel>
		</div>
		<div class="container cols" style="width: 250px">
			<panel :tabs="['history', 'properties']" :active="0" style="height: 250px"></panel>
			<panel :tabs="['layers']" :active="0" class="fluid"></panel>
		</div>
	</div>
</div>
</template>

<style lang="stylus">
// Page
html
	height 100%

body
	height 100%
	margin 0
	
	.wrapper
		height 100%
		display flex
		flex-direction column
		font-family "Roboto", Arial, sans-serif

// Module layout
.container
	display flex
	flex 0 0 auto
	
	&.rows
		flex-direction row
	
	&.cols
		flex-direction column
	
	&.fluid
	section.fluid
		flex 1 1 auto
</style>

<script>
"use strict";

module.exports = {
	components: {
		"panel": require("../components/panel.vue"),
		"toolbar": require("../components/toolbar.vue")
	}
};
</script>
