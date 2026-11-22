/**
 * Précis-Méca — Canonical Corporate Configuration & Trilingual Routing
 * Strictly public corporate records (SIREN 491 735 155 / RCS Mulhouse). Zero private PII.
 */
(function (global) {
  "use strict";

  global.PRECIS_MECA_CONFIG = {
    brand: {
      name: "Précis-Méca",
      legalName: "GROUPE PRECIS MECA SASU",
      foundedYear: 1986,
      siren: "491 735 155",
      siret: "491 735 155 00021",
      rcs: "RCS Mulhouse",
      tva: "FR 70 491 735 155",
      capital: "719 850 €",
      ape: "7112B",
      president: "Manuel Muller",
      directriceGenerale: "Mégane Muller",
      teamCount: 19,
      workshopAreaSqm: 2000
    },
    contact: {
      phoneDisplay: "03 89 37 96 45",
      phoneIntl: "+33 3 89 37 96 45",
      phoneHref: "tel:+33389379645",
      email: "info@precis-meca.fr",
      linkedin: "https://fr.linkedin.com/company/groupe-precis-meca-sasu/",
      facebook: "https://www.facebook.com/people/Groupe-Precis-Meca-SASU/100041220146256/",
      youtubeVideoId: "GLLZB1bpkUY",
      youtubeUrl: "https://www.youtube.com/watch?v=GLLZB1bpkUY"
    },
    address: {
      street: "313 rue Auguste Scheurer-Kestner",
      zone: "ZA du Pays de Thann",
      postalCode: "68700",
      city: "Aspach-Michelbach",
      region: "Haut-Rhin, Alsace, Grand Est",
      country: "France",
      coordinates: { lat: 47.7642, lng: 7.1550 }
    },
    hours: {
      admin: {
        fr: "Lun – Jeu : 08h00–12h30 · 13h00–17h15 | Ven : 08h00–12h00",
        de: "Mo – Do : 08:00–12:30 · 13:00–17:15 | Fr : 08:00–12:00",
        en: "Mon – Thu: 08:00–12:30 · 13:00–17:15 | Fri: 08:00–12:00"
      },
      shipping: {
        fr: "Lun – Jeu : 07h30–12h00 · 13h00–16h30 | Ven : 07h00–11h30",
        de: "Mo – Do : 07:30–12:00 · 13:00–16:30 | Fr : 07:00–11:30",
        en: "Mon – Thu: 07:30–12:00 · 13:00–16:30 | Fri: 07:00–11:30"
      }
    },
    domains: {
      canonical: "https://precis-meca.fr",
      aliases: [
        "www.precis-meca.fr",
        "precis-meca.com",
        "www.precis-meca.com",
        "precismeca.fr",
        "www.precismeca.fr",
        "precis-meca-68.fr",
        "www.precis-meca-68.fr"
      ],
      deDomains: ["precis-meca.de", "www.precis-meca.de"]
    },
    routes: {
      home: { fr: "/fr", de: "/de", en: "/en" },
      capabilities: { fr: "/fr/savoir-faire", de: "/de/kompetenzen", en: "/en/capabilities" },
      machines: { fr: "/fr/parc-machines", de: "/de/maschinenpark", en: "/en/machine-fleet" },
      quality: { fr: "/fr/controle-qualite", de: "/de/qualitaet-messtechnik", en: "/en/quality-metrology" },
      company: { fr: "/fr/entreprise", de: "/de/unternehmen", en: "/en/company" },
      contact: { fr: "/fr/contact", de: "/de/kontakt", en: "/en/contact" },
      legal: { fr: "/fr/mentions-legales", de: "/de/impressum", en: "/en/legal" }
    }
  };
})(window);
