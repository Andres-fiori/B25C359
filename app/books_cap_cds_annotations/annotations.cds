using BooksSRV as service from '../../srv/books';

annotate service.BooksSet with  @(
    UI.SelectionFields: [
        bookCode,
        author,
        category_ID,
        language_code,
        stock_code
    ]
);


annotate service.BooksSet with @(
    //Busqueda con restricciones
    Capabilities.FilterRestrictions : {
        $Type                       : 'Capabilities.FilterRestrictionsType',
        FilterExpressionRestrictions: [{
            $Type             : 'Capabilities.FilterExpressionRestrictionType',
            Property          : bookCode,
            AllowedExpressions: 'SearchExpression',
        }, ],
    },

    //Datos de cabecera de ObjectPage
    UI.HeaderInfo                   : {
        $Type         : 'UI.HeaderInfoType',
        TypeName      : 'Book',
        TypeNamePlural: 'Books',
        Title         : {
            $Type: 'UI.DataField',
            Value: title,
        },
        Description   : {
            $Type: 'UI.DataField',
            Value: bookCode,
        },
    },
    //Columnas de la tabla
    UI.LineItem                     : [
        {
            $Type: 'UI.DataField',
            Value: bookCode,
        },
        {
            $Type: 'UI.DataField',
            Value: title,
        },
        {
            $Type: 'UI.DataField',
            Value: description,
        },
        {
            $Type: 'UI.DataField',
            Value: author,
        },
        {
            $Type: 'UI.DataField',
            Value: category.category,
        },
        {
            $Type: 'UI.DataField',
            Value: language_code,
        },
        {
            $Type: 'UI.DataField',
            Value: rating,
        },
        {
            $Type: 'UI.DataField',
            Value: stock_code,
        },
        {
            $Type: 'UI.DataField',
            Value: price,
        },
    ],
    //Campos en ObjectPage
    UI.FieldGroup #BooksInformations: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Value: bookCode,
                Label: 'Book Code',
            },
            {
                $Type: 'UI.DataField',
                Value: title,
                Label: 'Title',
            },
            {
                $Type: 'UI.DataField',
                Value: description,
                Label: 'Descriptions',
            },
            {
                $Type: 'UI.DataField',
                Value: author,
                Label: 'Author',
            },
            {
                $Type: 'UI.DataField',
                Value: category.category,
                Label: 'Categorias',
            },
            {
                $Type: 'UI.DataField',
                Value: language_code,
                Label: 'Language',
            },
            {
                $Type: 'UI.DataField',
                Value: rating,
                Label: 'Rating',
            },
            {
                $Type: 'UI.DataField',
                Value: stock_code,
                Label: 'Staus',
            },
            {
                $Type: 'UI.DataField',
                Value: price,
                Label: 'Price',
            },
        ],
    },
    //Facet(pestaña) para ObjectPage
    UI.Facets                       : [{
        $Type : 'UI.ReferenceFacet',
        Target: '@UI.FieldGroup#BooksInformations',
        Label : 'Books Informations',
    }, ]
);

annotate service.BooksSet with {
    category @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'VH_Categories',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: category_ID,
                ValueListProperty: 'ID',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'category',
            },
        ],
    }
};

annotate service.BooksSet with {
    author @Common.ValueList: {
        $Type         : 'Common.ValueListType',
        CollectionPath: 'BooksSet',
        Parameters    : [
            {
                $Type            : 'Common.ValueListParameterInOut',
                LocalDataProperty: author,
                ValueListProperty: 'ID',
            },
            {
                $Type            : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty: 'author',
            },
        ],
    }
};
