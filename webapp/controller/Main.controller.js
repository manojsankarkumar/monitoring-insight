sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";
// Comment
	return Controller.extend("monitor.MonitoringInsight.controller.Main", {
		selectedSystem: "",
		onInit: function () {
			var json = new sap.ui.model.json.JSONModel();
			json.loadData("model/TCODE.json", null, false);
			this.getView().byId("idProductsTable").setModel(json);
			
		//
		},

		onChangeOption: function (oContext) {
			// var oModel = new sap.ui.model.json.JSONModel("model/TCODE.json", true);
			// this.getView().byId("idProductsTable").setModel(oModel);

			this.selectedSystem = this.getView().byId("SYSTEM").getSelectedKey();

			var bindingPath = "/MODEL/" + this.selectedSystem;
			//  	var listItem = this.getView().byId("listItem");
			var listItem = new sap.m.ColumnListItem({

				cells: [
					new sap.m.Text({
						text: "{Transaction}"
					}),

					new sap.m.Button({
						icon: "sap-icon://hint"
					}),

					new sap.m.Button({
						icon: "sap-icon://hint"
					}),

					new sap.m.Input({
						value: "{QUEUECOUNT}"
					}),

					new sap.m.Input({
						value: "{ERROR}"
					}),

					new sap.m.Input({
						value: "{COMMENTS}"
					})
				]
			});

			var bindingObject = {
				path: bindingPath,
				sorter: {
					path: 'Transaction'
				}
			};
			this.getView().byId("idProductsTable").bindAggregation("items", bindingPath, listItem);
			// console.log(selectedSystem);
		},

		handleSave: function (oEvent) {
		//	var system = this.getView().byId("SYSTEM").getValue();
			var time = this.getView().byId("TIME").getValue();
			 if (time === "") {
				MessageBox.warning("Please select Time");
				return true;
			} 
			var iRowIndex = 0; //For First row in the table
			var oTable = this.getView().byId("idProductsTable");
			var oModel = oTable.getModel();
			var aItems = oModel.oData.MODEL[this.selectedSystem];

			this.getView().getModel().setDeferredGroups(["createGroup"]);
		     for(var i = 0; i < aItems.length; i++){
		     	this.createEntity(aItems[i]);
		     	this.getView().getModel().submitChanges({
				groupId: "createGroup",
				success: function (oData, oResponse) {
					// var data = oData.__batchResponses[0];
					// data = data.__changeResponses[0];
					// data = data.data;
					
					sap.m.MessageBox.alert("Success");
				},
				error: function (oError, oResponse) {

					sap.m.MessageBox.alert("Failure");
				}
			});
		     }
		},

		onAfterRendering: function (oEvent) {
			// var oModel = this.getView().getModel();
			// oModel.attachMetadataLoaded(this.createEntity.bind(this));
		},

		createEntity: function (oEntry) {
            var system = this.getView().byId("SYSTEM");
			var oContext = this.getView().getModel();
			oContext = oContext.createEntry("/MonitorSet", {
				groupId: "createGroup",
				properties: {
					"SYSTEM": system.getSelectedKey(),
					"TIME": this.getView().byId("TIME").getDateValue(),
					"TCODE": oEntry.Transaction,
					"QUEUECOUNT": oEntry.QUEUECOUNT,
					"ERROR": oEntry.ERROR,
					"COMMENTS": oEntry.COMMENTS 

				}
			});
			this.getView().getModel().setRefreshAfterChange(false);
			this.getView().setBindingContext(oContext);
		},

		handleCancel: function (oEvent) {

			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			MessageBox.confirm(
				"Are you sure you don't want to create?", {
					styleClass: bCompact ? "sapUiSizeCompact" : "",
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function (oAction) {
						if (sap.m.MessageBox.Action.YES) {
							window.history.go(-1);
						}
					}
				});
			//		window.history.go(-1);
			return true;

		}

	});
});