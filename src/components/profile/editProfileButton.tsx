"use client";

import { useClerk } from "@clerk/nextjs";

import { profileContent } from "@/content/profile";

/**
 * Opens Clerk's built-in account-management modal. Reuses Clerk's UI so there's
 * no separate profile-edit route/backend to maintain.
 */
export function EditProfileButton() {
  const { openUserProfile } = useClerk();

  return (
    <button
      type="button"
      onClick={() => openUserProfile()}
      className="w-full rounded-full border border-surface-border px-4 py-2.5 text-sm font-bold text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary"
    >
      {profileContent.info.editProfile}
    </button>
  );
}
