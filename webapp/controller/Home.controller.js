sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("zpm.zpm_infoboard.controller.Home", {
		onInit: function () {
			sap.ui.getCore().getConfiguration().setLanguage("en-GB");
			this.getView().byId("sdateId").setDateValue(new Date());
				this.getOwnerComponent().getRouter().getRoute('Home').attachPatternMatched(this._onRouteMatched, this);
		},

 _onRouteMatched: function (oEvent) { 
	 		      //this.getView().byId("table0").getModel().refresh(true);
	 		      this.getView().byId("table0").getBinding("items").refresh();
			},
		action: function (e) {
			var that = this;
			var r = JSON.parse(e.getSource().data("wiring").replace(/'/g, '"'));
			var a1 = e.getId();
			var i = r[a1].targets || [];
			i.forEach(function (evt2) {
				var a = that.byId(r.id);
				if (a) {
					var i1 = {};
					for (var n in r.parameters) {
						i1[n] = evt2.getParameter(r.parameters[n]);
					}
					a[r.action](i1);
				}
			});
			var n = r[a1].navigation;
			if (n) {
				var o = {};
				(n.keys || []).forEach(function (t) {
					o[t.name] = encodeURIComponent(JSON.stringify({
						value: e.getSource().getBindingContext(n.model).getProperty(t.name),
						type: t.type
					}));
				});
				if (Object.getOwnPropertyNames(o).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(n.routeName, o);
				} else {
					this.getOwnerComponent().getRouter().navTo(n.routeName);
				}
			}
		},
		onSearch: function (evt) {
			var l = this.getInputValues(evt);
			var u = this.getView().byId("table0");
			var p = u.getBinding("items");
			p.filter(l, sap.ui.model.FilterType.Application);
		},
		getInputValues: function (evt) {
			var t = this.byId("pgId").getSelectedKey();
			var r = this.byId("sdateId").getValue();
			//var a = this.byId("fdateId").getValue();
			var funcLoc = this.byId("funcLocId").getValue();
			var i = this.byId("workcenterId").getSelectedKey();
			var n = new sap.ui.model.Filter("Ingpr", sap.ui.model.FilterOperator.EQ, t);
			var o = new sap.ui.model.Filter("Fsavd", sap.ui.model.FilterOperator.EQ, r);
			//var s = new sap.ui.model.Filter("Fsedd", sap.ui.model.FilterOperator.EQ, a);
			var d = new sap.ui.model.Filter("VArbpl", sap.ui.model.FilterOperator.EQ, i);
			var func = new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.EQ, funcLoc);
			var l = [];
			l.push(n);
			l.push(o);
			l.push(func);
			//l.push(s);
			l.push(d);
			return l;
		},
		Txtprogress: function (evt) {
			if (evt) {
				return evt;
			} else {
				return "Not Started";
			}
		},
		Txteqstatus: function (evt) {
			if (evt) {
				return evt;
			} else {
				return "EQ not isolated";
			}
		},
		handleRefresh: function (evt) {
			var t = this.byId("refreshId").getState();
			if (t) {
				var r = this;
				this.timer = setInterval(function () {
					r.onSearch();
				}, 3e5);
			} else {
				clearInterval(this.timer);
			}
		},
		onFresh: function (evt) {
			this.getView().byId("table0").getBinding("items").refresh();
		},
		onGroup: function (oEvent) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.GroupSortDialog",
					this);
			}
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
				this._oDialog);
			this._oDialog.open();
		},
		Status: function (oEvent) {
			if (oEvent === "0") { //Emergency
				return "Reject";
			} else if (oEvent === "1") { //Very High
				return "Accept";
			} else if (oEvent === "2") { //Medium
				return "Emphasized";
			} else {
				return "Ghost"; //Low
			}
		},
		handleConfirmInDialog: function (oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("table0");
			var mParams = oEvent.getParameters();
			var oBinding = oTable.getBinding("items");
			// apply sorter to binding
			// (grouping comes before sorting)
			var aSorters = [];
			var sPath, bDescending, vGroup;
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = function (oContext) {
					var name = oContext.getProperty(sPath);
					return {
						key: name,
						text: name
					};
				};
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending,
					vGroup));
			} else {
				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			}
			oBinding.sort(aSorters);
		}
	});
});