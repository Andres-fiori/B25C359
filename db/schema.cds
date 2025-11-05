namespace BooksSRV;

using {
    cuid,
    managed,
    sap.common.CodeList,
    sap.common.Languages,
    sap.common.Currencies,
} from '@sap/cds/common';

entity Books : cuid, managed {
     
    bookCode        : String(10) @title: 'Código de Libro';
    title           : String(150) @title: 'Titulo';
    description     : String(250) @title: 'Descripción';
    author          : String(250) @title: 'Autor';
    category        : Association to Categories @title: 'Categorías';
    language        : Association to Languages @title: 'Idioma';
    publicationYear : Integer @title: 'Año';
    rating          : Decimal(3, 2) @title: 'Calificación';
    price           : Decimal(6, 2)             @Measures.ISOCurrency: currency_code @title: 'Precio';
    currency        : Association to Currencies @Common.IsCurrency @title: 'Moneda';
    stock           : Association to Status @title: 'Stock';
};

entity Categories : cuid {
       category    : String(150) @title: 'Categorías';
};

entity Years : cuid {
    year : String(4);
};

entity Status : CodeList {
    key code        : String enum {
            Available = 'In Stock';
            LowAvailability = 'Low Availability';
            NotAvailable = 'In Not Stock';
        };
        criticality : Int16;
};
