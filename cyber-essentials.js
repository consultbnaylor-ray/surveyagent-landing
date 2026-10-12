/**
 * Shared Cyber Essentials certificate widget.
 * Mount <cyber-essentials-badge> in a footer or other trust spot.
 * The iframe markup is kept exactly as issued by Blockmark.
 */
(function () {
  var FRAME_HOST = "https://registry.blockmarktech.com";
  var IFRAME_HTML =
    '<iframe src="https://registry.blockmarktech.com/certificates/5b6c06dd-6bfc-4f2a-a1ff-0b5465798886/widget/?tooltip_position=bottom_right&theme=transparent&hover=t" style="border:none;height:204px;width:204px;" loading="lazy"></iframe>';

  function sourceAllowsHost(source) {
    return (
      source === "*" ||
      source === "https:" ||
      source === FRAME_HOST ||
      source === FRAME_HOST + "/" ||
      source === "https://*.blockmarktech.com" ||
      source === "*.blockmarktech.com"
    );
  }

  function ensureFrameSrc(policy) {
    var directives = policy
      .split(";")
      .map(function (directive) { return directive.trim(); })
      .filter(Boolean);
    var frameIndex = -1;
    var defaultSources = null;

    directives.forEach(function (directive, index) {
      var parts = directive.split(/\s+/);
      var name = parts[0].toLowerCase();
      if (name === "frame-src") frameIndex = index;
      if (name === "default-src") defaultSources = parts.slice(1);
    });

    if (frameIndex === -1) {
      var sources = (defaultSources ? defaultSources.slice() : ["'self'"]).filter(function (source) {
        return source !== "'none'" && source !== "none";
      });
      if (!sources.length) sources.push("'self'");
      if (!sources.some(sourceAllowsHost)) sources.push(FRAME_HOST);
      directives.push("frame-src " + sources.join(" "));
      return directives.join("; ");
    }

    var frameParts = directives[frameIndex].split(/\s+/);
    if (!frameParts.slice(1).some(sourceAllowsHost)) {
      frameParts.push(FRAME_HOST);
      directives[frameIndex] = frameParts.join(" ");
    }
    return directives.join("; ");
  }

  function ensureContentSecurityPolicy() {
    var metas = document.getElementsByTagName("meta");
    var found = false;
    for (var i = 0; i < metas.length; i++) {
      if ((metas[i].httpEquiv || "").toLowerCase() !== "content-security-policy") continue;
      found = true;
      var current = metas[i].getAttribute("content") || "";
      var next = ensureFrameSrc(current);
      if (next !== current.replace(/;\s*$/, "").trim() && next !== current) {
        metas[i].setAttribute("content", next);
      }
    }
    if (!found) {
      var meta = document.createElement("meta");
      meta.httpEquiv = "Content-Security-Policy";
      meta.setAttribute("content", "frame-src 'self' " + FRAME_HOST);
      document.head.insertBefore(meta, document.head.firstChild);
    }
  }

  function installStyles() {
    if (document.getElementById("cyber-essentials-badge-styles")) return;
    var style = document.createElement("style");
    style.id = "cyber-essentials-badge-styles";
    style.textContent =
      "cyber-essentials-badge{" +
        "display:flex;justify-content:center;align-items:center;" +
        "width:100%;max-width:100%;margin:0.35rem auto 0.55rem;" +
        "line-height:0;flex:0 0 auto;" +
      "}" +
      "cyber-essentials-badge iframe{display:block;flex:0 0 auto;max-width:100%;}" +
      "@media (max-width:540px){" +
        "cyber-essentials-badge{margin:0.2rem auto 0.45rem;}" +
      "}";
    document.head.appendChild(style);
  }

  class CyberEssentialsBadge extends HTMLElement {
    connectedCallback() {
      if (this.querySelector("iframe")) return;
      this.insertAdjacentHTML("beforeend", IFRAME_HTML);
    }
  }

  ensureContentSecurityPolicy();
  installStyles();
  if (!customElements.get("cyber-essentials-badge")) {
    customElements.define("cyber-essentials-badge", CyberEssentialsBadge);
  }
})();
