import { requireAdminPage } from "@/lib/auth";
import UserForm from "../UserForm";

export const dynamic = "force-dynamic";

export default async function NewUser() {
  await requireAdminPage();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Add user</h1>
          <p>Authors can write and publish. Admins can also manage users and SEO.</p>
        </div>
      </div>

      <UserForm
        values={{ name: "", email: "", role: "author" }}
        submitLabel="Create user"
        isEdit={false}
      />
    </>
  );
}
