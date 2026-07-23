(() => {
  "use strict";

  const API_URL = "https://lt-countdown.nadine-swen.chatgpt.site/api/choice";
  const TARGET_AT = new Date("2026-08-09T00:00:00+02:00").getTime();
  const UNLOCK_AT = new Date("2026-08-02T00:00:00+02:00").getTime();
  const STARTING_DAYS = 17;

  const DAILY_NOTES = [
    "Vorfreude muss nicht laut sein. Manchmal reicht schon der Gedanke an einen schönen Tag.",
    "Ein guter Moment beginnt oft lange bevor er tatsächlich da ist.",
    "Heute bleibt noch ein kleines Detail verborgen – und genau das darf so sein.",
    "Manche Pläne fühlen sich schon beim Warten ein bisschen besonders an.",
    "Zwischen Alltag und Vorfreude entsteht gerade etwas Schönes.",
    "Heute zählt nicht, wie schnell die Zeit vergeht, sondern dass wir ihr etwas Gutes geben.",
    "Noch ist nicht alles verraten. Ein wenig Spannung gehört schließlich dazu.",
    "Halbzeit. Und aus einem fernen Datum wird langsam ein echter Plan.",
    "Ein ruhiger Gedanke für heute: Die besten Abende brauchen nicht viel – nur die richtigen Menschen.",
    "Ab jetzt darfst du ein kleines Stück unseres Plans mitgestalten.",
    "Die Tage werden weniger, die Vorfreude ein bisschen konkreter.",
    "Heute ist ein guter Tag, um sich auf gutes Essen und gute Gespräche zu freuen.",
    "Ein Datum, eine Uhrzeit und eine Idee – mehr braucht ein schöner Anfang manchmal nicht.",
    "Noch vier Tage. Genug Zeit für Vorfreude, zu wenig für Ungeduld.",
    "Bald wird aus diesem Countdown eine Erinnerung.",
    "Noch zweimal schlafen, dann muss nichts mehr gezählt werden.",
    "Nur noch einmal schlafen. Der Rest bleibt eine kleine Überraschung.",
    "Heute ist es so weit. Kein Countdown mehr – nur noch Zeit für uns.",
  ];

  const FOOD_LABELS = {
    italian: "Italienisch",
    asian: "Asiatisch",
    mediterranean: "Mediterran",
    "modern-european": "Modern europäisch",
    "comfort-food": "Gemütlich & unkompliziert",
    surprise: "Überrasch mich",
  };

  const params = new URLSearchParams(window.location.search);
  const ownerFromLink = params.get("owner") || "";
  const inviteFromLink = params.get("invite") || "";

  if (ownerFromLink) {
    sessionStorage.setItem("lt-countdown-owner", ownerFromLink);
  }
  if (inviteFromLink) {
    sessionStorage.removeItem("lt-countdown-owner");
    sessionStorage.setItem("lt-countdown-invite", inviteFromLink);
  }

  const ownerKey =
    ownerFromLink ||
    (!inviteFromLink
      ? sessionStorage.getItem("lt-countdown-owner") || ""
      : "");
  const inviteKey =
    inviteFromLink || sessionStorage.getItem("lt-countdown-invite") || "";

  if (ownerFromLink || inviteFromLink) {
    window.history.replaceState({}, "", window.location.pathname);
  }

  const countdownView = document.getElementById("countdown-view");
  const ownerView = document.getElementById("owner-view");

  if (ownerKey) {
    countdownView.classList.add("hidden");
    ownerView.classList.remove("hidden");
    initOwnerView(ownerKey);
  } else {
    initCountdown(inviteKey);
  }

  document.getElementById("back-to-countdown").addEventListener("click", () => {
    sessionStorage.removeItem("lt-countdown-owner");
  });

  function initCountdown(activeInviteKey) {
    const page = document.querySelector(".countdown-page");
    const title = document.getElementById("countdown-title");
    const edition = document.getElementById("edition");
    const day = document.getElementById("days");
    const hour = document.getElementById("hours");
    const minute = document.getElementById("minutes");
    const second = document.getElementById("seconds");
    const noteText = document.getElementById("daily-note-text");
    const progressEnd = document.getElementById("progress-end");
    const progressDot = document.getElementById("progress-dot");
    const progressBlock = document.getElementById("progress-block");

    const noteButton = document.getElementById("note-button");
    const note = document.getElementById("daily-note");
    const noteLabel = document.getElementById("note-button-label");
    const noteSymbol = document.getElementById("note-button-symbol");

    noteButton.addEventListener("click", () => {
      const open = !note.classList.contains("is-open");
      note.classList.toggle("is-open", open);
      noteButton.setAttribute("aria-expanded", String(open));
      noteLabel.textContent = open
        ? "Tagesnotiz schließen"
        : "Heutige Notiz öffnen";
      noteSymbol.textContent = open ? "−" : "+";
    });

    function updateCountdown() {
      const now = Date.now();
      const total = Math.max(0, TARGET_AT - now);
      const exactDays = Math.floor(total / 86400000);
      const daysLeft = total <= 0 ? 0 : Math.ceil(total / 86400000);
      const hoursLeft = Math.floor((total / 3600000) % 24);
      const minutesLeft = Math.floor((total / 60000) % 60);
      const secondsLeft = Math.floor((total / 1000) % 60);
      const dayIndex = Math.min(
        DAILY_NOTES.length - 1,
        Math.max(0, STARTING_DAYS - daysLeft),
      );
      const progress = dayIndex / (DAILY_NOTES.length - 1);
      const progressPercent = Math.max(4, progress * 100);
      const isToday = total <= 0;

      day.textContent = String(exactDays);
      hour.textContent = pad(hoursLeft);
      minute.textContent = pad(minutesLeft);
      second.textContent = pad(secondsLeft);
      title.textContent = isToday
        ? "Heute ist es so weit"
        : `Noch ${daysLeft} ${daysLeft === 1 ? "Tag" : "Tage"}`;
      edition.textContent = `Tag ${dayIndex + 1} / 18`;
      noteText.textContent = DAILY_NOTES[dayIndex];
      progressEnd.textContent = isToday ? "Heute" : "9. August";
      progressDot.style.left = `calc(${progressPercent}% - 6px)`;
      progressBlock.setAttribute(
        "aria-label",
        `${Math.round(progress * 100)} Prozent des Countdowns sind vergangen`,
      );

      page.style.setProperty(
        "--paper",
        `hsl(${34 - progress * 5} 37% ${97 - progress * 2}%)`,
      );
      page.style.setProperty(
        "--paper-deep",
        `hsl(${24 - progress * 3} 42% ${93 - progress * 3}%)`,
      );
      page.style.setProperty(
        "--accent",
        `hsl(${350 - progress * 6} ${34 + progress * 10}% ${31 - progress * 4}%)`,
      );
      page.style.setProperty(
        "--accent-soft",
        `hsl(${352 - progress * 4} ${30 + progress * 8}% ${82 - progress * 5}%)`,
      );
      page.style.setProperty(
        "--ink",
        `hsl(${19 - progress * 4} 14% ${29 - progress * 3}%)`,
      );
      page.style.setProperty("--reveal-progress", `${progressPercent}%`);
      page.style.setProperty(
        "--botanical-opacity",
        String(0.25 + progress * 0.34),
      );
      page.style.setProperty("--daily-shift", `${progress * 18}px`);

      updatePlanner(now, activeInviteKey);
    }

    updateCountdown();
    window.setInterval(updateCountdown, 1000);
    initPlanner(activeInviteKey);
  }

  function updatePlanner(now, activeInviteKey) {
    const locked = document.getElementById("planner-locked");
    const missing = document.getElementById("planner-missing-link");
    const planner = document.getElementById("planner-card");
    const success = document.getElementById("planner-success");

    if (now < UNLOCK_AT) {
      locked.classList.remove("hidden");
      missing.classList.add("hidden");
      planner.classList.add("hidden");
      success.classList.add("hidden");
      return;
    }

    locked.classList.add("hidden");
    if (!activeInviteKey) {
      missing.classList.remove("hidden");
      planner.classList.add("hidden");
      success.classList.add("hidden");
      return;
    }

    missing.classList.add("hidden");
    if (!success.dataset.visible) {
      planner.classList.remove("hidden");
    }
  }

  function initPlanner(activeInviteKey) {
    const form = document.getElementById("date-form");
    const planner = document.getElementById("planner-card");
    const success = document.getElementById("planner-success");
    const error = document.getElementById("form-error");
    const submit = document.getElementById("submit-button");
    const buttonCopy = submit.querySelector(".button-copy");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      error.classList.add("hidden");
      submit.disabled = true;
      buttonCopy.textContent = "Wird gespeichert …";

      const data = new FormData(form);
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-lt-invite": activeInviteKey,
          },
          body: JSON.stringify({
            foodDirection: data.get("foodDirection"),
            preferredDate: document.getElementById("preferred-date").value,
            preferredTime: document.getElementById("preferred-time").value,
          }),
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(
            payload.error || "Die Auswahl konnte nicht gespeichert werden.",
          );
        }

        planner.classList.add("hidden");
        success.dataset.visible = "true";
        success.classList.remove("hidden");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (caught) {
        error.textContent =
          caught instanceof Error
            ? caught.message
            : "Die Auswahl konnte nicht gespeichert werden.";
        error.classList.remove("hidden");
      } finally {
        submit.disabled = false;
        buttonCopy.textContent = "Meine Auswahl an T senden";
      }
    });

    document.getElementById("change-choice").addEventListener("click", () => {
      delete success.dataset.visible;
      success.classList.add("hidden");
      planner.classList.remove("hidden");
      planner.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function initOwnerView(initialKey) {
    const access = document.getElementById("owner-access");
    const input = document.getElementById("owner-key");
    const error = document.getElementById("owner-error");

    access.addEventListener("submit", (event) => {
      event.preventDefault();
      const entered = input.value.trim();
      if (!entered) return;
      sessionStorage.setItem("lt-countdown-owner", entered);
      loadChoice(entered);
    });

    if (initialKey) {
      loadChoice(initialKey);
    } else {
      access.classList.remove("hidden");
    }

    async function loadChoice(key) {
      const loading = document.getElementById("choice-loading");
      const empty = document.getElementById("choice-empty");
      const card = document.getElementById("choice-card");
      access.classList.add("hidden");
      error.classList.add("hidden");
      empty.classList.add("hidden");
      card.classList.add("hidden");
      loading.classList.remove("hidden");

      try {
        const response = await fetch(API_URL, {
          headers: { authorization: `Bearer ${key}` },
          cache: "no-store",
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Der private Zugang ist nicht gültig.");
        }

        loading.classList.add("hidden");
        if (!payload.choice) {
          empty.classList.remove("hidden");
          return;
        }

        const choice = payload.choice;
        document.getElementById("choice-food").textContent =
          FOOD_LABELS[choice.foodDirection] || choice.foodDirection;
        document.getElementById("choice-date").textContent =
          new Intl.DateTimeFormat("de-DE", {
            dateStyle: "full",
            timeZone: "Europe/Berlin",
          }).format(new Date(`${choice.preferredDate}T12:00:00+02:00`));
        document.getElementById("choice-time").textContent =
          `${choice.preferredTime} Uhr`;
        document.getElementById("choice-updated").textContent =
          `Zuletzt aktualisiert am ${new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Europe/Berlin",
          }).format(new Date(choice.updatedAt))}`;
        card.classList.remove("hidden");
      } catch (caught) {
        loading.classList.add("hidden");
        access.classList.remove("hidden");
        error.textContent =
          caught instanceof Error
            ? caught.message
            : "Die Auswahl konnte nicht geladen werden.";
        error.classList.remove("hidden");
      }
    }
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }
})();
