/**
 * Restyles Clerk's `<SignIn />` / `<SignUp />` to match the Auth-page design handoff:
 * no card chrome (the widget sits directly on the split-screen page), pill-shaped
 * buttons, 12px inputs. Values reference the CSS custom properties in `globals.css`
 * — never raw hex.
 */
export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "var(--bg-surface)",
    colorInputBackground: "var(--bg-surface)",
    colorInputText: "var(--text-primary)",
    colorText: "var(--text-primary)",
    colorTextSecondary: "var(--text-secondary)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    colorNeutral: "var(--text-muted)",
    colorShimmer: "var(--bg-subtle)",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-jakarta-sans)",
  },
  elements: {
    rootBox: "w-full",
    cardBox: "w-full shadow-none bg-transparent",
    card: "w-full border-none bg-transparent p-0 shadow-none",
    header: "gap-1.5 mb-1",
    headerTitle: "text-3xl font-extrabold leading-[1.1] tracking-tight text-copy-primary sm:text-4xl",
    headerSubtitle: "text-[15.5px] leading-relaxed text-copy-secondary",
    socialButtons: "gap-2",
    socialButtonsBlockButton:
      "rounded-full border-[1.5px] border-surface-border bg-surface px-4 py-[13px] transition-colors hover:border-subtle-border hover:bg-subtle active:scale-[.985]",
    socialButtonsBlockButtonText: "text-[15px] font-bold text-copy-primary",
    dividerRow: "gap-3.5 my-5",
    dividerLine: "bg-surface-border",
    dividerText: "text-xs font-semibold text-copy-muted",
    formFieldLabel: "text-[13.5px] font-bold text-copy-primary",
    formFieldLabelRow: "mb-[7px]",
    formFieldInput:
      "rounded-xl border-[1.5px] border-surface-border bg-surface px-[15px] py-[13px] text-[15px] text-copy-primary placeholder:text-copy-faint focus:border-brand focus:shadow-[0_0_0_3px_var(--accent-primary-dim)] focus:ring-0",
    formFieldInputShowPasswordButton: "rounded-lg text-copy-muted hover:bg-subtle hover:text-copy-primary",
    formFieldAction: "text-[13px] font-bold text-brand hover:text-brand-hover",
    formFieldHintText: "text-copy-muted",
    formFieldErrorText: "text-error",
    formFieldSuccessText: "text-success",
    formFieldWarningText: "text-warning",
    formFieldRow: "gap-4",
    formButtonPrimary:
      "mt-1 w-full rounded-full bg-brand px-4 py-[14px] text-[15.5px] font-bold normal-case text-white shadow-[0_4px_16px_rgba(12,86,120,.28)] hover:bg-brand-hover active:scale-[.985]",
    footer: "hidden",
    identityPreview: "rounded-xl border-surface-border bg-subtle",
    identityPreviewText: "text-copy-primary",
    identityPreviewEditButton: "text-brand hover:text-brand-hover",
    otpCodeFieldInputs: "gap-2",
    otpCodeFieldInput:
      "aspect-square rounded-xl border-[1.5px] border-surface-border bg-surface text-[22px] font-bold text-copy-primary focus:border-brand focus:shadow-[0_0_0_3px_var(--accent-primary-dim)]",
    alertText: "text-sm text-error",
    badge: "rounded-full bg-accent-dim text-brand",
    button: "shadow-none",
  },
} as const;
