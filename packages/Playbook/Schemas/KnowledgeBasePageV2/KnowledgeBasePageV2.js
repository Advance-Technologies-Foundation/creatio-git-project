define("KnowledgeBasePageV2", [], function() {
	return {
		details: /**SCHEMA_DETAILS*/{
			"PlaybookDetail": {
				"schemaName": "PlaybookDetail",
				"entitySchemaName": "Playbook",
				"filter": {
					"detailColumn": "KnowledgeBase",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		attributes: {
			"PlaybookTabName": {
				dataValueType: Terrasoft.DataValueType.TEXT,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: "PlaybookTab"
			},
			"PlaybookEnabled": {
				dataValueType: Terrasoft.DataValueType.BOOLEAN,
				type: Terrasoft.ViewModelColumnType.VIRTUAL_COLUMN,
				value: Terrasoft.Features.getIsEnabled("Playbook")
			}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		methods: {

			/**
			 * @inheritDoc BasePageV2#initTabs
			 * @overridden
			 */
			initTabs: function() {
				this.setPlaybookTabVisibility();
				this.callParent(arguments);
			},

			/**
			 * Set playbook tab visibility.
			 * @private
			 */
			setPlaybookTabVisibility: function() {
				if (this.get("PlaybookEnabled")) {
					return;
				}
				const tabs = this.get("TabsCollection");
				const playbookTab = tabs.find(this.$PlaybookTabName);
				this.changeActiveTabWhenPlaybookInsivible()
				tabs.remove(playbookTab);
			},

			/**
			 * If Active tab is "Playbook"
			 * then set default tab to active.
			 * @private
			 */
			changeActiveTabWhenPlaybookInsivible: function() {
				if (this.$ActiveTabName === this.$PlaybookTabName) {
					this.setActiveTab("GeneralInfoTab");
				}
			},
		},
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "merge",
				"name": "GeneralInfoTab",
				"values": {
					"order": 0
				}
			},
			{
				"operation": "insert",
				"name": "PlaybookTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.PlaybookTabCaption"
					},
					"items": [],
					"order": 1,
					
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "PlaybookDetail",
				"values": {
					"itemType": 2,
					"markerValue": "playbook-detail",
					"visible": {"bindTo": "PlaybookEnabled"}
				},
				"parentName": "PlaybookTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "FilesTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
