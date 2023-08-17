Ext.define("Terrasoft.controls.PlaybookIframeControl", {
	extend: "Terrasoft.IframeControl",
	alternateClassName: "Terrasoft.PlaybookIframeControl",

	/**
	 * Iframe content link click.
	 * @private
	 * @param {Object} event Link click event.
	 */
	_onUrlClick: function(event) {
		event.preventDefault();
		event.stopPropagation();
		let href;
		let target = event.target;
		while (!href && !!target) {
			href = target && target.href;
			target = target?.parentElement;
		}
		this.openUrl(href, "_blank");
	}

	//endregion

});
