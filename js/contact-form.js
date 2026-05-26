(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const formStatus = document.getElementById("formStatus");
  const submitButton = form.querySelector('button[type="submit"]');

  function getSuccessUrl() {
    const isLocal =
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "localhost";

    return isLocal ? "Contact-Success.html" : form.dataset.successUrl;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    formStatus.className = "mt-3 mb-0 text-primary";
    formStatus.textContent = "Sending your message...";
    submitButton.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Form submission failed.");
      }

      window.location.href = getSuccessUrl();
    } catch (error) {
      formStatus.className = "mt-3 mb-0 text-danger";
      formStatus.textContent = "Sorry, your message could not be sent. Please try again.";
      submitButton.disabled = false;
    }
  });
})();
