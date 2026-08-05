import { notFound } from "next/navigation";

import { requireAdminPage } from "@/lib/auth";
import { countAdmins, getUserById } from "@/lib/users";
import UserForm from "../UserForm";

export const dynamic = "force-dynamic";

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage();
  const { id } = await params;

  const [user, admins] = await Promise.all([getUserById(id), countAdmins()]);
  if (!user) notFound();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>Edit user</h1>
          <p>{user.email}</p>
        </div>
      </div>

      <UserForm
        values={{
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
        }}
        submitLabel="Save changes"
        isEdit
        lockRole={user.role === "admin" && admins <= 1}
      />
    </>
  );
}
