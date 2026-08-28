document.addEventListener("DOMContentLoaded", () => {
  // The Micro-Macro Mirror: One file orchestrates all templates by checking the DOM.
  if (document.getElementById("nadForm")) initNAD();
  if (document.getElementById("returnedVisitsForm")) initReturnedVisits();
  if (document.getElementById("bookOffForm")) initBookOff();
});

/* =========================================
   NAD (No Answer at Door) Engine
   ========================================= */
function initNAD() {
  const form = document.getElementById("nadForm");
  const noteOut = document.getElementById("noteOutput");
  const teamsOut = document.getElementById("teamsOutput");
  const feedback = document.getElementById("copyFeedback");

  function generate() {
    const rawDate = val("visitDate");
    const date = formatDate(rawDate);
    const time = orDash(val("visitTime"));
    const clientName = orDash(val("clientName"));
    const staffName = orDash(val("staffName"));

    const steps = orDash(val("stepsCompleted"));
    const contact = orDash(val("contactAttempts"));
    const ala = orDash(val("alaNotification"));
    const comments = orDash(val("comments"));

    noteOut.value = [
      "Title - NAD (No Answer at Door)",
      `Date: ${date} | Time: ${time}`,
      `Client Name: ${clientName}`,
      `Staff Name: ${staffName}`,
      `Steps Completed: ${steps}`,
      `Contact Attempts: ${contact}`,
      `ALA/Office Notification: ${ala}`,
      `Comments: ${comments}`
    ].join("\n");

    const tDate = isToday(rawDate) ? "today" : (date !== dash ? date : "[date]");
    const tTime = time !== dash ? time : "[time]";
    const tClient = clientName !== dash ? clientName : "[Client name]";
    const tStaff = staffName !== dash ? staffName : "[Staff name]";

    teamsOut.value = `NAD for ${tClient} at ${tTime} ${tDate}. Staff ${tStaff} was unable to gain entry. Office notified.`;
  }

  setTodayDate("visitDate");
  form.addEventListener("input", generate);
  document.getElementById("copyNoteBtn").addEventListener("click", () => copyText(noteOut, feedback, generate));
  document.getElementById("copyTeamsBtn").addEventListener("click", () => copyText(teamsOut, feedback, generate));
  generate();
}

/* =========================================
   Returned Visits Engine
   ========================================= */
function initReturnedVisits() {
  const form = document.getElementById("returnedVisitsForm");
  const noteOut = document.getElementById("noteOutput");
  const teamsOut = document.getElementById("teamsOutput");
  const feedback = document.getElementById("copyFeedback");

  function generate() {
    const rawDate = val("visitDate");
    const date = formatDate(rawDate);
    const staffName = orDash(val("staffName"));
    const numVisits = orDash(val("numVisits"));
    const hoursReturned = formatHours(val("hoursReturned"), val("minutesReturned"));
    const keyword = orDash(val("keyword"));
    const clients = orDash(val("clients"));
    const description = orDash(val("description"));

    noteOut.value = [
      "Title - Returned Visits Book Off",
      `Date: ${date} | Staff Name: ${staffName}`,
      `Number of visits returned: ${numVisits}`,
      `Total hours returned: ${hoursReturned}`,
      `Keyword/Reason: ${keyword}`,
      `Client(s): ${clients}`,
      `Description: ${description}`
    ].join("\n");

    const tDate = isToday(rawDate) ? "today" : (date !== dash ? date : "[date]");
    const tStaff = staffName !== dash ? staffName : "[Name of staff]";
    const tClient = clients !== dash ? clients : "[client name]";
    const tKeyword = keyword !== dash ? keyword : "[keyword]";
    const tVisits = numVisits !== dash ? `${numVisits}` : "[number of]";

    teamsOut.value = `Staff ${tStaff} returned visit for ${tClient} ${tDate}, ${tKeyword}. ${tVisits} back to planner.`;
  }

  setTodayDate("visitDate");
  form.addEventListener("input", generate);
  document.getElementById("copyNoteBtn").addEventListener("click", () => copyText(noteOut, feedback, generate));
  document.getElementById("copyTeamsBtn").addEventListener("click", () => copyText(teamsOut, feedback, generate));
  generate();
}

/* =========================================
   Book Off Engine
   ========================================= */
