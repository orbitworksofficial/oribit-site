import { requireUserPage } from "@/lib/auth";
import PageSeoForm from "../PageSeoForm";
import type { SeoValues } from "../SeoFields";

export const dynamic = "force-dynamic";

const EMPTY: SeoValues = {
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  canonicalUrl: "",
  robots: "index, follow",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "website",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterCard: "summary",
  schemaMarkup: "",
};

export default async function NewPageSeo() {
  await requireUserPage();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Add page</h1>
          <p>Point this at a route that already exists on the site.</p>
        </div>
      </div>

      <PageSeoForm values={EMPTY} pageKey="" pageName="" isNew />
    </>
  );
}
