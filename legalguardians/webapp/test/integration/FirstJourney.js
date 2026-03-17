sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheLegalGuardiansSetList.iSeeThisPage();
            Then.onTheLegalGuardiansSetList.onFilterBar().iCheckFilterField("Type Document");
            Then.onTheLegalGuardiansSetList.onFilterBar().iCheckFilterField("Number Document");
            Then.onTheLegalGuardiansSetList.onFilterBar().iCheckFilterField("Gender");
            Then.onTheLegalGuardiansSetList.onFilterBar().iCheckFilterField("Civil Status");
            Then.onTheLegalGuardiansSetList.onTable().iCheckColumns(7, {"typeDocument_ID":{"header":"Type Document"},"numberDocument":{"header":"Number Document"},"nameAndSurname":{"header":"Name and Surname"},"gender_ID":{"header":"Gender"},"civilStatus_ID":{"header":"Civil Status"},"birthDate":{"header":"Birth Date"},"nationality":{"header":"Nationality"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheLegalGuardiansSetList.onFilterBar().iExecuteSearch();
            
            Then.onTheLegalGuardiansSetList.onTable().iCheckRows();

            When.onTheLegalGuardiansSetList.onTable().iPressRow(0);
            Then.onTheLegalGuardiansSetObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});