sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
	"use strict";

	return Controller.extend("converted.salesorderoverviewview.controller.App", {
		onInit: function () {
			// Get the router instance
			const oRouter = UIComponent.getRouterFor(this);

			// Handle routing errors
			oRouter.attachBypassed(function (oEvent) {
				const sHash = oEvent.getParameter("hash");
				console.warn(`Route bypassed: ${sHash}`);
				// Consider implementing error handling or redirection
			});

			// Navigate to the main view if no hash is present
			if (!window.location.hash || window.location.hash === "#") {
				oRouter.navTo("RouteMain"); // Directly navigate without setTimeout
			}
		}
	});
});
