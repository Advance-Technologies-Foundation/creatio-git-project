 define("PlaybookMiniPage", ["css!PlaybookSectionActionDashboardCSS", "PlaybookIframeControl"], function() {
	return {
		entitySchemaName: "KnowledgeBase",
		attributes: {
			/**
			 * @inheritDoc BaseMiniPage#MiniPageModes
			 * @override
			 */
			"MiniPageModes": {
				"value": [
					this.Terrasoft.ConfigurationEnums.CardOperation.VIEW
				]
			},
		},
		properties: {
			paddingOffset: 40,
			heightOffset: 80
		},
		methods: {
			//region Methods: Private
			
			/**
			 * @private
			 */
			_getIframe: function() {
				const wrapElements = document.getElementsByClassName("playbook-iframe");
				if (!wrapElements && wrapElements.length + 0) {
					return
				}
				const wrapElement = wrapElements[0];
				const extComponent = this.Ext.getCmp(wrapElement.id);
				return extComponent.getWrapEl();
			},

			/**
			 * @private
			 */
			_adjustSizes: function() {
				const iframe = this._getIframe();
				const iframeBody = iframe.dom.contentWindow.document.documentElement;
				const miniPageContainer = this.Ext.getCmp("MiniPageContentContainer");
				const alignableMiniPageContainer = this.Ext.getCmp("AlignableMiniPageContainer");
				const documentWidth = document.body.clientWidth;
				let maxWidth = Math.min(documentWidth / 1.15, iframeBody.scrollWidth
					+ this.miniPageContainerBottomOffset + this.paddingOffset)
				maxWidth = Math.max(miniPageContainer.wrapEl.getWidth(), maxWidth);
				iframe.setWidth(maxWidth);
				miniPageContainer.wrapEl.applyStyles({
					"max-width": maxWidth + this.paddingOffset + "px"
				});
				this._applyIframeStyles(iframe);
				const headerLabel = document.querySelector(".minipage-content-container .label-in-header-container");
				headerLabel.setAttribute("dir", document.dir);
				alignableMiniPageContainer.adjustContainerPosition({});
			},

			/**
			 * @private
			 */
			_applyIframeStyles: function(iframe) {
				const iframeBody = iframe.dom.contentWindow.document.documentElement;
				iframeBody.setAttribute("style", "overflow: auto;");
				if (this.Terrasoft.getIsRtlMode()) {
					iframeBody.setAttribute("dir", "rtl");
				}
				const css = '' +
					'<style type="text/css">' +
					'::-webkit-scrollbar {-webkit-appearance: none;width: 10px;height: 10px;} ' +
					'::-webkit-scrollbar-thumb {background-color: rgba(0,0,0,.2);} ' +
					'</style>';
				const iframeDocument = iframe.dom.contentWindow.document;
				iframeDocument.head.insertAdjacentHTML("beforeend", css);
			},
			
			//endregion
			
			//region Methods: Protected
			
			/**
			 * @inheritDoc BaseMiniPage#adjustMiniPagePosition
			 * @protected
			 * @override
			 */
			adjustMiniPagePosition: function(callback, scope) {
				const wrapElements = document.getElementsByClassName("playbook-iframe");
				if (wrapElements && wrapElements.length > 0) {
					const wrapElement = wrapElements[0];
					const extComponent = this.Ext.getCmp(wrapElement.id);
					const iframe = extComponent.getWrapEl();
					iframe.on("load", this.onIframeLoadAdjustIframePosition, this);
				}
				this._adjustSizes();
				this.callParent(arguments);
			},

			/**
			 * @inheritDoc BaseMiniPage#getMiniPageHeader
			 * @protected
			 * @override
			 */
			getMiniPageHeader: function() {
				return "Playbook";
			},

			/**
			 * @inheritDoc BaseMiniPage#updateMaxHeight
			 * @protected
			 * @override
			 */
			updateMaxHeight: function(container) {
				const miniPageContainer = this.Ext.get("MiniPageContentContainer");
				if (!miniPageContainer || !container) {
					return;
				}
				const offsets = this._getMiniPageBottomOffset();
				const documentHeight = document.body.clientHeight;
				const iframe = this._getIframe();
				const iframeBody = iframe.dom.contentWindow.document.documentElement;
				const lowestMaxHeightValue = iframeBody.scrollHeight + this.heightOffset;
				const maxHeight = Math.min((documentHeight / 1.2) - offsets, lowestMaxHeightValue)
				iframe.setHeight(maxHeight - this.heightOffset);
				if (lowestMaxHeightValue == maxHeight) {
					miniPageContainer.applyStyles({
						"overflow": "hidden",
					});
				}
				miniPageContainer.applyStyles({
					"max-height": maxHeight +"px"
				});
			},

			/**
			 * Handler on iframe content loaded.
			 * @protected
			 */
			onIframeLoadAdjustIframePosition: function(event, wrapElement) {
				this._adjustSizes();
			},

			//endregion
			
			//region Methods: Public
			
			/**
			 * Returns frame content.
			 * @public
			 */
			getFrameContent: function() {
				return this.Terrasoft.sanitizeHTML(this.$Notes);
			},
			
			//endregion
		},
		diff: [
			{
				"operation": "merge",
				"name": "AlignableMiniPageContainer",
				"values": {
					"showOverlay": true,
				}
			},
			{
				"operation": "merge", 
				"name": "OpenCurrentEntityPage",
				"values": {
					"visible": false
				}
			},
			{
				"operation": "merge",
				"name": "MiniPageHeaderCaption",
				"values": {
					"visible": true
				}
			},
			{
				"operation": "merge",
				"name": "AlignableMiniPageContainer",
				"values": {
					"wrapClass": ["minipage-alignable-container playbook-align-center"],
				}
			},
			{
				"operation": "insert",
				"name": "CloseButton",
				"parentName": "EditButtonsContainer",
				"propertyName": "items",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"caption": {"bindTo": "Resources.Strings.CloseButtonCaption"},
					"classes": {
						"textClass": ["base-minipage-cancel-button"],
						"wrapperClass": ["base-minipage-cancel-button-wrapper"],
						"imageClass": ["base-minipage-action-button-image"]
					},
					"click": {"bindTo": "close"},
					"visible": true
				}
			},
			{
				"operation": "insert",
				"parentName": "MiniPageContentContainer",
				"propertyName": "items",
				"name": "HtmlContainer",
				"values": {
					"generator": function() {
						return {
							"markerValue": "PlaybookFrame",
							"className": "Terrasoft.PlaybookIframeControl",
							"wrapClass": ["playbook-iframe"],
							"iframeContent": {
								"bindTo": "getFrameContent"
							}
						};
					}
				}
			}
		],
    };
});
