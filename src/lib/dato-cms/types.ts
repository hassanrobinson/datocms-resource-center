export namespace DatoCMSTypes {
  export type ApiHeaders = {
    "Content-Type": "application/json";
    Accept: "application/json";
    Authorization: string;
    "X-Include-Drafts"?: "true";
  };

  export type IncludeDraftsApiHeader = { "X-Include-Drafts": "true" };

  export type GetApiHeaders = (previewMode: boolean) => ApiHeaders;

  export type GetPosts = (previewMode: boolean) => Promise<any>;

  export type GetPostBySlug = (
    previewMode: boolean
  ) => (slug: string) => Promise<any>;
}
