import { Alert } from "./alert";
import { Footer } from "./footer";

export default function Layout({ previewMode, currentSlug, children }) {
  return (
    <>
      <Alert previewMode={previewMode} currentSlug={currentSlug} />
      <div className="min-h-screen">
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
}
