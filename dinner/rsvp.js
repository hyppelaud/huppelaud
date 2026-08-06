(function () {
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
  var submitBtn = document.getElementById("submitBtn");

  submitBtn.addEventListener("click", function () {
    var name = nameInput.value.trim();

    if (!name || selectedDays.size === 0) {
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

    var subject = "Hüppelaud Dinner RSVP — " + name;
    var body =
      "Name: " + name + "\n" +
      "Available evenings (from 5pm): " + chosenDates + "\n" +
      "Main course: " + menu;

    window.location.href =
      "mailto:tere@huppelaud.eu?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  });
})();
