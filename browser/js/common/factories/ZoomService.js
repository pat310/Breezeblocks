app.service('ZoomService', function() {
	this.scalePercent = 100;
	var self = this;
	this.changeZoom = function(scalePercent) {
		self.scalePercent = scalePercent || 100;
		var scaleRatio = this.scalePercent / 100;
		$('#app').css('transform', 'scale(' + scaleRatio + ')');

	};
	this.getZoom = function() {
		return this.scalePercent;
	};
});