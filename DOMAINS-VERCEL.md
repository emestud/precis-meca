# Stratégie Domaines, Configuration DNS & Déploiement Vercel — Précis-Méca

Audit technique et vérifications RDAP/DNS effectués en direct le **2026-11-22**.

---

## 1. Recommandation de Domaine : Abandonner `-68` au profit de `precis-meca.fr` (déjà détenu !)

L'ancien site utilise `www.precis-meca-68.fr`, un domaine géré via une agence web (`Meosis`), alors que **Précis-Méca possède déjà `precis-meca.fr` et `precis-meca.com` chez Adista (`ns3.rmi.fr` / `ns4.rmi.fr`)** — utilisés pour votre messagerie `info@precis-meca.fr`, mais **sans aucun serveur web configuré actuellement** (`0 €` d'achat supplémentaire !).

| Rôle | Domaine | Statut Vérifié (2026-11-22) | Action Recommandée |
| :--- | :--- | :--- | :--- |
| **Domaine Principal Canonique** | **`precis-meca.fr`** | **DÉJÀ DÉTENU (`precis meca` · Adista)** · Email Microsoft 365 actif, **aucun `A` record web** | **À activer sur Vercel (`0 €`)** — aligné 1:1 avec `info@precis-meca.fr`, plus court, sans `-68`. |
| **Alias International** | **`precis-meca.com`** | **DÉJÀ DÉTENU (`NS3.RMI.FR` · EuroDNS/Adista)** · **Aucun `A` record web** | Pointer vers Vercel en redirection permanente `301` -> `https://precis-meca.fr` (`0 €`). |
| **Nouvel Achat Recommandé** | **`precismeca.fr`** | **DISPONIBLE (404 RDAP AFNIC)** | Déposer la forme sans tiret (~8 €/an) en redirection `301` -> `https://precis-meca.fr`. |
| **Alias Complémentaires Dispos** | `groupe-precis-meca.fr`, `groupe-precis-meca.com`, `precis-meca-alsace.fr`, `precismeca-cnc.com` | **DISPONIBLES (404 RDAP)** | Achats défensifs ou SEO optionnels (`301` -> `precis-meca.fr`). |
| **Ancien Domaine Agence** | `precis-meca-68.fr` | **Détenu par `GROUPE PRECIS MECA SASU` (OVH)** | Basculer vers Vercel : `vercel.json` redirige en `301` toutes les anciennes URL (`/notre-savoir-faire.html`, `/parc-machines.html`, `/controle-qualite.html`, etc.). |

---

## 2. Déploiement en 1 Clic sur Vercel depuis GitHub

1. Ouvrir **[https://vercel.com/new](https://vercel.com/new)**.
2. Importer le dépôt **`emestud/precis-meca`**.
3. Laisser **Framework Preset** sur `Other`, **Build Command** vide et **Output Directory** sur `.` (site statique pur, zéro build requis).
4. Cliquer sur **Deploy**.

---

## 3. CRITIQUE — Connecter `precis-meca.fr` sans Couper `info@precis-meca.fr` (Microsoft 365)

Dans **Vercel -> Project Settings -> Domains**, ajouter :
- `precis-meca.fr`
- `www.precis-meca.fr`
- `precis-meca.com` et `www.precis-meca.com` (et `precis-meca-68.fr` / `www.precis-meca-68.fr` lors de la bascule finale)

Chez votre gestionnaire DNS (**Adista / `ns3.rmi.fr`** pour `precis-meca.fr` et `.com`, puis **OVH** pour `precis-meca-68.fr`) :
1. **NE JAMAIS modifier ni supprimer** les enregistrements existants suivants afin que la messagerie Microsoft 365 (`info@precis-meca.fr`) reste active sans coupure :
   - `MX` -> `1 precismeca-fr01e.mail.protection.outlook.com.`
   - `TXT` (`v=spf1 ...`), `DKIM`, `DMARC` et `CNAME autodiscover`.
2. Ajouter / mettre à jour **uniquement les enregistrements Web** :

| Type | Hôte / Nom | Valeur | Notes |
| :--- | :--- | :--- | :--- |
| `A` | `@` | `76.76.21.21` | IP Anycast Vercel |
| `CNAME` | `www` | `cname.vercel-dns.com.` | Redirection automatique vers `precis-meca.fr` |

3. Vérifier la mise en ligne après propagation :
   ```bash
   curl -IL https://precis-meca.fr
   ```
