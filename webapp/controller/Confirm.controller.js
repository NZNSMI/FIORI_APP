sap.ui.define(["sap/ui/core/Fragment", "sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter", "sap/m/Token", "sap/ui/model/FilterOperator",
	"sap/m/MessageBox", "sap/ui/model/json/JSONModel"
], function (Frag, Controller, Filter, Token, FilterOperator, MessageBox, JSONModel) {
	"use strict";

	return Controller.extend("zpm.zpm_infoboard.controller.Confirm", {
		onInit: function () {
			// this.handleNavigationWithContext();
			this.getOwnerComponent().getRouter().getRoute('Confirm').attachPatternMatched(this._onRouteMatched1, this);
		},

		_onRouteMatched1: function (oEvent) {

			var Aufnr = decodeURI(oEvent.getParameter('arguments').Aufnr).split('"')[3];
			var Vornr = decodeURI(oEvent.getParameter('arguments').Vornr).split('"')[3];
			var oHeaderModel = new JSONModel([]);
			var sServiceURL = this.getView().getModel().sServiceUrl;
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceURL, false);
			var oFilters = [];
			oFilters.push(new Filter("Key", FilterOperator.EQ, Aufnr.toString()));
			oFilters.push(new Filter("Key", FilterOperator.EQ, Vornr.toString()));
			var mParameters = {
				filters: [oFilters],
				success: function (oData) {
					var Dauno = oData.results[0].WHour;
					var Daune = oData.results[0].WUnit;
					var Fsavd = oData.results[0].Fsavd;
					var pcode = oData.results[0].CODE;
					var probtxt = oData.results[0].KURZTEXT;
					var Problem = oData.results[0].Problem;
					var action = oData.results[0].Action;
					var cause = oData.results[0].Cause;
					if (action == 'X') {
						var Action = true
					} else {
						Action = false
					}
					if (cause == 'X') {
						var Cause = true
					}
					else {
						Cause = false
					}
					oHeaderModel.setData({
						"Aufnr": Aufnr,
						"Vornr": Vornr,
						"Dauno": Dauno,
						"Daune": Daune,
						"Fsavd": Fsavd,
						"Pcode": pcode,
						"Probtxt": probtxt,
						"Action": Action,
						"Cause": Cause,
						"Problem": Problem,
						"EmrAction": false
					})
					this.getView().setModel(oHeaderModel, "HeaderModel");
				}.bind(this),
				error: function () {}.bind(this)
			};
			oDataModel.read("/DurationSet", mParameters);
			oHeaderModel.setData({
				"Aufnr": Aufnr,
				"Vornr": Vornr
			})
			this.getView().setModel(oHeaderModel, "HeaderModel");
			// clearing the f4 selected values 	
			this.byId("fcId").setSelected(false)
			this.byId("corId").setSelected(false)
			this.byId("nrwId").setSelected(false)
			this.byId("actionId").setValue("")
			this.byId("actionId").setDescription("")
			this.byId("emractionId").setValue("")
			this.byId("emractionId").setDescription("")
				// this.byId("probId").setValue("")
				// this.byId("probId").setDescription("")
			this.byId("causeId").setValue("")
			this.byId("causeId").setDescription("")
			this.byId("ctId").setValue("")

		},

		onAction: function (e) {
			var _this = this;
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
			// clearing the f4 selected values 	
			this.byId("fcId").setSelected(false)
			this.byId("corId").setSelected(false)
			this.byId("nrwId").setSelected(false)
			this.byId("actionId").setValue("")
			this.byId("actionId").setDescription("")
			this.byId("emractionId").setValue("")
			this.byId("emractionId").setDescription("")
				// this.byId("probId").setValue("")
				// this.byId("probId").setDescription("")
			this.byId("causeId").setValue("")
			this.byId("causeId").setDescription("")
			this.byId("ctId").setValue("")

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
		actionValueHelpRequest: function (e) {
			var Aufnr = this.getView().getModel("HeaderModel").oData.Aufnr;

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.F4Generic", this);
				this.getView().addDependent(this._oDialog);

			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			var a = [];
			if (Aufnr) {
				a.push(new Filter("Key", FilterOperator.EQ, Aufnr.toString()));
			}
			a.push(new Filter("ValueHelpType", FilterOperator.EQ, 'Action'));
			this.ValuehelpType = 'Action';
			var i = this._oDialog.getBinding("items");
			i.filter(a);
			this._oDialog.open();

		},
		emractionValueHelpRequest: function (e) {
			var Aufnr = this.getView().getModel("HeaderModel").oData.Aufnr;

			if (!this._oDialog) {

				this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.F4Generic", this);
				this.getView().addDependent(this._oDialog);

			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			var a = [];
			if (Aufnr) {
				a.push(new Filter("Key", FilterOperator.EQ, Aufnr.toString()));
			}
			a.push(new Filter("ValueHelpType", FilterOperator.EQ, 'EmrAction'));
			this.ValuehelpType = 'EmrAction';
			var i = this._oDialog.getBinding("items");
			i.filter(a);
			this._oDialog.open();

		},
		_ValueHelpSearch: function (e) {
			if (this.ValuehelpType === 'Action') {
				var t = e.getParameters("selectedItems");
				var Aufnr = this.getView().getModel("HeaderModel").oData.Aufnr;
				var key = t.value;
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.F4Generic", this);
					this.getView().addDependent(this._oDialog);
				}
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				var a = [];
				if (Aufnr) {
					a.push(new Filter("Key", FilterOperator.EQ, Aufnr.toString()));
				}
				a.push(new Filter("ValueHelpType", FilterOperator.EQ, 'Action'));
				a.push(new Filter("Key", FilterOperator.EQ, key.toString()));
				var i = this._oDialog.getBinding("items");
				i.filter(a);
				this._oDialog.open();
			}
			if (this.ValuehelpType === 'Problem') {
				var t = e.getParameters("selectedItems");
				var key = t.value;
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.F4Generic", this);
					this.getView().addDependent(this._oDialog);
				}
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				var a = [];
				a.push(new Filter("ValueHelpType", FilterOperator.EQ, 'Problem'));
				a.push(new Filter("Key", FilterOperator.EQ, key.toString()));
				var i = this._oDialog.getBinding("items");
				i.filter(a);
				this._oDialog.open();
			}
			if (this.ValuehelpType === 'Cause') {
				var t = e.getParameters("selectedItems");
				var key = t.value;
				//		var valuehelptype = this.ValuehelpType;
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.F4Generic", this);
					this.getView().addDependent(this._oDialog);
				}
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				var a = [];
				a.push(new Filter("ValueHelpType", FilterOperator.EQ, 'Cause'));
				a.push(new Filter("Key", FilterOperator.EQ, key.toString()));
				var i = this._oDialog.getBinding("items");
				i.filter(a);
				this._oDialog.open();
			}
		},
		probValueHelpRequest: function (evt) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.F4Generic", this);
				this.getView().addDependent(this._oDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			var a = [];
			a.push(new Filter("ValueHelpType", FilterOperator.EQ, 'Problem'));
			this.ValuehelpType = 'Problem';
			var i = this._oDialog.getBinding("items");
			i.filter(a);
			this._oDialog.open();
		},

		causeValueHelpRequest: function (evt) {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("zpm.zpm_infoboard.view.F4Generic", this);
				this.getView().addDependent(this._oDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			var a = [];
			a.push(new Filter("ValueHelpType", FilterOperator.EQ, 'Cause'));
			this.ValuehelpType = 'Cause';
			var i = this._oDialog.getBinding("items");
			i.filter(a);
			this._oDialog.open();
		},
		_ValueHelpClose: function (e) {
			var t = e.getParameter("selectedItem");
			var n = this._oDialog.getId();
			var i = e.getParameter("selectedItem").getTitle();
			var text = e.getParameter("selectedItem").getDescription();
			if (this.ValuehelpType === 'Action') {
				this.byId("actionId").setValue(i)
				this.byId("actionId").setDescription(text)
			}
			if (this.ValuehelpType === 'EmrAction') {
				this.byId("emractionId").setValue(i)
				this.byId("emractionId").setDescription(text)
			}
			// if (this.ValuehelpType === 'Problem') {

			// 	this.byId("probId").setValue(i)
			// 	this.byId("probId").setDescription(text)

			// }
			if (this.ValuehelpType === 'Cause') {
				this.byId("causeId").setValue(i)
				this.byId("causeId").setDescription(text)
			}
		},
		onSave: function (evt) {
			var oFilters = [];
			var sServiceURL = this.getView().getModel().sServiceUrl;
			var oDataModel = new sap.ui.model.odata.ODataModel(sServiceURL, false);
			var t = this.getView().getModel();
			var n = [];
			var Aufnr = this.getView().getModel("HeaderModel").oData.Aufnr;
			var Vornr = this.getView().getModel("HeaderModel").oData.Vornr;
			var conf = this.byId("ctId").getValue();
			oFilters.push(new Filter("Aufnr", FilterOperator.EQ, Aufnr.toString()));
			oFilters.push(new Filter("Vornr", FilterOperator.EQ, Vornr.toString()));
			oFilters.push(new Filter("ActWork", FilterOperator.EQ, this.byId("actwokId").mProperties.value.toString()));
			oFilters.push(new Filter("UnitOfWork", FilterOperator.EQ, this.byId("ufwId").getText().toString()));
			oFilters.push(new Filter("FC", FilterOperator.EQ, this.byId("fcId").getSelected().toString()));
			oFilters.push(new Filter("NR", FilterOperator.EQ, this.byId("nrwId").getSelected().toString()));
			oFilters.push(new Filter("COR", FilterOperator.EQ, this.byId("corId").getSelected().toString()));
			oFilters.push(new Filter("EMR", FilterOperator.EQ, this.byId("emrId").getSelected().toString()));
			oFilters.push(new Filter("Action", FilterOperator.EQ, this.byId("actionId").mProperties.value.toString()));
			oFilters.push(new Filter("EmrAction", FilterOperator.EQ, this.byId("emractionId").mProperties.value.toString()));
			//	oFilters.push(new Filter("ProbCode", FilterOperator.EQ, this.byId("probId").mProperties.value.toString()));
			oFilters.push(new Filter("PCD", FilterOperator.EQ, this.byId("probId").getText().toString()));
			oFilters.push(new Filter("CauseCode", FilterOperator.EQ, this.byId("causeId").mProperties.value.toString()));
			oFilters.push(new Filter("CCD", FilterOperator.EQ, this.byId("causeId").mProperties.description.toString()));
			oFilters.push(new Filter("ConfirmationTxt", FilterOperator.EQ, conf.toString()));
			sap.ui.core.BusyIndicator.show();
			var mParameters = {
				filters: [oFilters],
				success: function (oData) {
					sap.ui.core.BusyIndicator.hide();
					sap.ui.core.UIComponent.getRouterFor(this).navTo("Home");
				}.bind(this),
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					var arr = [];
					$(oError.response.body).find('message').each(function (index) {
						arr.push($(this).text());
					})

					function unique(list) {
						var result = [];
						$.each(list, function (i, e) {
							if ($.inArray(e, result) == -1) result.push(e);
						});
						return result;
					}
					arr = unique(arr);
					var t = '';
					for (var i = 0; i < arr.length; i++) {
						t = t + '\n' + i + '.  ' + arr[i];
					}
					MessageBox.error(t);
				}.bind(this)
			};

			oDataModel.read("/ConfirmationSet", mParameters);

		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf zpm.zpm_infoboard.view.Confirm
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf zpm.zpm_infoboard.view.Confirm
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf zpm.zpm_infoboard.view.Confirm
		 */
		//	onExit: function() {
		//
		//	}

	});
});