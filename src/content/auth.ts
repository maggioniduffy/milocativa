/** Our own page-level copy around the Clerk widgets (not part of Clerk's `localization` prop). */
export const authContent = {
  tabs: { login: "Ingresar", signup: "Crear cuenta" },
  login: {
    eyebrow: "Bienvenido de nuevo",
    switchPrompt: { question: "¿Todavía no tenés cuenta?", action: "Crear cuenta" },
  },
  signup: {
    eyebrow: "Sumate a MILOCATIVA",
    switchPrompt: { question: "¿Ya tenés una cuenta?", action: "Ingresar" },
  },
  photoPanel: {
    pill: "Añelo · Vaca Muerta",
    headingPrefix: "Todo el catálogo del shale, ",
    headingEmphasis: "en un solo lugar",
    stats: [
      { value: "+120", label: "activos" },
      { value: "3", label: "categorías" },
      { label: "Gestión 100% local" },
    ],
  },
} as const;

/**
 * Full Spanish override for Clerk's `<SignIn />` / `<SignUp />` default English copy.
 * Passed as the `localization` prop so no Clerk default string leaks through.
 */
export const clerkLocalization = {
  locale: "es-AR",
  socialButtonsBlockButton: "Continuar con {{provider|titleize}}",
  dividerText: "o con tu correo",
  formFieldLabel__emailAddress: "Correo electrónico",
  formFieldLabel__emailAddress_username: "Correo electrónico o usuario",
  formFieldLabel__password: "Contraseña",
  formFieldLabel__currentPassword: "Contraseña actual",
  formFieldLabel__newPassword: "Contraseña nueva",
  formFieldLabel__confirmPassword: "Confirmar contraseña",
  formFieldLabel__firstName: "Nombre",
  formFieldLabel__lastName: "Apellido",
  formFieldInputPlaceholder__emailAddress: "tu@email.com",
  formFieldInputPlaceholder__emailAddress_username: "tu@email.com",
  formFieldInputPlaceholder__password: "Tu contraseña",
  formFieldInputPlaceholder__firstName: "Nombre",
  formFieldInputPlaceholder__lastName: "Apellido",
  formFieldAction__forgotPassword: "¿Olvidaste tu contraseña?",
  formFieldError__notMatchingPasswords: "Las contraseñas no coinciden.",
  formFieldError__matchingPasswords: "Las contraseñas coinciden.",
  formFieldHintText__optional: "Opcional",
  formButtonPrimary: "Continuar",
  formButtonPrimary__verify: "Verificar y continuar",
  backButton: "Volver",
  footerPageLink__help: "Ayuda",
  footerPageLink__privacy: "Privacidad",
  footerPageLink__terms: "Términos",
  signUp: {
    start: {
      title: "Creá tu cuenta",
      subtitle: "Reservá inmuebles, maquinaria y servicios para tu operación en minutos.",
      actionText: "¿Ya tenés una cuenta?",
      actionLink: "Ingresar",
    },
    emailCode: {
      title: "Revisá tu correo",
      subtitle: "para continuar en Mi Locativa",
      formTitle: "Código de verificación",
      formSubtitle: "Ingresá el código que enviamos a tu correo electrónico",
      resendButton: "¿No recibiste el código? Reenviar",
    },
    continue: {
      title: "Completá los datos que faltan",
      subtitle: "para continuar en Mi Locativa",
      actionText: "¿Ya tenés una cuenta?",
      actionLink: "Iniciá sesión",
    },
    legalConsent: {
      continue: {
        title: "Completá los datos que faltan",
        subtitle: "Al continuar, aceptás nuestros términos y política de privacidad.",
      },
      checkbox: {
        label__termsOfServiceAndPrivacyPolicy:
          "Acepto los {{termsOfServiceLink}} y la {{privacyPolicyLink}}",
        label__onlyPrivacyPolicy: "Acepto la {{privacyPolicyLink}}",
        label__onlyTermsOfService: "Acepto los {{termsOfServiceLink}}",
      },
    },
  },
  signIn: {
    start: {
      title: "Ingresá a tu cuenta",
      subtitle: "Accedé al catálogo, gestioná tus alquileres y seguí tus solicitudes.",
      actionText: "¿Todavía no tenés cuenta?",
      actionLink: "Crear cuenta",
      actionLink__use_email: "Usar correo electrónico",
      actionLink__use_phone: "Usar teléfono",
    },
    password: {
      title: "Ingresá tu contraseña",
      subtitle: "para continuar en Mi Locativa",
      actionLink: "¿Olvidaste tu contraseña?",
    },
    forgotPasswordAlternativeMethods: {
      title: "¿Olvidaste tu contraseña?",
      label__alternativeMethods: "O iniciá sesión con otro método",
      blockButton__resetPassword: "Restablecer tu contraseña",
    },
    forgotPassword: {
      title: "Recuperar contraseña",
      subtitle: "Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.",
      subtitle_email: "Ingresá el código que enviamos a tu correo.",
      subtitle_phone: "Ingresá el código que enviamos a tu teléfono.",
      formTitle: "Código de restablecimiento",
      resendButton: "¿No recibiste el código? Reenviar",
    },
    resetPassword: {
      title: "Restablecer contraseña",
      formButtonPrimary: "Restablecer contraseña",
      successMessage: "Tu contraseña fue cambiada con éxito. Ingresando de nuevo, esperá un momento.",
      requiredMessage: "Ya existe una cuenta con una contraseña sin usar. Por seguridad, restablecela.",
    },
    emailCode: {
      title: "Verificá tu correo",
      subtitle: "Enviamos un código de 6 dígitos a tu correo. Ingresalo abajo para continuar.",
      formTitle: "Código de verificación",
      resendButton: "¿No recibiste el código? Reenviar",
    },
    alternativeMethods: {
      title: "Usar otro método",
      subtitle: "¿Tenés problemas? Podés usar cualquiera de estos métodos para iniciar sesión.",
      actionLink: "Ayuda",
      actionText: "¿No tenés ninguno de estos?",
      blockButton__emailCode: "Enviar código a {{identifier}}",
      blockButton__password: "Iniciar sesión con tu contraseña",
      getHelp: {
        title: "Obtené ayuda",
        content:
          "Si tenés problemas para iniciar sesión en tu cuenta, escribinos y te ayudamos a restablecer el acceso lo antes posible.",
        blockButton__emailSupport: "Contactar por correo",
      },
    },
    noAvailableMethods: {
      title: "No se puede iniciar sesión",
      subtitle: "Ocurrió un error. No hay ningún método de autenticación disponible.",
      message: "Error: {{message}}",
    },
  },
  userButton: {
    action__manageAccount: "Gestionar cuenta",
    action__signOut: "Cerrar sesión",
    action__signOutAll: "Cerrar sesión en todas las cuentas",
    action__addAccount: "Agregar cuenta",
  },
  unstable__errors: {
    form_password_pwned: "Esta contraseña se encontró en una filtración de datos y no se puede usar. Probá con otra.",
    form_password_length_too_short: "La contraseña es demasiado corta.",
    form_identifier_not_found: "No encontramos una cuenta con esos datos.",
    form_password_incorrect: "Contraseña incorrecta. Intentá de nuevo.",
    identification_deletion_failed: "No podés eliminar tu último método de identificación.",
    phone_number_exists: "Este número de teléfono ya está en uso. Probá con otro.",
    form_identifier_exists__email_address: "Este correo electrónico ya está en uso. Probá con otro.",
    form_identifier_exists__username: "Este usuario ya está en uso. Probá con otro.",
    form_param_format_invalid__email_address: "El correo electrónico debe ser una dirección válida.",
    form_param_format_invalid__phone_number: "El número de teléfono debe tener un formato internacional válido.",
    not_allowed_access: "No tenés acceso.",
    captcha_invalid:
      "No se pudo completar el registro por validaciones de seguridad fallidas. Recargá la página e intentá de nuevo, o contactanos por soporte.",
  },
} as const;
