import { notFound } from "next/navigation";

import { requireUserPage } from "@/lib/auth";
import { getPageSeoById } from "@/lib/seo-settings";
import PageSeoForm from "../PageSeoForm";
import type { SeoValues } from "../SeoFields";

export const dynamic = "force-dynamic";

export default async function EditPageSeo({ params }: { params: Promise<{ id: string }> }) {
  await requireUserPage();
  const { id } = await params;

  const doc = await getPageSeoById(id);
  if (!doc) notFound();

  const values: SeoValues = {
    seoTitle: doc.seoTitle ?? "",
    seoDescription: doc.seoDescription ?? "",
    seoKeywords: doc.seoKeywords ?? "",
    canonicalUrl: doc.canonicalUrl ?? "",
    robots: doc.robots ?? "index, follow",
    ogTitle: doc.ogTitle ?? "",
    ogDescription: doc.ogDescription ?? "",
    ogImage: doc.ogImage ?? "",
    ogType: doc.ogType ?? "website",
    twitterTitle: doc.twitterTitle ?? "",
    twitterDescription: doc.twitterDescription ?? "",
    twitterImage: doc.twitterImage ?? "",
    twitterCard: doc.twitterCard ?? "summary",
    schemaMarkup: doc.schemaMarkup ?? "",
  };

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>{doc.pageName}</h1>
          <p>{doc.pageKey}</p>
        </div>
      </div>

      <PageSeoForm
        values={values}
        faqs={doc.faqs ?? []}
        pageKey={doc.pageKey}
        pageName={doc.pageName}
        isNew={false}
      />
    </>
  );
}
