sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/library",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function (Controller, JSONModel, MessageToast, MessageBox, coreLibrary, Export, ExportTypeCSV, Filter, FilterOperator) {
	"use strict";

	const MessageType = coreLibrary.MessageType;

	return Controller.extend("converted.salesorderoverviewview.controller.SalesOrderOverviewView", {
		onInit: function () {
			// Load mock data
			const oOrderModel = new JSONModel();
			oOrderModel.loadData("model/mockData/orders.json");
			this.getView().setModel(oOrderModel, "orders");

			// Initialize message model
			const oMessageModel = new JSONModel({ messages: [] });
			this.getView().setModel(oMessageModel, "messages");
		},

		// ... (other methods as below) ...
		onExportToCSV: function () {
			const oTable = this.byId("salesOrderItemsTable");
			const aData = oTable.getModel("orders").getData().SalesOrderItems; // Access the SalesOrderItems array

			if (!aData || aData.length === 0) {
				MessageToast.show("No data to export");
				return;
			}

			const sCsvContent = this._convertToCSV(aData);
			const oBlob = new Blob([sCsvContent], { type: "text/csv" });
			const sUrl = URL.createObjectURL(oBlob);
			const oLink = document.createElement("a");
			oLink.href = sUrl;
			oLink.download = "sales_order_items.csv";
			oLink.click();
			URL.revokeObjectURL(sUrl);
		},

		_convertToCSV: function (aData) {
			const aHeaders = Object.keys(aData[0]);
			let sCsv = aHeaders.join(",") + "\n";
			aData.forEach((row) => {
				const aValues = aHeaders.map((header) =>
					`"${(row[header] || "").toString().replace(/"/g, '""')}"`
				);
				sCsv += aValues.join(",") + "\n";
			});
			return sCsv;
		},

		onExportToExcel: function () {
			const oTable = this.byId("salesOrderItemsTable");
			const oExport = new Export({
				exportType: new ExportTypeCSV({
					fileExtension: "xlsx",
					mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				}),
				models: oTable.getModel("orders"),
				rows: {
					path: "/SalesOrderItems"
				},
				columns: [
					{ name: "ItemPosition", template: { content: "{ItemPosition}" } },
					{ name: "GrossAmountValue", template: { content: "{GrossAmountValue}" } },
					{ name: "NetAmountValue", template: { content: "{NetAmountValue}" } },
					{ name: "TaxAmountValue", template: { content: "{TaxAmountValue}" } },
					{ name: "ISOCurrencyCode", template: { content: "{ISOCurrencyCode}" } },
					{ name: "ItemATPStatus", template: { content: "{ItemATPStatus}" } },
					{ name: "ProductID", template: { content: "{ProductID}" } },
					{ name: "ProductName", template: { content: "{ProductName}" } },
					{ name: "ProductDescription", template: { content: "{ProductDescription}" } }
				]
			});
			oExport.saveFile().then(function () {
				MessageToast.show("Export to Excel successful");
			}).catch(function (oError) {
				MessageToast.show("Error exporting to Excel: " + oError.message);
			});
		},

		onSearchItems: function (oEvent) {
			const sQuery = oEvent.getParameter("query");
			const oTable = this.byId("salesOrderItemsTable");
			const oBinding = oTable.getBinding("items");
			const aFilters = [];

			if (sQuery) {
				aFilters.push(new Filter([
					new Filter("ItemPosition", FilterOperator.Contains, sQuery),
					new Filter("GrossAmountValue", FilterOperator.Contains, sQuery),
					new Filter("NetAmountValue", FilterOperator.Contains, sQuery),
					new Filter("TaxAmountValue", FilterOperator.Contains, sQuery),
					new Filter("ISOCurrencyCode", FilterOperator.Contains, sQuery),
					new Filter("ItemATPStatus", FilterOperator.Contains, sQuery),
					new Filter("ProductID", FilterOperator.Contains, sQuery),
					new Filter("ProductName", FilterOperator.Contains, sQuery),
					new Filter("ProductDescription", FilterOperator.Contains, sQuery)
				], false));
			}

			oBinding.filter(aFilters);
		},
		// Add other event handlers as needed for buttons and links
	});
});
