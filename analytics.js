// GA4 is only loaded after the visitor accepts the cookie banner (GDPR: no
// tracking cookies before consent). Replace GA_MEASUREMENT_ID with the real
// "G-XXXXXXXXXX" ID from the GA4 property before this goes live.
(function () {
  var GA_MEASUREMENT_ID = "G-WFCKFCM5FS";
  var CONSENT_KEY = "huppelaud_analytics_consent";

  function loadGA() {
    if (window.__gaLoaded || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) return;
    window.__gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
  }

  // Fire a custom GA4 event; no-op until consent is granted and GA has loaded.
  window.hlTrack = function (eventName, params) {
    if (window.gtag) window.gtag("event", eventName, params || {});
  };

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  function initSectionTracking() {
    var sections = document.querySelectorAll("[data-track-section]");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    var seen = {};
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.getAttribute("data-track-section");
        if (entry.isIntersecting && !seen[id]) {
          seen[id] = true;
          window.hlTrack("section_view", { section_id: id });
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var banner = document.getElementById("cookieConsent");
    var acceptBtn = document.getElementById("cookieAccept");
    var declineBtn = document.getElementById("cookieDecline");
    var consent = getConsent();

    if (consent === "granted") {
      loadGA();
    } else if (consent !== "denied" && banner) {
      banner.hidden = false;
    }

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        setConsent("granted");
        if (banner) banner.hidden = true;
        loadGA();
        initSectionTracking();
      });
    }
    if (declineBtn) {
      declineBtn.addEventListener("click", function () {
        setConsent("denied");
        if (banner) banner.hidden = true;
      });
    }

    if (consent === "granted") initSectionTracking();
  });
})();
