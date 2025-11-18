async function loadFragment(containerId, relativePath, callback) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const depth = window.location.pathname.split("/").length - 2;
  const prefix = "../".repeat(depth);
  const url = prefix + relativePath;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);

    const html = await res.text();
    el.innerHTML = html;

    if (callback) callback();  // RUN AFTER LOADING

  } catch (err) {
    console.error("Failed to load fragment:", url, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {

  loadFragment("site-header", "Partials/header.html", function () {

    // ⭐ NOW RUN MENU CLONE AFTER HEADER IS READY
    if (typeof siteMenuClone === "function") siteMenuClone();
    // Re-bind mobile menu toggle (for phones)
document.querySelectorAll('.js-menu-toggle').forEach(btn => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    document.body.classList.toggle('offcanvas-menu');
    this.classList.toggle('active');
  });
});


    // ⭐ MOBILE CLICK-TO-OPEN DROPDOWN FIX
    document.querySelectorAll('.has-children > a').forEach(function (el) {
      el.addEventListener("click", function (e) {
        if (window.innerWidth >= 992) return; // Desktop = normal behavior
        e.preventDefault();
        this.parentNode.classList.toggle("active");
      });
    });

  });

  loadFragment("site-footer", "Partials/footer.html");
});
