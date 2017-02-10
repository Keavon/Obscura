<template>
<canvas width="72" height="48"></canvas>
</template>

<style lang="stylus" scoped>
</style>

<script>
"use strict";

module.exports = {
	props: ["context"],
	ready: function() {
		this.draw(this.context);
	},
	methods: {
		draw: function(context) {
			this.$el.height = 48;
			this.$el.width = 48 * context.canvas.width / context.canvas.height;
			
			var ctx = this.$el.getContext("2d");
			ctx.clearRect(0, 0, this.$el.width, this.$el.height);
			
			ctx.drawImage(context.canvas, 0, 0, this.$el.width, this.$el.height);
		}
	},
	watch: {
		context: "draw"
	}
};
</script>
