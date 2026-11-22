/**
 * Précis-Méca — Interactive Controls, Machine Envelope Matcher,
 * Alloy Matrix, Cinema Video Modal, Lightbox & Technical RFQ Configurator
 */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. Vernier Scroll Tracker */
  var vernierFill = document.getElementById("vernierFill");
  var ticking = false;
  function updateVernier() {
    ticking = false;
    if (!vernierFill) return;
    var doc = document.documentElement;
    var top = window.scrollY || doc.scrollTop || 0;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    vernierFill.style.width = Math.min(100, Math.max(0, (top / max) * 100)).toFixed(2) + "%";
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(updateVernier);
      ticking = true;
    }
  }, { passive: true });
  updateVernier();

  /* 2. Mobile Navigation Drawer */
  var drawer = document.getElementById("mobileDrawer");
  var openBtn = document.getElementById("menuOpenBtn");
  var closeBtns = document.querySelectorAll("[data-drawer-close]");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    if (openBtn) openBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (openBtn) openBtn.addEventListener("click", function () { setDrawer(true); });
  closeBtns.forEach(function (el) {
    el.addEventListener("click", function () { setDrawer(false); });
  });

  /* 3. Cinema Workshop Video Modal */
  var videoModal = document.getElementById("videoModal");
  var openVideoBtns = document.querySelectorAll("[data-open-video]");
  var closeVideoBtn = document.getElementById("closeVideoModal");
  var modalPlayerHost = document.getElementById("videoModalPlayer");
  var cfg = window.PRECIS_MECA_CONFIG || {};

  function openVideoModal() {
    if (!videoModal || !modalPlayerHost) return;
    var vid = (cfg.contact && cfg.contact.youtubeVideoId) || "GLLZB1bpkUY";
    modalPlayerHost.innerHTML =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + vid +
      '?autoplay=1&rel=0" title="Précis-Méca" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    videoModal.classList.add("open");
  }
  function closeVideoModal() {
    if (!videoModal || !modalPlayerHost) return;
    videoModal.classList.remove("open");
    modalPlayerHost.innerHTML = "";
  }
  openVideoBtns.forEach(function (btn) { btn.addEventListener("click", openVideoModal); });
  if (closeVideoBtn) closeVideoBtn.addEventListener("click", closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener("click", function (e) {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  /* 4. Filterable Grids (Alloys & Sectors) */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var btns = group.querySelectorAll("[data-filter-btn]");
    var items = group.querySelectorAll("[data-filter-cat]");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-filter-btn");
        btns.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-filter-cat") || "").split(" ");
          var match = target === "all" || cats.indexOf(target) !== -1;
          item.classList.toggle("is-hidden", !match);
        });
      });
    });
  });

  /* 5. Machine Fleet Category Filter + Envelope Diameter/Length Matcher */
  var machineGrid = document.getElementById("machineFleetGrid");
  if (machineGrid) {
    var activeCat = "all";
    var diamInput = document.getElementById("matchDiam");
    var lenInput = document.getElementById("matchLen");
    var opSelect = document.getElementById("matchOp");
    var diamValEl = document.getElementById("matchDiamVal");
    var lenValEl = document.getElementById("matchLenVal");
    var countEl = document.getElementById("matchCount");
    var machineCards = machineGrid.querySelectorAll("[data-machine-cat]");
    var machineTabs = document.querySelectorAll("[data-machine-tab]");

    function applyMachineFilter() {
      var d = diamInput ? parseInt(diamInput.value, 10) || 0 : 0;
      var z = lenInput ? parseInt(lenInput.value, 10) || 0 : 0;
      var op = opSelect ? opSelect.value : "all";
      if (diamValEl) diamValEl.textContent = d + " mm";
      if (lenValEl) lenValEl.textContent = z + " mm";

      var visible = 0;
      machineCards.forEach(function (card) {
        var cat = card.getAttribute("data-machine-cat") || "";
        var maxD = parseInt(card.getAttribute("data-max-d") || "99999", 10);
        var maxZ = parseInt(card.getAttribute("data-max-z") || "99999", 10);
        var catMatch = activeCat === "all" || cat === activeCat;
        var opMatch = op === "all" || cat === op;
        var envMatch = d <= maxD && z <= maxZ;
        var show = catMatch && opMatch && envMatch;
        card.classList.toggle("is-hidden", !show);
        if (show) visible++;
      });
      if (countEl) countEl.textContent = String(visible);
    }

    machineTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        activeCat = tab.getAttribute("data-machine-tab");
        machineTabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        applyMachineFilter();
      });
    });

    if (diamInput) diamInput.addEventListener("input", applyMachineFilter);
    if (lenInput) lenInput.addEventListener("input", applyMachineFilter);
    if (opSelect) opSelect.addEventListener("change", applyMachineFilter);
    applyMachineFilter();
  }

  /* 6. Gallery Lightbox */
  var lightbox = document.getElementById("galleryLightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbClose = document.getElementById("lbClose");
  var lbPrev = document.getElementById("lbPrev");
  var lbNext = document.getElementById("lbNext");
  var galleryTiles = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox-item]"));
  var lbIndex = 0;

  function openLightbox(idx) {
    if (!lightbox || !lbImg || !galleryTiles.length) return;
    lbIndex = (idx + galleryTiles.length) % galleryTiles.length;
    var tile = galleryTiles[lbIndex];
    var img = tile.querySelector("img");
    var cap = tile.querySelector(".gallery-cap");
    if (img) {
      lbImg.src = img.src;
      lbImg.alt = img.alt || "";
    }
    if (lbCap) lbCap.textContent = (lbIndex + 1) + " / " + galleryTiles.length + " — " + (cap ? cap.textContent : "");
    lightbox.classList.add("open");
  }
  function closeLightbox() {
    if (lightbox) lightbox.classList.remove("open");
  }
  galleryTiles.forEach(function (tile, idx) {
    tile.addEventListener("click", function () { openLightbox(idx); });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", function () { openLightbox(lbIndex - 1); });
  if (lbNext) lbNext.addEventListener("click", function () { openLightbox(lbIndex + 1); });
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      setDrawer(false);
      closeVideoModal();
      closeLightbox();
    } else if (lightbox && lightbox.classList.contains("open")) {
      if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
      if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
    }
  });

  /* 7. Copy Email Pill */
  document.querySelectorAll("[data-copy-email]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var addr = btn.getAttribute("data-copy-email") || "info@precis-meca.fr";
      var badge = btn.querySelector("[data-copy-badge]");
      var doneLabel = btn.getAttribute("data-copied-label") || "OK";
      var prev = badge ? badge.textContent : "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(addr).catch(function () {});
      }
      if (badge) {
        badge.textContent = doneLabel;
        setTimeout(function () { badge.textContent = prev; }, 1800);
      }
    });
  });

  /* 8. Interactive B2B Technical RFQ Configurator */
  var rfqForm = document.getElementById("rfqConfigurator");
  if (rfqForm) {
    var lang = document.documentElement.lang || "fr";
    var i18n = {
      fr: {
        subject: "Demande d'étude technique — Précis-Méca",
        header: "PRÉCIS-MÉCA · CAHIER DES CHARGES TECHNIQUE",
        proc: "Procédés",
        alloy: "Matière / Nuance",
        env: "Enveloppe / Série",
        cad: "Fichiers CAO",
        qual: "Contrôle & Certificats",
        client: "Demandeur",
        company: "Société",
        contact: "Contact",
        notes: "Précisions / Tolérances",
        none: "Non précisé",
        copied: "Brief copié !"
      },
      de: {
        subject: "Technische Angebotsanfrage — Précis-Méca",
        header: "PRÉCIS-MÉCA · TECHNISCHE ANFRAGE (RFQ)",
        proc: "Fertigungsverfahren",
        alloy: "Werkstoff / Legierung",
        env: "Abmessungen / Losgröße",
        cad: "CAD-Daten",
        qual: "Prüfung & Zertifikate",
        client: "Ansprechpartner",
        company: "Unternehmen",
        contact: "Kontakt",
        notes: "Hinweise / Toleranzen",
        none: "Keine Angabe",
        copied: "Briefing kopiert!"
      },
      en: {
        subject: "Technical RFQ Inquiry — Précis-Méca",
        header: "PRÉCIS-MÉCA · TECHNICAL RFQ BRIEF",
        proc: "Processes",
        alloy: "Alloy / Material",
        env: "Envelope / Batch Size",
        cad: "CAD Formats",
        qual: "Quality & Documentation",
        client: "Contact Name",
        company: "Company",
        contact: "Direct Contact",
        notes: "Notes & Critical Tolerances",
        none: "Not specified",
        copied: "Brief copied!"
      }
    }[lang] || {};

    var preview = document.getElementById("rfqBriefPreview");
    var emailBtn = document.getElementById("rfqSendEmail");
    var copyBtn = document.getElementById("rfqCopyBtn");

    function collectValues(name) {
      return Array.prototype.slice.call(rfqForm.querySelectorAll('input[name="' + name + '"]:checked')).map(function (el) {
        return el.value;
      });
    }

    function updateRfq() {
      var procs = collectValues("proc");
      var alloy = (rfqForm.querySelector('[name="alloy"]') || {}).value || i18n.none;
      var env = (rfqForm.querySelector('[name="envelope"]') || {}).value || i18n.none;
      var batch = (rfqForm.querySelector('[name="batch"]') || {}).value || i18n.none;
      var cads = collectValues("cad");
      var quals = collectValues("qual");
      var name = (rfqForm.querySelector('[name="fullName"]') || {}).value || i18n.none;
      var company = (rfqForm.querySelector('[name="company"]') || {}).value || i18n.none;
      var email = (rfqForm.querySelector('[name="email"]') || {}).value || i18n.none;
      var phone = (rfqForm.querySelector('[name="phone"]') || {}).value || i18n.none;
      var notes = (rfqForm.querySelector('[name="notes"]') || {}).value || i18n.none;

      var lines = [
        i18n.header,
        "----------------------------------------",
        i18n.proc + ": " + (procs.length ? procs.join(", ") : i18n.none),
        i18n.alloy + ": " + alloy,
        i18n.env + ": " + env + " · " + batch,
        i18n.cad + ": " + (cads.length ? cads.join(", ") : i18n.none),
        i18n.qual + ": " + (quals.length ? quals.join(", ") : i18n.none),
        i18n.client + ": " + name + " (" + company + ")",
        i18n.contact + ": " + email + " | " + phone,
        i18n.notes + ": " + notes
      ];
      var brief = lines.join("\n");
      if (preview) preview.textContent = brief;
      if (emailBtn && cfg.contact) {
        var subj = encodeURIComponent(i18n.subject + (company !== i18n.none ? " — " + company : ""));
        emailBtn.href = "mailto:" + cfg.contact.email + "?subject=" + subj + "&body=" + encodeURIComponent(brief);
      }
      return brief;
    }

    rfqForm.addEventListener("input", updateRfq);
    rfqForm.addEventListener("change", updateRfq);
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var brief = updateRfq();
        var orig = copyBtn.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(brief).catch(function () {});
        }
        copyBtn.textContent = i18n.copied;
        setTimeout(function () { copyBtn.textContent = orig; }, 1800);
      });
    }
    updateRfq();
  }

  /* Smooth hero video fade-in when ready + corner dock pause/play toggle */
  var heroVid = document.getElementById("heroBgVideo");
  var heroBgToggle = document.getElementById("heroBgToggle");
  if (heroVid && !prefersReduced) {
    heroVid.play().catch(function () {});
  }
  if (heroVid && heroBgToggle) {
    var pauseLbl = heroBgToggle.getAttribute("data-pause-label") || "❚❚ Pause";
    var playLbl = heroBgToggle.getAttribute("data-play-label") || "▶ Play";
    var syncBgToggle = function () {
      var paused = heroVid.paused;
      heroBgToggle.textContent = paused ? playLbl : pauseLbl;
      heroBgToggle.setAttribute("aria-pressed", paused ? "true" : "false");
    };
    heroBgToggle.addEventListener("click", function () {
      if (heroVid.paused) {
        heroVid.play().catch(function () {});
      } else {
        heroVid.pause();
      }
      syncBgToggle();
    });
    heroVid.addEventListener("play", syncBgToggle);
    heroVid.addEventListener("pause", syncBgToggle);
    syncBgToggle();
  }
})();
