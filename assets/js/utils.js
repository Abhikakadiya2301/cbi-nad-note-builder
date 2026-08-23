const dash = "—";

function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
}

function orDash(s) {
  return s && s.length ? s : dash;
}

function formatDate(raw) {
  if (!raw) return dash;
  const parts = raw.split("-");
  if (parts.length !== 3) return raw;
  const [y, m, d] = parts;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mi = parseInt(m, 10) - 1;
  if (mi < 0 || mi > 11) return raw;
  return `${months[mi]} ${parseInt(d, 10)}, ${y}`;
}

function formatHours(h, m) {
  if (!h && !m) return dash;
  const hh = h || "0";
  const mm = m || "00";
  return `${hh}h ${mm}m`;
}

function isToday(rawDateString) {
  if (!rawDateString) return false;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return rawDateString === `${yyyy}-${mm}-${dd}`;
}

function setTodayDate(inputId) {
  const dateInput = document.getElementById(inputId);
  if (!dateInput) return;
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.value = `${yyyy}-${mm}-${dd}`;
}

function copyText(targetElement, feedbackElement, generateCallback) {
  if (!targetElement.value && generateCallback) generateCallback();
  const text = targetElement.value;

  function showFeedback() {
    if(!feedbackElement) return;
    feedbackElement.classList.add("show");
    clearTimeout(feedbackElement._t);
    feedbackElement._t = setTimeout(() => {
      feedbackElement.classList.remove("show");
    }, 2200);
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(showFeedback).catch(() => fallbackCopy(targetElement, showFeedback));
  } else {
    fallbackCopy(targetElement, showFeedback);
  }
}

function fallbackCopy(targetElement, cb) {
  targetElement.removeAttribute("readonly");
  targetElement.focus();
  targetElement.select();
  try {
    document.execCommand("copy");
    if(cb) cb();
  } catch (e) {} finally {
    targetElement.setAttribute("readonly", "true");
  }
}