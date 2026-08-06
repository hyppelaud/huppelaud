(function () {
  // Set after deploying the Apps Script Web App (see Code.gs / deploy instructions).
  var SCRIPT_URL = "REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL";

  var DAY_LABELS = {
    "2026-08-24": "Mon, Aug 24",
    "2026-08-25": "Tue, Aug 25",
    "2026-08-26": "Wed, Aug 26",
    "2026-08-27": "Thu, Aug 27",
    "2026-08-28": "Fri, Aug 28",
    "2026-08-29": "Sat, Aug 29",
    "2026-08-30": "Sun, Aug 30"
  };

  var selectedDays = new Set();

  document.querySelectorAll(".avail-day").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var date = btn.dataset.date;
      var isSelected = selectedDays.has(date);
      if (isSelected) {
        selectedDays.delete(date);
      } else {
        selectedDays.add(date);
      }
      btn.classList.toggle("selected", !isSelected);
      btn.setAttribute("aria-pressed", String(!isSelected));
    });
  });

  var nameInput = document.getElementById("name");
  var errorEl = document.getElementById("formError");
  var successEl = document.getElementById("formSuccess");
  var submitBtn = document.getElementById("submitBtn");
  var submitLabel = submitBtn.textContent;

  submitBtn.addEventListener("click", function () {
    var name = nameInput.value.trim();

    successEl.hidden = true;

    if (!name || selectedDays.size === 0) {
      errorEl.textContent = "Please add your name and pick at least one evening.";
      errorEl.hidden = false;
      return;
    }

    if (SCRIPT_URL.indexOf("REPLACE_WITH") === 0) {
      errorEl.textContent = "RSVP collection isn't wired up yet — try again shortly.";
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;

    var menuInput = document.querySelector('input[name="menu"]:checked');
    var menu = menuInput ? menuInput.value : "No preference given";

    var chosenDates = Array.from(selectedDays)
      .sort()
      .map(function (d) { return DAY_LABELS[d]; })
      .join(", ");

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ name: name, evenings: chosenDates, menu: menu })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then(function () {
        submitBtn.textContent = "Sent ✓";
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
