import { metaTagsFragment, responsiveImageFragment } from "../lib/fragments";

type DatoCMSHeaders = {
  "Content-Type": "application/json";
  Accept: "application/json";
  Authorization: string;
  "X-Include-Drafts"?: "true";
};

type DatoCMSIncludeDraftsHeader = { "X-Include-Drafts": "true" };

type GetDatoCMSHeaders = (previewMode: boolean) => DatoCMSHeaders;

type GetPosts = (previewMode: boolean) => Promise<any>;

type GetPostBySlug = (previewMode: boolean) => (slug: string) => Promise<any>;

const _getDatoCMSHeaders =
  (headers: DatoCMSHeaders) =>
  (includeDraftsHeader: DatoCMSIncludeDraftsHeader) =>
  (previewMode = false) =>
    previewMode ? { ...headers, ...includeDraftsHeader } : headers;

const getDatoCMSHeaders: GetDatoCMSHeaders = _getDatoCMSHeaders({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${
    import.meta.env.ASTRO_EXAMPLE_CMS_DATOCMS_API_TOKEN
  }`,
})({
  "X-Include-Drafts": "true",
});

const _getPosts =
  (getDatoCMSHeaders: GetDatoCMSHeaders) =>
  async (previewMode = false) => {
    const getPostsQuery = {
      query: `{
    allPosts {
      slug
    }
  }`,
    };

    const headers = getDatoCMSHeaders(previewMode);

    const slugsResponse = await fetch("https://graphql.datocms.com", {
      method: "POST",
      headers,
      body: JSON.stringify(getPostsQuery),
    });

    const { data } = await slugsResponse.json();

    return data.allPosts;
  };

const _getPostBySlug =
  (getDatoCMSHeaders: GetDatoCMSHeaders) =>
  (previewMode = false) =>
  async (slug: string) => {
    const graphqlRequest = {
      query: `
            query PostBySlug($slug: String) {
              site: _site {
                favicon: faviconMetaTags {
                  ...metaTagsFragment
                }
              }
              post(filter: {slug: {eq: $slug}}) {
                seo: _seoMetaTags {
                  ...metaTagsFragment
                }
                title
                slug
                content {
                  value
                  blocks {
                    __typename
                    ...on ImageBlockRecord {
                      id
                      image {
                        responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
                          ...responsiveImageFragment
                        }
                      }
                    }
                  }
                }
                date
                ogImage: coverImage{
                  url(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 })
                }
                coverImage {
                  responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
                    ...responsiveImageFragment
                  }
                }
                author {
                  name
                  picture {
                    responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100}) {
                      ...responsiveImageFragment
                    }
                  }
                }
              }
      
              morePosts: allPosts(orderBy: date_DESC, first: 2, filter: {slug: {neq: $slug}}) {
                title
                slug
                excerpt
                date
                coverImage {
                  responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 2000, h: 1000 }) {
                    ...responsiveImageFragment
                  }
                }
                author {
                  name
                  picture {
                    responsiveImage(imgixParams: {fm: jpg, fit: crop, w: 100, h: 100, sat: -100}) {
                      ...responsiveImageFragment
                    }
                  }
                }
              }
            }
            
            ${responsiveImageFragment}
            ${metaTagsFragment}
          `,
      variables: {
        slug,
      },
    };

    const headers = getDatoCMSHeaders(previewMode);

    const response = await fetch("https://graphql.datocms.com", {
      method: "POST",
      headers,
      body: JSON.stringify(graphqlRequest),
    });

    const parsedResponse = await response.json();

    const { post, morePosts } = parsedResponse.data;

    return {
      post,
      morePosts,
    };
  };

export const getPosts: GetPosts = _getPosts(getDatoCMSHeaders);

export const getPostBySlug: GetPostBySlug = _getPostBySlug(getDatoCMSHeaders);
