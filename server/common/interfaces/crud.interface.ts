import {SearchResult} from "./search_result.interface";

export interface CRUD<Type> {
    create: (resource: any) => Promise<Type>,
    updateById: (resourceId: any) => Promise<string>,
    readById: (resourceId: any) => Promise<Type>,
    deleteById: (resourceId: any) => Promise<string>,
    patchById: (resourceId: any) => Promise<string>,
    search:(query: string) => Promise<SearchResult<Type>>,
}