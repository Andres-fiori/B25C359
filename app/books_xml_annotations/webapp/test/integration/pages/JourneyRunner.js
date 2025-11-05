sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"booksxmlannotations/test/integration/pages/BooksSetList",
	"booksxmlannotations/test/integration/pages/BooksSetObjectPage"
], function (JourneyRunner, BooksSetList, BooksSetObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('booksxmlannotations') + '/test/flp.html#app-preview',
        pages: {
			onTheBooksSetList: BooksSetList,
			onTheBooksSetObjectPage: BooksSetObjectPage
        },
        async: true
    });

    return runner;
});

