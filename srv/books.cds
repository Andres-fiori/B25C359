using {BooksSRV as entities} from '../db/schema';

service BooksSRV {
    entity BooksSet as projection on entities.Books;
    @readonly
    entity VH_Categories as projection on entities.Categories;
    @readonly
    entity VH_Status  as projection on entities.Status;
    @readonly
    entity VH_Years as projection on entities.Years order by year desc;
}
