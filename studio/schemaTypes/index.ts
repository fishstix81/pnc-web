import { type SchemaTypeDefinition } from 'sanity'
import {epidode} from "./episode";
import {siteSettings} from "./siteSettings";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [epidode, siteSettings],
}
