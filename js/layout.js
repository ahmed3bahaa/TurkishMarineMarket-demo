// js/layout.js

const layoutBaseUrl = (() => {
  const scriptUrl = new URL(
    document.currentScript ? document.currentScript.src : "js/layout.js",
    window.location.href
  );

  return new URL("../", scriptUrl);
})();

function resolveLayoutUrl(relativePath) {
  return new URL(relativePath.replace(/^\/+/, ""), layoutBaseUrl).href;
}

function isRelativeAsset(path) {
  return path && !/^(?:[a-z][a-z\d+.-]*:|\/\/|#|data:|mailto:|tel:|\/)/i.test(path);
}

async function loadFragment(containerId, relativePath, callback) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const url = resolveLayoutUrl(relativePath);

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const html = await res.text();
    el.innerHTML = html;
    el.querySelectorAll("[src]").forEach((node) => {
      const src = node.getAttribute("src");
      if (isRelativeAsset(src)) {
        node.setAttribute("src", resolveLayoutUrl(src));
      }
    });

    if (typeof callback === "function") callback();
  } catch (err) {
    console.error("Failed to load fragment:", url, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadFragment("site-header", "Partials/header.html", () => {
    // Run menu clone after header is loaded
    if (typeof siteMenuClone === "function") siteMenuClone();

    // Re-bind mobile menu toggle
    document.querySelectorAll(".js-menu-toggle").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.toggle("offcanvas-menu");
        this.classList.toggle("active");
      });
    });

    // Mobile click-to-open dropdown fix
    document.querySelectorAll(".has-children > a").forEach((a) => {
      a.addEventListener("click", function (e) {
        if (window.innerWidth >= 992) return; // Desktop normal behavior
        e.preventDefault();
        this.parentNode.classList.toggle("active");
      });
    });
  });

  loadFragment("site-footer", "Partials/footer.html");
});
