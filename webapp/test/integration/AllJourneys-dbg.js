/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"zpm/zpm_infoboard/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zpm/zpm_infoboard/test/integration/pages/Home",
	"zpm/zpm_infoboard/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zpm.zpm_infoboard.view.",
		autoWait: true
	});
});