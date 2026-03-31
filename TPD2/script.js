const themeToggle = document.getElementById("theme-toggle");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "" : "dark";

  if (nextTheme) {
    document.body.dataset.theme = nextTheme;
    return;
  }

  document.body.removeAttribute("data-theme");
});
