import PostBody from "./post-body";
import PostHeader from "./post-header";

export const Post = ({ post }) => {
  return (
    <>
      <article>
        <PostHeader
          title={post.title}
          coverImage={post.coverImage}
          date={post.date}
          author={post.author}
        />
        <PostBody content={post.content} />
      </article>
    </>
  );
};
