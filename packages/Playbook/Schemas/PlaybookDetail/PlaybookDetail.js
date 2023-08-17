define("PlaybookDetail", ["ConfigurationGrid", "ConfigurationGridGenerator",
	"ConfigurationGridUtilitiesV2"], function() {
	return {
		entitySchemaName: "Playbook",
		mixins: {
			ConfigurationGridUtilitiesV2: "Terrasoft.ConfigurationGridUtilitiesV2"
		},
		methods: {

			/**
			 * @inheritDoc Terrasoft.GridUtilities#initGridRowViewModel
			 * @overridden
			 */
			initGridRowViewModel: function(callback, scope) {
				this.initEditableGridRowViewModel(callback, scope);
			},

			/**
			 * @inheritDoc Terrasoft.GridUtilities#getGridRowViewModelClassName
			 * @overridden
			 */
			getGridRowViewModelClassName: function(config) {
				return this.getEditableGridRowViewModelClassName(config);
			},

			/**
			 * @inheritDoc Terrasoft.GridUtilities#getGridRowViewModelConfig
			 * @overridden
			 */
			getGridRowViewModelConfig: function(config) {
				const gridRowViewModelConfig = this.callParent(arguments);
				this.Ext.apply(gridRowViewModelConfig, {
					Ext: this.Ext,
					Terrasoft: this.Terrasoft,
					sandbox: this.sandbox
				});
				this.Ext.apply(gridRowViewModelConfig.values, {
					IsEntityInitialized: true
				});
				return gridRowViewModelConfig;
			},

			/**
			 * @inheritDoc Terrasoft.GridUtilities#initQueryColumns
			 * @overridden
			 */
			initQueryColumns: function(esq) {
				this.callParent(arguments);
				esq.addColumn("StageId", "StageIdValue");
			},

			/**
			 * @inheritDoc Terrasoft.GridUtilitiesV2#onDataChanged
			 * @overriden
			 */
			onDataChanged: function() {
				this.callParent(arguments);
				const items = this.getGridData();
				items.each(function(gridItem) {
					const stageId = gridItem.get("StageIdValue");
					gridItem.set("StageId", "...");
					gridItem.initDcmActionsDashboard(function() {
						this.setCaseCaption(gridItem);
						this.setStageCaptionFromDcmStages(gridItem, stageId);
						delete gridItem.changedValues;
					}, this);
				}, this);
			},

			/**
			 * Sets up case column caption.
			 * @param {Terrasoft.BaseViewModel} gridItem Detail grid item.
			 */
			setCaseCaption: function(gridItem) {
				const dcm = gridItem.get("DcmSchemaInstance");
				const caseColumnValue = gridItem.get("Case");
				const cultureCaptions = dcm.caption.cultureValues;
				caseColumnValue.displayValue = this.Ext.String.format("{0} ({1} {2})",
					cultureCaptions[this.Terrasoft.currentUserCultureName] ||
					cultureCaptions[this.Terrasoft.SysValue.PRIMARY_CULTURE.displayValue],
					this.get("Resources.Strings.VersionCaption"),
					dcm.version);
				gridItem.set("Case", caseColumnValue);
			},

			/**
			 * Sets up StageId column caption.
			 * @param {Terrasoft.BaseViewModel} gridItem Detail grid item.
			 * @param {Guid} stageId Stage identifier.
			 */
			setStageCaptionFromDcmStages: function(gridItem, stageId) {
				const stages = gridItem.get("AvailableStages");
				const stage = stages.findByFn(function(stage) {
					return stage.stageRecordId === stageId;
				});
				const cultureCaptions = stage.caption.cultureValues;
				const stageCaption = stage.caption.cultureValues[this.Terrasoft.currentUserCultureName] ||
					cultureCaptions[this.Terrasoft.SysValue.PRIMARY_CULTURE.displayValue];
				gridItem.set("StageId", stageCaption);
			}
		},
		diff: /**SCHEMA_DIFF*/[]/**SCHEMA_DIFF*/
	};
});