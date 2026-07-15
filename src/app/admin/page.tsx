import { redirect } from "next/navigation";

/** Listados is the only built section — land admins there directly. */
export default function AdminPage() {
  redirect("/admin/listings");
}
