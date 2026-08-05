import { requireUser } from "@/lib/auth";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // Any signed-in user, admin or author — everyone can manage their own account.
  const me = await requireUser();

  return (
    <>
      <div className="adm__head">
        <div>
          <h1>My account</h1>
          <p>
            Signed in as {me.email} · {me.role}
          </p>
        </div>
      </div>

      <ProfileForm name={me.name} email={me.email} />
    </>
  );
}
