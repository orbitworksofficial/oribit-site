import { requireUserPage } from "@/lib/auth";
import { listTagsWithCounts } from "@/lib/blogs";
import { deleteTagAction, saveTagAction } from "../actions";
import TaxonomyManager from "../categories/TaxonomyManager";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  await requireUserPage();
  const items = await listTagsWithCounts();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Tags</h1>
          <p>
            {items.length} tag{items.length === 1 ? "" : "s"} · a post can carry several
          </p>
        </div>
      </div>

      <TaxonomyManager
        items={items}
        saveAction={saveTagAction}
        deleteAction={deleteTagAction}
        noun="tag"
      />
    </>
  );
}
