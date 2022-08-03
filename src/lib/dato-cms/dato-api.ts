import { metaTagsFragment, responsiveImageFragment } from "./graphql-fragments";
import { DatoCMSTypes } from "./types";
import { DatoCMSUtils } from "./utils";

export namespace DatoCMSApi {
  const _getPosts =
    (getHeaders: DatoCMSTypes.GetApiHeaders) =>
    async (previewMode = false) => {
      const getPostsQuery = {
        query: `{
    allPosts {
      slug
    }
  }`,
      };

      const headers = getHeaders(previewMode);

      const slugsResponse = await fetch("https://graphql.datocms.com", {
        method: "POST",
        headers,
        body: JSON.stringify(getPostsQuery),
      });

      const { data } = await slugsResponse.json();

      return data.allPosts;
    };

  const _getPostBySlug =
    (getHeaders: DatoCMSTypes.GetApiHeaders) =>
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

      const headers = getHeaders(previewMode);

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

  const getHeaders = DatoCMSUtils.getHeaders;

  export const getPosts: DatoCMSTypes.GetPosts = _getPosts(getHeaders);

  export const getPostBySlug: DatoCMSTypes.GetPostBySlug =
    _getPostBySlug(getHeaders);
}
