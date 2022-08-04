const _getPostUrl =
  (previewPathName: string) =>
  (postPathName: string) =>
  (preview: boolean) =>
  (slug: string) =>
    preview
      ? `/${previewPathName}/${postPathName}/${slug}`
      : `/${postPathName}/${slug}`;

export const getPostUrl = _getPostUrl("preview")("posts");

export const getPostPaths = (posts: any[]) => {
  let paths = [];

  posts.map(({ slug }) => {
    paths = [...paths, { params: { slug } }];
  });

  return paths;
};
