sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"bookscapcdsannotations/test/integration/pages/BooksSetList",
	"bookscapcdsannotations/test/integration/pages/BooksSetObjectPage"
], function (JourneyRunner, BooksSetList, BooksSetObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('bookscapcdsannotations') + '/test/flp.html#app-preview',
        pages: {
			onTheBooksSetList: BooksSetList,
			onTheBooksSetObjectPage: BooksSetObjectPage
        },
        async: true
    });

    return runner;
});

