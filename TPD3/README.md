# TPD3 - Protocole HTTP

Resultats prepares pour le sujet : <https://http.daaif.net/tp.html>

Date des verifications pratiques : 2026-04-22

## TP 1 - Exploration avec les DevTools

### 1.2 Requete simple sur `https://httpbin.org/get`

- Code de statut : `200`
- Headers de requete envoyes : `Accept`, `User-Agent`, `Host` et d'autres headers automatiques du navigateur
- Content-Type de la reponse : `application/json`

### 1.3 Tester differentes methodes

Exemple GET :

```js
fetch("https://httpbin.org/get")
  .then((r) => r.json())
  .then(console.log);
```

Exemple POST :

```js
fetch("https://httpbin.org/post", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "John", age: 30 })
})
  .then((r) => r.json())
  .then(console.log);
```

### 1.4 Observer les codes de statut

| URL | Code observe |
| --- | --- |
| `https://httpbin.org/status/200` | `200` |
| `https://httpbin.org/status/404` | `404` |
| `https://httpbin.org/status/500` | `500` |
| `https://httpbin.org/redirect/3` | `302` a chaque redirection |

### Tableau demande

| URL | Methode | Code | Content-Type |
| --- | --- | --- | --- |
| `https://httpbin.org/get` | `GET` | `200` | `application/json` |
| `https://httpbin.org/post` | `POST` | `200` | `application/json` |
| `https://httpbin.org/status/201` | `GET` | `201` | `text/html; charset=utf-8` |

## TP 2 - Maitrise de cURL

### 2.1 Difference entre `-i` et `-v`

- `-i` affiche les headers de la reponse dans la sortie
- `-v` affiche le detail complet de la connexion : DNS, TLS, requete envoyee, reponse, debug

### 2.2 POST avec donnees

Form data :

```bash
curl -X POST -d "name=John&email=john@example.com" \
  https://httpbin.org/post
```

JSON :

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}' \
  https://httpbin.org/post
```

### 2.3 Headers personnalises

```bash
curl -H "Authorization: Bearer mon-token-secret" \
  -H "Accept: application/json" \
  https://httpbin.org/headers
```

### 2.4 Suivre les redirections

```bash
curl https://httpbin.org/redirect/3
curl -L https://httpbin.org/redirect/3
```

- sans `-L`, cURL s'arrete a la premiere redirection
- avec `-L`, cURL suit toutes les redirections

### 2.5 Telecharger un fichier

```bash
curl -o image.png https://httpbin.org/image/png
curl -O https://example.com/fichier.pdf
```

### Exercice avance

```bash
curl -i -X POST \
  -H "Content-Type: application/json" \
  -H "X-Custom-Header: MonHeader" \
  -d '{"action":"test","value":42}' \
  https://httpbin.org/post
```

## TP 3 - API REST avec JavaScript

### 3.1 GET basique

```js
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((users) => console.log(users))
  .catch((error) => console.error("Erreur:", error));
```

```js
async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error("Erreur:", error);
  }
}
```

### 3.2 POST - Creer une ressource

```js
async function createPost(data) {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}
```

### 3.3 PUT - Modifier une ressource

```js
async function updatePost(id, data) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return response.json();
}
```

### 3.4 DELETE - Supprimer une ressource

```js
async function deletePost(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
    method: "DELETE"
  });

  return response.ok;
}
```

### Exercice pratique - `fetchWithRetry(url, options, maxRetries)`

```js
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (response.status >= 500) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      await wait(1000);
    }
  }
}
```

## TP 4 - Analyse des Headers de Securite

### Tableau d'analyse

| Site | HSTS | X-Frame | CSP | Note |
| --- | --- | --- | --- | --- |
| `github.com` | Oui | `DENY` | Oui | Tres bonne configuration |
| `google.com` | Non observe dans la requete test | `SAMEORIGIN` | Oui, en mode report-only | Bonne configuration, mais resultat partiel selon la reponse observee |
| `openai.com` | Oui | `SAMEORIGIN` | Non observe dans la requete test | Configuration correcte mais CSP non visible sur cette reponse |

### Headers observes

#### `github.com`

- `Strict-Transport-Security: max-age=31536000; includeSubdomains; preload`
- `X-Frame-Options: deny`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin, strict-origin-when-cross-origin`
- `Content-Security-Policy: ...`

#### `google.com`

- `X-Frame-Options: SAMEORIGIN`
- `Content-Security-Policy-Report-Only: ...`

#### `openai.com`

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: same-origin`

## TP 5 - Cache HTTP

### 5.1 Observer le cache

Sur `https://httpbin.org/cache/60`, le header observe est :

```text
Cache-Control: public, max-age=60
```

Cela veut dire que la reponse peut etre mise en cache pendant 60 secondes.

### 5.2 Requete conditionnelle avec ETag

Premiere requete :

- `ETag: test123`
- code : `200`

Requete avec :

```bash
curl -i -H "If-None-Match: test123" https://httpbin.org/etag/test123
```

Resultat :

- code : `304 Not Modified`

### 5.3 Exemple simple de configuration de cache

Exemple de strategie :

- image : cache long
- CSS : cache moyen
- JS : cache moyen ou long avec versionnement

Exemple Nginx :

```nginx
location ~* \.(png|jpg|jpeg|gif|svg|webp)$ {
    expires 30d;
    add_header Cache-Control "public, max-age=2592000";
}

location ~* \.css$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
}

location ~* \.js$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800";
}
```

## Exercices recapitulatifs

### Exercice 1 - Client HTTP minimaliste

Exercice realise dans `TPD4`.

Lien deploye :

- <http://www.c3-mo-jaffal.enset.ma/TPD4/>

### Exercice 2 - Questions theoriques

#### 1. Difference entre `no-cache` et `no-store`

- `no-cache` : la ressource peut etre stockee, mais elle doit etre revalidee avant reutilisation
- `no-store` : la ressource ne doit jamais etre stockee

#### 2. Pourquoi POST n'est-il pas idempotent ?

Parce que deux requetes POST identiques peuvent creer deux ressources differentes ou produire deux actions differentes.

#### 3. Que se passe-t-il si le serveur renvoie un code 301 ?

Le client comprend que la ressource a ete deplacee de facon permanente vers une nouvelle URL. Les navigateurs et clients peuvent memoriser cette redirection.

#### 4. A quoi sert le header `Origin` ?

Il indique l'origine de la requete (`scheme + host + port`) et sert surtout pour la politique CORS.

#### 5. Pourquoi utiliser `HttpOnly` sur les cookies de session ?

Pour empecher JavaScript d'acceder au cookie, ce qui reduit le risque de vol de session en cas de faille XSS.
