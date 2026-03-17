sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"legalguardians/test/integration/pages/LegalGuardiansSetList",
	"legalguardians/test/integration/pages/LegalGuardiansSetObjectPage",
	"legalguardians/test/integration/pages/PatientsSetObjectPage"
], function (JourneyRunner, LegalGuardiansSetList, LegalGuardiansSetObjectPage, PatientsSetObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('legalguardians') + '/test/flp.html#app-preview',
        pages: {
			onTheLegalGuardiansSetList: LegalGuardiansSetList,
			onTheLegalGuardiansSetObjectPage: LegalGuardiansSetObjectPage,
			onThePatientsSetObjectPage: PatientsSetObjectPage
        },
        async: true
    });

    return runner;
});

