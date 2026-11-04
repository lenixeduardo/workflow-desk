/* Workflow Desk interactive examples. No analytics, server calls or user data are sent by this file. */
(function () {
  "use strict";

  var tasks = document.getElementById("tasks-per-week");
  var minutes = document.getElementById("minutes-per-task");
  var reduction = document.getElementById("task-reduction");
  var result = document.getElementById("calc-hours");
  var total = document.getElementById("calc-total-minutes");

  function updateEstimate() {
    if (!tasks || !minutes || !reduction || !result || !total) return;
    var weeklyTasks = Number(tasks.value);
    var duration = Number(minutes.value);
    var savedShare = Number(reduction.value) / 100;
    if (![weeklyTasks, duration, savedShare].every(Number.isFinite)) return;
    var savedMinutes = weeklyTasks * duration * savedShare * (52 / 12);
    var monthlyHours = savedMinutes / 60;

    document.getElementById("tasks-output").textContent = weeklyTasks + " / week";
    document.getElementById("minutes-output").textContent = duration + " min";
    document.getElementById("reduction-output").textContent = reduction.value + "%";
    result.textContent = monthlyHours.toLocaleString("en-US", {maximumFractionDigits: 1, minimumFractionDigits: 1}) + " hours";
    total.textContent = Math.round(savedMinutes).toLocaleString("en-US") + " illustrative minutes per month";
  }

  if (tasks && minutes && reduction) {
    [tasks, minutes, reduction].forEach(function (input) {
      input.addEventListener("input", updateEstimate);
      input.addEventListener("change", updateEstimate);
    });
    updateEstimate();
  }

  var runButton = document.getElementById("run-demo");
  var status = document.getElementById("demo-status");
  var steps = Array.prototype.slice.call(document.querySelectorAll(".flow-card[data-demo-step]"));
  var timerIds = [];

  function resetSteps() {
    timerIds.forEach(function (id) { clearTimeout(id); });
    timerIds = [];
    steps.forEach(function (step) {
      step.classList.remove("is-running", "is-done");
    });
  }

  if (runButton && status && steps.length === 3) {
    runButton.addEventListener("click", function () {
      resetSteps();
      runButton.disabled = true;
      runButton.textContent = "Running sample…";
      status.textContent = "Sample enquiry received. Starting checks…";

      steps.forEach(function (step, index) {
        timerIds.push(setTimeout(function () {
          if (index > 0) {
            steps[index - 1].classList.remove("is-running");
            steps[index - 1].classList.add("is-done");
          }
          step.classList.add("is-running");
          if (index === 0) status.textContent = "01 / New sample enquiry added.";
          if (index === 1) status.textContent = "02 / Fields checked. Routed to the owner.";
          if (index === 2) status.textContent = "03 / Human review requested.";
        }, 350 + index * 900));
      });

      timerIds.push(setTimeout(function () {
        steps[2].classList.remove("is-running");
        steps[2].classList.add("is-done");
        status.textContent = "Sample finished. No external apps were contacted.";
        runButton.disabled = false;
        runButton.textContent = "Replay sample";
      }, 350 + steps.length * 900));
    });
  }
})();
