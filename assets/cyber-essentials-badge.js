/* Official Blockmark Cyber Essentials widget for Quantica Labs Ltd.
   One embed, used on every home and sales page. */
(function () {
  var EMBED =
    '<iframe src="https://registry.blockmarktech.com/certificates/5b6c06dd-6bfc-4f2a-a1ff-0b5465798886/widget/?tooltip_position=bottom_right&theme=transparent&hover=t" style="border:none;height:204px;width:204px;" loading="lazy" title="Cyber Essentials certificate – Quantica Labs Ltd"></iframe>';

  class CyberEssentialsBadge extends HTMLElement {
    connectedCallback() {
      if (this.querySelector("iframe")) return;
      this.innerHTML = EMBED;
    }
  }

  if (!customElements.get("cyber-essentials-badge")) {
    customElements.define("cyber-essentials-badge", CyberEssentialsBadge);
  }
})();
