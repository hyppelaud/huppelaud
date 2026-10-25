(function () {
  // Set after deploying the Apps Script Web App (see Code.gs / deploy instructions).
  var SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8TaLgMi6KIJ41ed4Ol5toUDG-zuXKIvTdWFwlS9jgubqMPNc1OhCcxS1wNlQ6gt8/exec";

  // Sent to the Sheet under the "Evenings" column from the original availability-picker
  // version of this page — kept as-is so the existing Apps Script deployment doesn't need
  // redeploying. Rename that column header in the Sheet itself if you'd like it to say
  // "Attending" instead; no code change needed for that.
  var ATTENDING_LABELS = {
    yes: "Yes, attending",
    no: "Not attending"
  };

  var attending = null;

  var attendButtons = document.querySelectorAll(".attend-option");
  var menuField = document.getElementById("menuField");

  attendButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      attending = btn.dataset.attending;
      attendButtons.forEach(function (b) {
        var isThis = b === btn;
        b.classList.toggle("selected", isThis);
        b.setAttribute("aria-pressed", String(isThis));
      });
      menuField.classList.toggle("hidden-field", attending === "no");
    });
  });

  var nameInput = document.getElementById("name");
  var errorEl = document.getElementById("formError");
  var successEl = document.getElementById("formSuccess");
  var submitBtn = document.getElementById("submitBtn");
  var submitLabel = submitBtn.textContent;

  submitBtn.addEventListener("click", function () {
    var name = nameInput.value.trim();
    var menuInput = document.querySelector('input[name="menu"]:checked');
    var needsMenu = attending === "yes";

    successEl.hidden = true;

    if (!name || !attending || (needsMenu && !menuInput)) {
      errorEl.textContent = "Please add your name, let us know if you're coming, and choose a main.";
      errorEl.hidden = false;
      return;
    }

    if (SCRIPT_URL.indexOf("REPLACE_WITH") === 0) {
      errorEl.textContent = "RSVP collection isn't wired up yet — try again shortly.";
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;

    var menu = needsMenu ? menuInput.value : "N/A";

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: name, evenings: ATTENDING_LABELS[attending], menu: menu })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(function () {
        submitBtn.textContent = "Sent ✓";
        successEl.textContent = attending === "yes"
          ? "Thanks — we'll see you there 🎉"
          : "Thanks for letting us know — hope to see you next time.";
        successEl.hidden = false;
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
        errorEl.textContent = "Something went wrong sending your RSVP — please try again.";
        errorEl.hidden = false;
      });
  });
})();
