const form = document.querySelector("#http-form");
const methodInput = document.querySelector("#method");
const urlInput = document.querySelector("#url");
const bodyInput = document.querySelector("#body");
const statusText = document.querySelector("#status-text");
const headersOutput = document.querySelector("#headers-output");
const bodyOutput = document.querySelector("#body-output");
const headersList = document.querySelector("#headers-list");
const addHeaderButton = document.querySelector("#add-header");

function createHeaderRow() {
  const row = document.createElement("div");
  row.className = "header-row";
  row.innerHTML = `
    <input type="text" class="header-key" placeholder="Header key">
    <input type="text" class="header-value" placeholder="Header value">
    <button type="button" class="remove-header" aria-label="Supprimer ce header">x</button>
  `;

  row.querySelector(".remove-header").addEventListener("click", function () {
    row.remove();
  });

  return row;
}

function collectHeaders() {
  const headers = {};
  const rows = headersList.querySelectorAll(".header-row");

  for (let i = 0; i < rows.length; i++) {
    const key = rows[i].querySelector(".header-key").value.trim();
    const value = rows[i].querySelector(".header-value").value.trim();

    if (key !== "") {
      headers[key] = value;
    }
  }

  return headers;
}

function formatHeaders(headers) {
  let result = "";

  headers.forEach(function (value, key) {
    result += key + ": " + value + "\n";
  });

  return result.trim() || "Aucun header recupere.";
}

function shouldSendBody(method) {
  return method !== "GET" && method !== "DELETE";
}

addHeaderButton.addEventListener("click", function () {
  headersList.appendChild(createHeaderRow());
});

headersList.querySelector(".remove-header").addEventListener("click", function () {
  const rows = headersList.querySelectorAll(".header-row");

  if (rows.length > 1) {
    this.closest(".header-row").remove();
  } else {
    rows[0].querySelector(".header-key").value = "";
    rows[0].querySelector(".header-value").value = "";
  }
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const method = methodInput.value;
  const url = urlInput.value.trim();
  const headers = collectHeaders();
  const options = {
    method: method,
    headers: headers
  };

  if (shouldSendBody(method) && bodyInput.value.trim() !== "") {
    options.body = bodyInput.value;
  }

  statusText.textContent = "Envoi de la requete...";
  headersOutput.textContent = "Chargement...";
  bodyOutput.textContent = "Chargement...";

  try {
    const response = await fetch(url, options);
    const responseHeaders = formatHeaders(response.headers);
    const responseText = await response.text();

    statusText.textContent = "HTTP " + response.status + " - " + response.statusText;
    headersOutput.textContent = responseHeaders;
    bodyOutput.textContent = responseText || "Reponse vide.";
  } catch (error) {
    statusText.textContent = "Erreur pendant la requete.";
    headersOutput.textContent = "Impossible de recuperer les headers.";
    bodyOutput.textContent =
      error.message +
      "\n\nSi la requete est bloquee, il s'agit souvent d'un probleme CORS sur le navigateur.";
  }
});
