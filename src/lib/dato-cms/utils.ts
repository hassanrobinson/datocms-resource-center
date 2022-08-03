import { DatoCMSTypes } from "./types";

export namespace DatoCMSUtils {
  const _getDatoCMSHeaders =
    (headers: DatoCMSTypes.ApiHeaders) =>
    (includeDraftsHeader: DatoCMSTypes.IncludeDraftsApiHeader) =>
    (previewMode = false) =>
      previewMode ? { ...headers, ...includeDraftsHeader } : headers;

  export const getHeaders: DatoCMSTypes.GetApiHeaders = _getDatoCMSHeaders({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${
      import.meta.env.ASTRO_EXAMPLE_CMS_DATOCMS_API_TOKEN
    }`,
  })({
    "X-Include-Drafts": "true",
  });
}
