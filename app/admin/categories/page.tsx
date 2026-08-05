import { requireUser } from "@/lib/auth";
import { listCategoriesWithCounts } from "@/lib/blogs";
import { deleteCategoryAction, saveCategoryAction } from "../actions";
import TaxonomyManager from "./TaxonomyManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  await requireUser();
  const items = await listCategoriesWithCounts();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Categories</h1>
          <p>
            {items.length} categor{items.length === 1 ? "y" : "ies"} · a post belongs to one
          </p>
        </div>
      </div>

      <TaxonomyManager
        items={items}
        saveAction={saveCategoryAction}
        deleteAction={deleteCategoryAction}
        noun="category"
        withDescription
      />
    </>
  );
}
