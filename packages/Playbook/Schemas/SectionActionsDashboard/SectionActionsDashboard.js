define("SectionActionsDashboard", ["SectionActionsDashboardResources", "GoogleTagManagerUtilities", "css!ActionDashboardPlaybookCSS"], 
	function(resources, GoogleTagManagerUtilities) {
	return {
		attributes: {
			"IsShowPlaybookButton": {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},			
			
			"IsPlaybookButtonEnabled": {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: false
			},
			
			"PlaybookKnowlageBase": {
				dataValueType: Terrasoft.DataValueType.LOOKUP,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
			},
		},
		messages: {
		},
		mixins: {
		},
		methods: {
			//region Methods: Protected
			
			/**
			 * Handles Playbook button click event.
			 * @protected
			 */
			onPlaybookButtonClick: function () {
				const playbookKnowledgeBase = this.get("PlaybookKnowledgeBase");
				if (playbookKnowledgeBase && playbookKnowledgeBase.value) {
					const miniPageConfig = {
						entitySchemaName: "KnowledgeBase",
						recordId: playbookKnowledgeBase.value,
						miniPageSchemaName: "PlaybookMiniPage",
						showDelay: 0,
						moduleId: this.sandbox.id + "_PlaybookMiniPage",
						isFixed: true
					};
					this._addGTMForPlaybook();
					this.openMiniPage(miniPageConfig);
				}
			},

			/**
			 * @inheritDoc DcmSectionActionsDashboardMixin#initDcmActionsAndPermissions
			 * @overridden
			 */
			initDcmActionsAndPermissions: function(callback, scope) {
				const parent = this.getParentMethod();
				this.Terrasoft.chain(
					parent,
					this._updatePlaybookData,
					function(next) {
						this.Ext.callback(callback, scope || this);
					}, this
				);
			},

			/**
			 * @inheritDoc SectionActionsDashboard#onActionChanged
			 * @overridden
			 */
			onActionChanged: function() {
				this.set("IsPlaybookButtonEnabled", false);
				this.callParent(arguments);	
			},
			
			//endregion
			
			//region Methods: Private

			/**
			 * @private
			 */
			_addGTMForPlaybook: function() {
				var data = this._getGoogleTagManagerData();
				GoogleTagManagerUtilities.actionModule(data);
			},

			/**
			 * @private
			 */
			_getGoogleTagManagerData: function() {
				return {
					action: "PlaybookButtonClick",
					moduleName: "PlaybookModule",
					schemaName: "Playbook"
				};
			},

			/**
			 * @private
			 */
			_updatePlaybookData: function(callback, scope) {
				if (!this.getIsFeatureEnabled("Playbook")) {
					this.Ext.callback(callback, scope);
					return;
				}
				const esq = this._getPlaybookEsq();
				esq.execute(function(response) {
					let isPlaybookButtonVisible = false;
					if (response && response.success) {
						const collection = response.collection;
						if (!collection.isEmpty()) {
							const item = collection.first();
							this.set("PlaybookKnowledgeBase", item.$KnowledgeBase)
							isPlaybookButtonVisible = true;
						}
					}
					this.set("IsPlaybookButtonEnabled", isPlaybookButtonVisible);
					this.set("IsShowPlaybookButton", isPlaybookButtonVisible);
					this.Ext.callback(callback, scope);
				}, this);
			},

			/**
			 * @private
			 */
			_getPlaybookEsq: function() {
				const esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "VwSysDcmLib"
				});
				const caseUid = this.$DcmSchema.uId;
				const currentCultureId = Terrasoft.SysValue.CURRENT_USER_CULTURE.value;
				esq.addColumn("=[Playbook:Case:Id].KnowledgeBase", "KnowledgeBase");
				esq.filters.addItem(this.Terrasoft.createExistsFilter("=[Playbook:Case:Id].KnowledgeBase"));
				esq.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "UId", caseUid));
				esq.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "=[Playbook:Case:Id].StageId", this.$ActiveActionId));
				esq.filters.addItem(this.Terrasoft.createColumnFilterWithParameter(
					this.Terrasoft.ComparisonType.EQUAL, "=[Playbook:Case:Id].[SysCulture:Language:Culture].Id", currentCultureId));
				return esq;
			},
			
			//endregion
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"parentName": "RightHeaderActionContainer",
				"propertyName": "items",
				"name": "ActualDcmSchemaInformationButtonSec",
				"values": {
					"itemType": Terrasoft.ViewItemType.BUTTON,
					"style": Terrasoft.controls.ButtonEnums.style.TRANSPARENT,
					"imageConfig": {"bindTo": "Resources.Images.PlaybookImage"},
					"markerValue": "PlaybookButton",
					"classes": {
						"textClass": ["playbook-action-text"],
						"wrapperClass": ["playbook-action-button"],
					},
					"visible": {
						"bindTo": "IsShowPlaybookButton"
					},
					"enabled": {
						"bindTo": "IsPlaybookButtonEnabled"	
					},
					"caption": {"bindTo": "Resources.Strings.PlaybookButtonCaption"},
					"click": {"bindTo": "onPlaybookButtonClick"}
				},
			},
		]/**SCHEMA_DIFF*/
	};
});
