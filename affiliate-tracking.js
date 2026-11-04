(function () {
  "use strict";
  var id = window.WORKFLOW_DESK_GA4_ID;
  if (typeof id !== "string" || !/^G-[A-Z0-9]+$/.test(id)) return;
  var key = "workflow_desk_analytics_consent_v1";
  var loaded = false;
  var fallback = null;
  function read() {
    try { var v = localStorage.getItem(key); return v === "accepted" || v === "rejected" ? v : null; }
    catch (e) { return fallback; }
  }
  function save(value) {
    fallback = value;
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function enable() {
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
  }
  function clearBanner() {
    var old = document.getElementById("wd-privacy-banner");
    if (old) old.remove();
  }
  function showChoices() {
    clearBanner();
    var banner = document.createElement("aside");
    banner.id = "wd-privacy-banner";
    banner.className = "wd-privacy-banner";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Analytics privacy choice");
    var copy = document.createElement("div");
    copy.className = "wd-privacy-copy";
    var heading = document.createElement("strong");
    heading.textContent = "Your privacy matters.";
    var description = document.createElement("p");
    description.textContent = "Allow optional Google Analytics cookies to help us understand which guides visitors read and which affiliate links they use. You can decline or change your choice later.";
    var privacy = document.createElement("a");
    privacy.href = "/privacy.html";
    privacy.textContent = "Privacy policy";
    copy.appendChild(heading);
    copy.appendChild(description);
    copy.appendChild(privacy);
    var actions = document.createElement("div");
    actions.className = "wd-privacy-actions";
    function createChoice(label, value, className) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.className = "wd-privacy-btn " + className;
      b.addEventListener("click", function () {
        save(value);
        clearBanner();
        if (value === "accepted") enable();
        else if (loaded) location.reload();
      });
      return b;
    }
    actions.appendChild(createChoice("Decline", "rejected", "wd-privacy-decline"));
    actions.appendChild(createChoice("Allow analytics", "accepted", "wd-privacy-accept"));
    banner.appendChild(copy);
    banner.appendChild(actions);
    document.body.appendChild(banner);
  }
  function addSettings() {
    var footer = document.querySelector("footer");
    if (!footer) return;
    var button = document.createElement("button");
    button.type = "button";
    button.className = "wd-privacy-settings";
    button.textContent = "Cookie settings";
    button.setAttribute("aria-label", "Change analytics cookie consent");
    button.addEventListener("click", showChoices);
    footer.appendChild(button);
  }
  document.addEventListener("click", function (event) {
    if (!loaded || typeof window.gtag !== "function") return;
    var a = event.target.closest && event.target.closest("a[href]");
    if (!a) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (e) { return; }
    if (u.hostname !== "www.make.com" && u.hostname !== "make.com") return;
    if (u.searchParams.get("pc") !== "lenixeduardo") return;
    window.gtag("event", "affiliate_click", {
      affiliate: "make",
      link_url: u.origin + u.pathname,
      article_path: location.pathname,
      transport_type: "beacon"
    });
  }, true);
  addSettings();
  var choice = read();
  if (choice === "accepted") enable();
  else if (choice === null) showChoices();
})();
