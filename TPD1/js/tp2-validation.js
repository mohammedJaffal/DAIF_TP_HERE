(function () {
  const form = document.getElementById("registration-form");
  if (!form) return;

  const birthdate = document.getElementById("naissance");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  const status = document.getElementById("status");

  const today = new Date();
  const limit = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  const yyyy = String(limit.getFullYear());
  const mm = String(limit.getMonth() + 1).padStart(2, "0");
  const dd = String(limit.getDate()).padStart(2, "0");
  birthdate.max = `${yyyy}-${mm}-${dd}`;

  function isAdult(value) {
    if (!value) return false;
    const b = new Date(value);
    return b <= limit;
  }

  function resetMessage(field) {
    field.setCustomValidity("");
  }

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("input", () => resetMessage(field));
    field.addEventListener("change", () => resetMessage(field));

    field.addEventListener("invalid", () => {
      const fallback = field.dataset.msg || "Veuillez vérifier ce champ.";
      field.setCustomValidity(fallback);

      if (field.validity.valueMissing) {
        field.setCustomValidity(field.dataset.msg || "Ce champ est obligatoire.");
      } else if (field.validity.typeMismatch) {
        field.setCustomValidity("Format invalide.");
      } else if (field.validity.patternMismatch) {
        field.setCustomValidity(field.dataset.msg || "Format incorrect.");
      } else if (field.id === "naissance" && !isAdult(field.value)) {
        field.setCustomValidity("Vous devez avoir au moins 18 ans.");
      }
    });
  });

  function validatePasswordMatch() {
    if (!confirmPassword.value) {
      confirmPassword.setCustomValidity("Confirmez le mot de passe.");
      return false;
    }
    if (password.value !== confirmPassword.value) {
      confirmPassword.setCustomValidity("Les mots de passe ne correspondent pas.");
      return false;
    }
    confirmPassword.setCustomValidity("");
    return true;
  }

  password.addEventListener("input", validatePasswordMatch);
  confirmPassword.addEventListener("input", validatePasswordMatch);

  form.addEventListener("submit", (event) => {
    status.textContent = "";

    const adultOk = isAdult(birthdate.value);
    if (!adultOk) {
      birthdate.setCustomValidity("Vous devez avoir au moins 18 ans.");
    } else {
      birthdate.setCustomValidity("");
    }

    const pwdOk = validatePasswordMatch();

    if (!form.checkValidity() || !adultOk || !pwdOk) {
      event.preventDefault();
      form.reportValidity();
      return;
    }

    event.preventDefault();
    status.textContent = "Formulaire valide. Inscription simulée avec succès.";
    form.reset();
  });
})();
