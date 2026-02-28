// js/layout.js

async function loadFragment(containerId, relativePath, callback) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Remove empty segments caused by leading "/" and compute folder depth
  // depth = number of folders between the project root folder and the current file
  const segments = window.location.pathname.split("/").filter(Boolean);

  // Example:
  // /TurkishMarineMarket-demo/index.html              => ["TurkishMarineMarket-demo","index.html"] => depth 0
  // /TurkishMarineMarket-demo/Service-pages/a.html    => ["TurkishMarineMarket-demo","Service-pages","a.html"] => depth 1
  const depth = Math.max(0, segments.length - 2);

  const prefix = "../".repeat(depth);
  const url = prefix + relativePath;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

    const html = await res.text();
    el.innerHTML = html;

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