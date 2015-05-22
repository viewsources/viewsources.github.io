(function(window, undefined) {
	var ViewSources = window.ViewSources = window.ViewSources || {};

	 ViewSources.modals = {
		settings: {
			open: '.modalOpen',
			close: '.modalClose',
			closeBtn: '.close'
		},
		init: function() {
			var s = this.settings;
			this.open();
			this.close();
		},
		open: function() {
			var s = this.settings,
			modals = document.querySelectorAll(s.open);
			Array.prototype.forEach.call(modals, function(el) {
				el.addEventListener('click', function(e) {
					var mId = this.dataset.modalid;
					document.querySelector(s.close + '[data-modalId*="' + mId + '"]').classList.add('show');
				});
			});
		},
		close: function() {
			var s = this.settings,
			clsBtns = document.querySelectorAll(s.closeBtn);
			Array.prototype.forEach.call(clsBtns, function(el) {
				el.addEventListener('click', function(e) {
					this.parentNode.classList.remove('show');
				});
			});
		}
	};
})(window);
