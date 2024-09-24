sap.ui.define(["sap/ui/core/Fragment", "sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter", "sap/m/Token", "sap/ui/model/FilterOperator",
	"sap/m/MessageBox"
], function (Frag, Controller, Filter, Token, FilterOperator, MessageBox) {
	"use strict";

	return Controller.extend("zpm.zpm_infoboard.controller.Edit", {
		onInit: function () {
			this.handleNavigationWithContext();
		},
		// Start of changes NSMI		
		confirm: function (evt) {
			//				this.handleNavigationWithContext1();			
			var t = this.getView().getModel();
			var _this = this;
			_this.getView().byId("progressId").setSelectedKey("01");
			_this.getView().byId("eqstatusId").setSelectedKey("02");
			var n = JSON.parse(evt.getSource().data("wiring").replace(/'/g, '"'));
			var a = evt.getId();
			var r = n[a].targets || [];
			r.forEach(function (evt2) {
				a = _this.byId(evt2.id);
				if (a) {
					var rn = {};
					for (var i in evt2.parameters) {
						rn[i] = evt.getParameter(evt2.parameters[i]);
					}
					a[evt2.action](r);
				}
			});
			var i = n[a].navigation;
			if (i) {
				var o = {};
				(i.keys || []).forEach(function (t) {
					o[t.name] = encodeURIComponent(JSON.stringify({
						value: evt.getSource().getBindingContext(i.model).getProperty(t.name)
							// type: t.type
					}));
				});
				if (Object.getOwnPropertyNames(o).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(i.routeName, o);
				} else {
					this.getOwnerComponent().getRouter().navTo(i.routeName);
				}
			}
		},
		// End of changes NSMI		
		onSave: function (evt) {
			var t = this.getView().getModel();
			var n = [];
			var a = this.getView().byId("multiInput").getTokens();
			a.forEach(function (evt1) {
				n.push(evt1.getText());
			});
			if (this.getView().byId("aufnrId").getText()) {
				var r = {
					Aufnr: this.getView().byId("aufnrId").getText(),
					Vornr: this.getView().byId("vornrId").getText(),
					Users: n.join(),
					Progress: this.getView().byId("progressId").getSelectedKey(),
					Eqstatus: this.getView().byId("eqstatusId").getSelectedKey(),
					Comments: this.getView().byId("commentsId").getValue()
				};
				var o = "/InfoBoardSet(Aufnr='" + r.Aufnr + "',Vornr='" + r.Vornr + "')";
				t.update(o, r, {
					success: function (evt2) {
						sap.m.MessageToast.show("Order Updated");
					},
					error: function (evt3) {
						MessageBox.error("Order Update Failed");
					}
				});
				t.attachRequestSent(function (oEvent) {
					sap.ui.core.BusyIndicator.show();
				});
				t.attachRequestCompleted(function (oEvent) {
					sap.ui.core.BusyIndicator.hide();
				});
				this.navBack(evt);
			} else {
				MessageBox.error("Error, Please refresh the page/contact support!");
			}
		},
		formatKey: function (evt) {
			var t = evt,
				n = this.byId("multiInput");
			n.removeAllTokens();
			if (t) {
				var r = t.split(",");
				r.forEach(function (evt1) {
					n.addToken(new Token({
						text: evt1
					}));
				});
			}
		},
		handleNavigationWithContext: function () {
			var that = this;
			var entitySet;
			var sRouteName;

			function _onBindingChange(oEvent) {
				if (!that.getView().getBindingContext()) {
					that.getOwnerComponent().getRouter().getTargets().display("");
				}
			}

			function _onRouteMatched(oEvent) {
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				oView = that.getView();
				var sPath = Object.keys(oArgs).map(function (evt) {
					var t = JSON.parse(decodeURIComponent(oArgs[evt]));
					return evt + "=" + (t.type === "Edm.String" ? "'" + t.value + "'" : t.value);
				}).join(",");
				oView.bindElement({
					path: entitySet + "(" + sPath + ")",
					events: {
						change: _onBindingChange.bind(that),
						dataRequested: function () {
							oView.setBusy(true);
						},
						dataReceived: function () {
							oView.setBusy(false);
						}
					}
				});
			}
			if (that.getOwnerComponent().getRouter) {
				var oRouter = that.getOwnerComponent().getRouter();
				var oManifest = this.getOwnerComponent().getMetadata().getManifest();
				var content = that.getView().getContent();
				if (content) {
					var oNavigation = oManifest["sap.ui5"].routing.additionalData;
					var oContext = oNavigation[that.getView().getViewName()];
					sRouteName = oContext.routeName;
					entitySet = oContext.entitySet;
					oRouter.getRoute(sRouteName).attachMatched(_onRouteMatched, that);
				}
			}
		},
		// start of changes NSMI
		handleNavigationWithContext1: function (evt) {
			var that = this;
			var entitySet;
			var sRouteName;

			function _onBindingChange(oEvent) {
				if (!that.getView().getBindingContext()) {
					that.getOwnerComponent().getRouter().getTargets().display("");
				}
			}
			if (that.getOwnerComponent().getRouter) {

				var oRouter = that.getOwnerComponent().getRouter();
				var oManifest = this.getOwnerComponent().getMetadata().getManifest();
				var content = that.getView().getContent();
				var n = JSON.parse(evt.getSource().data("wiring").replace(/'/g, '"'));
				if (content) {
					var oNavigation = oManifest["sap.ui5"].routing.additionalConfirmData;
					var oContext = oNavigation[that.getView().getViewName()];
					sRouteName = oContext.routeName;
					this.getOwnerComponent().getRouter().navTo(sRouteName, 'Aufnr');
				}
			}
		},
		// End of changes NSMI
		action: function (e) {
			var _this = this;
			_this.getView().byId("progressId").setSelectedKey("01");
			_this.getView().byId("eqstatusId").setSelectedKey("02");
			var n = JSON.parse(e.getSource().data("wiring").replace(/'/g, '"'));
			var a = e.getId();
			var r = n[a].targets || [];
			r.forEach(function (evt2) {
				a = _this.byId(evt2.id);
				if (a) {
					var rn = {};
					for (var i in evt2.parameters) {
						rn[i] = e.getParameter(evt2.parameters[i]);
					}
					a[evt2.action](r);
				}
			});
			var i = n[a].navigation;
			if (i) {
				var o = {};
				(i.keys || []).forEach(function (t) {
					o[t.name] = encodeURIComponent(JSON.stringify({
						value: e.getSource().getBindingContext(i.model).getProperty(t.name),
						type: t.type
					}));
				});
				if (Object.getOwnPropertyNames(o).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(i.routeName, o);
				} else {
					this.getOwnerComponent().getRouter().navTo(i.routeName);
				}
			}
		},
		handleValueHelp: function (e) {
			var t = this.getView().byId("varbplId").getText();
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.UserDialog", this);
				this.getView().addDependent(this._oDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			var a = [];
			if (t) {
				a.push(new Filter("Arbpl", FilterOperator.EQ, t));
			}
			var i = this._oDialog.getBinding("items");
			i.filter(a);
			this._oDialog.open();
		},
		_handleValueHelpClose: function (e) {
			var t = e.getParameter("selectedItems"),
				n = this.byId("multiInput");
			if (t && t.length > 0) {
				t.forEach(function (evt) {
					n.addToken(new Token({
						text: evt.getTitle()
					}));
				});
			}
		},
		navBack: function (evt) {
			var oHistory = sap.ui.core.routing.History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Home", true);
			}
		}
	});
});