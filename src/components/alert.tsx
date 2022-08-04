import { Container } from "./container";
import cn from "classnames";
import { useEffect, useState } from "react";

const useDraftPublished = ({ previewMode }) => {
  const [url, setUrl] = useState("/");
  const status = previewMode ? "draft" : "published";
  const action = previewMode ? "exit" : "enter";

  const getContentUrl = (urlPath: string) =>
    previewMode ? urlPath.slice(8) : `/preview${urlPath}`;

  useEffect(() => {
    const urlPath = window.location.pathname;
    const newContentUrl = getContentUrl(urlPath);

    setUrl(newContentUrl);
  });

  return { action, status, url };
};

export const Alert = ({ previewMode }) => {
  const { action, status, url } = useDraftPublished({ previewMode });

  return (
    <div
      className={cn("border-b", {
        "bg-accent-7 border-accent-7 text-white": previewMode,
        "bg-accent-1 border-accent-2": !previewMode,
      })}
    >
      <Container>
        <div className="py-2 text-center text-sm">
          <>
            This is page is showing {status} content.{" "}
            <a
              href={url}
              className="underline hover:text-cyan duration-200 transition-colors"
            >
              Click here
            </a>{" "}
            to {action} preview mode.
          </>
        </div>
      </Container>
    </div>
  );
};