function initBookOff() {
  const form = document.getElementById("bookOffForm");
  const noteOut = document.getElementById("noteOutput");
  const teamsOut = document.getElementById("teamsOutput");
  const feedback = document.getElementById("copyFeedback");

  function generate() {
    const rawDate = val("visitDate");
    const date = formatDate(rawDate);

    // Capture and capitalize the dropdown selection for the Note Title
    const rawType = val("bookOffType");
    const typeTitle = rawType === "full day" ? "Full Day" : (rawType === "partial day" ? "Partial Day" : "Partial/Full Day");

    const staffName = orDash(val("staffName"));
    const numVisits = orDash(val("numVisits"));
    const hoursReturned = formatHours(val("hoursReturned"), val("minutesReturned"));
    const keyword = orDash(val("keyword"));
    const description = orDash(val("description"));

    noteOut.value = [
      `Title - Staff Book Off (${typeTitle})`,
      `Date: ${date} | Staff Name: ${staffName}`,
      `Number of visits: ${numVisits}`,
      `Total hours returned: ${hoursReturned}`,
      `Keyword/Reason: ${keyword}`,
      `Description: ${description}`
    ].join("\n");

    const tDate = isToday(rawDate) ? "today" : (date !== dash ? date : "[date]");
    const tStaff = staffName !== dash ? staffName : "[Staff name]";
    const tType = rawType || "[full day/partial day]";
    const tKeyword = keyword !== dash ? keyword : "[keyword]";
    const tVisits = numVisits !== dash ? `${numVisits} visit(s)` : "[No of] visits";

    teamsOut.value = `Staff ${tStaff} booked off for ${tDate} for ${tType} because of ${tKeyword}. ${tVisits} back to planner.`;
  }

  setTodayDate("visitDate");
  form.addEventListener("input", generate);
  document.getElementById("copyNoteBtn").addEventListener("click", () => copyText(noteOut, feedback, generate));
  document.getElementById("copyTeamsBtn").addEventListener("click", () => copyText(teamsOut, feedback, generate));
  generate();
}

/* =========================================
   NAD (No Answer at Door) Engine
   ========================================= */
function initNAD() {
  const form = document.getElementById("nadForm");
  const noteOut = document.getElementById("noteOutput");
  const teamsOut = document.getElementById("teamsOutput");
  const feedback = document.getElementById("copyFeedback");

  function formatSelect(val) { return val ? val : "[Select]"; }
  function formatText(val, placeholder) { return val ? val : placeholder; }

  // 1. The Localized Chronometer
  function autoFillTime() {
    const timeInput = document.getElementById("visitTime");
    if (timeInput && !timeInput.value) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      // Injects the exact current local machine time (e.g., 14:06)
      timeInput.value = `${hh}:${mm}`;
    }
  }

  function generate() {
    // 2. Data Extraction
    const rawDate = val("visitDate");
    const date = formatDate(rawDate) !== dash ? formatDate(rawDate) : "[Date]";

    // Captures either the auto-filled time, or whatever the user types over it
    const visitTime = formatText(val("visitTime"), "[Start–End]");

    const priority = formatSelect(val("priority"));
    const staffName = formatText(val("staffName"), "[Staff Name]");

    const sReported = formatSelect(val("staffReported"));
    const sAddress = formatSelect(val("addressVerified"));
    const sEntry = formatSelect(val("entryInstructions"));
    const sWaited = formatSelect(val("waited15"));
    const nadDesc = formatText(val("nadDesc"), "[Description]");

    const cCalled = formatSelect(val("clientCalled"));
    const cOutcome = formatSelect(val("clientOutcome"));
    const clientDesc = formatText(val("clientDesc"), "[Description]");

    const c1Name = formatText(val("c1Name"), "[Name/Relationship]");
    const c1Outcome = formatSelect(val("c1Outcome"));
    const c1Desc = formatText(val("c1Desc"), "[Description]");

    const c2Name = formatText(val("c2Name"), "[Name/Relationship]");
    const c2Outcome = formatSelect(val("c2Outcome"));
    const c2Desc = formatText(val("c2Desc"), "[Description]");

    const alaNotified = formatSelect(val("alaNotified"));
    const alaOffice = formatText(val("alaOffice"), "[Office/Site Name / N/A]");
    const alaMethod = formatSelect(val("alaMethod"));

    // 3. Compile Output Note
    noteOut.value = [
      "Title - NAD",
      `Visit Details: Date: ${date} | Time: ${visitTime} | Priority: ${priority}`,
      `Staff Name: ${staffName}`,
      "",
      "NAD Steps Completed:",
      `Staff reported NAD: ${sReported}`,
      `Address verified with staff: ${sAddress}`,
      `Entry instructions followed, if applicable: ${sEntry}`,
      `Staff waited 15 minutes: ${sWaited} - ${nadDesc}`,
      "",
      "Client Contact Attempt:",
      `Client called: ${cCalled}`,
      `Outcome: ${cOutcome} - ${clientDesc}`,
      "",
      "Contacts Called:",
      `1. ${c1Name} – ${c1Outcome} - ${c1Desc}`,
      `2. ${c2Name} – ${c2Outcome} - ${c2Desc}`,
      "",
      "ALA Notification:",
      `ALA notified: ${alaNotified} | ALA office/site notified: ${alaOffice}`,
      `Method: ${alaMethod}`
    ].join("\n");

    // 4. Compile Teams Message
    const tDate = isToday(rawDate) ? "today" : date;
    const tTime = visitTime !== "[Start–End]" ? visitTime : "[time]";
    teamsOut.value = `NAD recorded at ${tTime} ${tDate}. Staff ${staffName} reported NAD. Priority: ${priority}. ALA notified: ${alaNotified}.`;
  }

  // 5. The Initialization Sequence
  setTodayDate("visitDate");
  autoFillTime(); // Propels the current time into the text field on load
  form.addEventListener("input", generate);
  document.getElementById("copyNoteBtn").addEventListener("click", () => copyText(noteOut, feedback, generate));
  document.getElementById("copyTeamsBtn").addEventListener("click", () => copyText(teamsOut, feedback, generate));
  generate();
}