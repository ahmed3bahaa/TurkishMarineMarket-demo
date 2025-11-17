async function loadFragment(containerId, relativePath) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Detect how deep the current page is
  const depth = window.location.pathname.split("/").length - 2;

  // Build correct path (../ repeated based on depth)
  const prefix = "../".repeat(depth);

  const url = prefix + relativePath;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    const html = await res.text();
    el.innerHTML = html;
  } catch (err) {
    console.error("Failed to load fragment:", url, err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadFragment("site-header", "Partials/header.html");
  loadFragment("site-footer", "Partials/footer.html");
});
