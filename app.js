(() => {
  const journeys = window.DRAMA_JOURNEYS;
  if (!journeys || !journeys.length) {
    console.error("DRAMA_JOURNEYS missing");
    return;
  }

  let journeyId = journeys[0].id;
  let nodeIndex = 0;
  let completedSteps = 0;
  let busy = false;
  let eventCursor = 1;
  let runId = 0;

  const tabsEl = document.getElementById("scenarioTabs");
  const goalText = document.getElementById("goalText");
  const stepList = document.getElementById("stepList");
  const stepCounter = document.getElementById("stepCounter");
  const chatBody = document.getElementById("chatBody");
  const composerHint = document.getElementById("composerHint");
  const composerInput = document.getElementById("composerInput");
  const composerForm = document.getElementById("composerForm");
  const sendBtn = document.getElementById("sendBtn");
  const outcomeBanner = document.getElementById("outcomeBanner");
  const outcomeText = document.getElementById("outcomeText");
  const waStatus = document.getElementById("waStatus");
  const phoneTime = document.getElementById("phoneTime");
  const eventList = document.getElementById("eventList");
  const eventStatus = document.getElementById("eventStatus");

  const SINGLE_TICK = `
    <svg viewBox="0 0 12 11" aria-hidden="true">
      <path d="M10.2 1.2a.75.75 0 0 1 .1 1.05L5.2 8.7a.75.75 0 0 1-1.12.05L1.35 5.9A.75.75 0 1 1 2.45 4.9l2.05 2.15 4.55-5.75a.75.75 0 0 1 1.15-.1z"/>
    </svg>`;
  const DOUBLE_TICK = `
    <svg viewBox="0 0 16 11" aria-hidden="true">
      <path d="M9.85 1.2a.75.75 0 0 1 .1 1.05L4.85 8.7a.75.75 0 0 1-1.12.05L1.05 5.9A.75.75 0 1 1 2.15 4.9l2.0 2.1 4.55-5.7a.75.75 0 0 1 1.15-.1z"/>
      <path d="M14.35 1.2a.75.75 0 0 1 .1 1.05L9.35 8.7a.75.75 0 0 1-1.12.05l-.55-.58a.75.75 0 0 1 1.08-1.04l.05.05 4.4-5.88a.75.75 0 0 1 1.14-.1z"/>
    </svg>`;

  function currentJourney() {
    return journeys.find((j) => j.id === journeyId) || journeys[0];
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function updateClock() {
    phoneTime.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function formatMsgTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\n", "<br>")
      .replaceAll(/\*(.*?)\*/g, "<strong>$1</strong>");
  }

  function ticksHtml(state) {
    if (state === "sent") return `<span class="ticks sent">${SINGLE_TICK}</span>`;
    return `<span class="ticks ${state === "read" ? "read" : "delivered"}">${DOUBLE_TICK}</span>`;
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    const groups = [
      { key: "drama", label: "短剧出海核心旅程", hint: "激活 · 悬念召回 · 付费墙挽回" },
      { key: "retain", label: "短剧留存与变现", hint: "金币续充 · VIP · 更新提醒" },
      { key: "live", label: "Meta 直播场景", hint: "开播提醒 · 闪购 · 回放转化" },
    ];

    groups.forEach((g) => {
      const section = document.createElement("div");
      section.className = "scenario-group";

      const head = document.createElement("div");
      head.className = "scenario-group-head";
      head.innerHTML = `<strong>${g.label}</strong><span>${g.hint}</span>`;
      section.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "scenario-group-grid";

      journeys
        .filter((j) => (j.group || "industry") === g.key)
        .forEach((j, idx) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "scenario-tab" + (j.id === journeyId ? " active" : "");
          btn.innerHTML = `<em>${idx + 1}</em><strong>${j.title}</strong><span>${j.subtitle}</span>`;
          btn.addEventListener("click", () => {
            if (j.id === journeyId && !outcomeBanner.hidden) {
              resetJourney();
              return;
            }
            journeyId = j.id;
            resetJourney();
          });
          grid.appendChild(btn);
        });

      section.appendChild(grid);
      tabsEl.appendChild(section);
    });
  }

  function renderEvents() {
    const j = currentJourney();
    const total = (j.events || []).length;
    eventList.innerHTML = "";
    (j.events || []).forEach((e, i) => {
      let state = "pending";
      if (!outcomeBanner.hidden || i < eventCursor) state = "done";
      else if (i === eventCursor) state = "active";
      const li = document.createElement("li");
      li.className = state;
      li.innerHTML = `<span class="t">${e.time}</span><div><strong>${e.title}</strong><p>${e.desc}</p></div>`;
      eventList.appendChild(li);
    });
    eventStatus.textContent = outcomeBanner.hidden
      ? eventCursor >= total
        ? "RUNNING"
        : "TRIGGERED"
      : "COMPLETED";
  }

  function renderProfile() {
    const p = currentJourney().persona;
    if (!p) return;
    document.getElementById("profileAvatar").textContent = p.initials;
    document.getElementById("profileName").textContent = p.name;
    document.getElementById("profileMeta").textContent = p.meta;
    document.getElementById("agentHint").textContent = p.agentHint;

    const info = document.getElementById("profileInfo");
    info.innerHTML = "";
    (p.info || []).forEach(([k, v]) => {
      const row = document.createElement("div");
      row.innerHTML = `<dt>${k}</dt><dd>${v}</dd>`;
      info.appendChild(row);
    });

    const tags = document.getElementById("profileTags");
    tags.innerHTML = "";
    (p.tags || []).forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      tags.appendChild(span);
    });

    const insights = document.getElementById("profileInsights");
    insights.innerHTML = "";
    (p.insights || []).forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      insights.appendChild(li);
    });
  }

  function renderSteps() {
    const j = currentJourney();
    // Progress tracks script nodes (excluding final complete node as a step label if steps shorter)
    const labels =
      j.steps.length === j.script.length
        ? j.steps
        : j.script.map((n, i) => j.steps[i] || (n.complete ? "完成转化" : `步骤 ${i + 1}`));
    const total = labels.length;
    const finished = !outcomeBanner.hidden;
    stepList.innerHTML = "";
    labels.forEach((label, i) => {
      const li = document.createElement("li");
      const done = finished || i < completedSteps;
      const current = !finished && i === completedSteps;
      li.className = done ? "done" : current ? "current" : "";
      li.innerHTML = `<span class="dot">${done ? "✓" : i + 1}</span><span>${label}</span>`;
      stepList.appendChild(li);
    });
    const shown = finished ? total : Math.min(completedSteps + 1, total);
    stepCounter.textContent = `${finished ? total : Math.min(completedSteps, total)} / ${total}`;
  }

  function appendMessage(msg) {
    if (msg.type === "day") {
      const el = document.createElement("div");
      el.className = "day-chip";
      el.textContent = msg.text;
      chatBody.appendChild(el);
      return;
    }
    if (msg.type === "encryption") {
      const el = document.createElement("div");
      el.className = "encryption-note";
      el.textContent = msg.text;
      chatBody.appendChild(el);
      return;
    }
    if (msg.type === "system") {
      const el = document.createElement("div");
      el.className = "bubble system-wrap";
      el.textContent = msg.text;
      chatBody.appendChild(el);
      return;
    }
    if (msg.type === "card") {
      const wrap = document.createElement("div");
      wrap.className = "msg-row in";
      wrap.innerHTML = `
        <div class="rich">
          <div class="rich-media" style="background-image:${msg.image}">
            <span class="tag">${msg.tag || "ReelNest"}</span>
          </div>
          <div class="rich-body">
            <strong>${msg.title}</strong>
            <p>${escapeHtml(msg.body)}</p>
          </div>
          ${msg.cta ? `<div class="rich-cta">${msg.cta}</div>` : ""}
          <div class="meta"><span class="clock">${formatMsgTime()}</span></div>
        </div>`;
      chatBody.appendChild(wrap);
      return;
    }
    if (msg.type === "list") {
      const wrap = document.createElement("div");
      wrap.className = "msg-row in";
      wrap.innerHTML = `
        <div class="list-card">
          <div class="list-head">${msg.title}</div>
          <div class="list-sub">${msg.body}</div>
          <div class="list-btn">☰ ${msg.button || "View list"}</div>
          <div class="meta" style="padding:0 8px 4px"><span class="clock">${formatMsgTime()}</span></div>
        </div>`;
      chatBody.appendChild(wrap);
      return;
    }
    if (msg.type === "video" || msg.type === "product") {
      const wrap = document.createElement("div");
      wrap.className = "msg-row in";
      const tone = msg.type === "video" ? "linear-gradient(135deg,#2b1659,#7c3aed)" : "linear-gradient(135deg,#881337,#fb7185)";
      const tag = msg.type === "video" ? "VIDEO" : "PRODUCT";
      wrap.innerHTML = `
        <div class="rich">
          <div class="rich-media" style="background:${tone}">
            <span class="tag">${tag}</span>
          </div>
          <div class="rich-body">
            <strong>${msg.title || ""}</strong>
            <p>${escapeHtml(msg.body || "")}</p>
          </div>
          ${msg.button ? `<div class="rich-cta">${msg.button}</div>` : ""}
          <div class="meta"><span class="clock">${formatMsgTime()}</span></div>
        </div>`;
      chatBody.appendChild(wrap);
      return;
    }

    const isUser = msg.type === "user";
    const row = document.createElement("div");
    row.className = `msg-row ${isUser ? "out" : "in"}`;
    const quote = msg.replyPreview
      ? `<div class="reply-quote"><span class="reply-bar"></span><div><b>ReelNest</b><p>${escapeHtml(
          msg.replyPreview
        )}</p></div></div>`
      : "";
    row.innerHTML = `
      <div class="bubble ${isUser ? "out" : "in"}">
        ${quote}
        <div class="text">${escapeHtml(msg.text)}</div>
        <div class="meta">
          <span class="clock">${formatMsgTime()}</span>
          ${isUser ? ticksHtml("sent") : ""}
        </div>
      </div>`;
    chatBody.appendChild(row);
    if (isUser) animateOutgoingTicks(row);
  }

  function animateOutgoingTicks(row) {
    const ticks = row.querySelector(".ticks");
    if (!ticks) return;
    ticks.className = "ticks sent";
    ticks.innerHTML = SINGLE_TICK;
    setTimeout(() => {
      ticks.className = "ticks delivered";
      ticks.innerHTML = DOUBLE_TICK;
    }, 280);
    setTimeout(() => {
      ticks.className = "ticks read";
    }, 750);
  }

  function clearChoices() {
    chatBody.querySelectorAll(".choices").forEach((n) => n.remove());
    chatBody.querySelectorAll(".msg-row.has-footer").forEach((n) => n.classList.remove("has-footer"));
  }

  function renderChoices(choices) {
    clearChoices();
    if (!choices || !choices.length) {
      composerHint.textContent = "场景已完成 · 可自由输入或切换旅程";
      return;
    }

    // Always stack like WhatsApp quick replies, same width as bubbles
    const wrap = document.createElement("div");
    wrap.className = "choices";
    if (choices.length === 2) wrap.classList.add("choices--pair");

    choices.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice";
      btn.textContent = c.label;
      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        onChoice(c, btn);
      });
      wrap.appendChild(btn);
    });

    const lastIn = [...chatBody.querySelectorAll(".msg-row.in")].pop();
    if (lastIn) lastIn.after(wrap);
    else chatBody.appendChild(wrap);

    composerHint.textContent = "点击绿色快捷回复推进旅程，也可在下方输入框发消息";
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function playNode(index, myRun) {
    const j = currentJourney();
    const node = j.script[index];
    if (!node) {
      console.error("Missing node", index, j.id);
      busy = false;
      sendBtn.disabled = false;
      composerHint.textContent = "流程节点缺失，请点击重新播放";
      return;
    }

    busy = true;
    sendBtn.disabled = true;
    waStatus.textContent = "typing…";
    clearChoices();
    nodeIndex = index;

    try {
      for (const msg of node.messages) {
        if (myRun !== runId) return;
        const delay =
          msg.type === "system" || msg.type === "day" || msg.type === "encryption"
            ? 60
            : msg.type === "card" || msg.type === "list" || msg.type === "video" || msg.type === "product"
              ? 120
              : 160;
        await wait(delay);
        if (myRun !== runId) return;
        appendMessage(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
      }

      if (myRun !== runId) return;

      if (node.complete) {
        completedSteps = Math.max(j.steps.length, j.script.length);
        eventCursor = (j.events || []).length;
        outcomeBanner.hidden = false;
        outcomeText.textContent = j.outcome;
        renderSteps();
        renderEvents();
        composerHint.textContent = "目标已达成 · 可切换场景或重新播放";
        waStatus.textContent = "online";
        clearChoices();
        return;
      }

      if (!node.choices || !node.choices.length) {
        console.error("Dead-end node without choices", index, j.id);
        composerHint.textContent = "此步骤无选项，请重新播放";
        return;
      }

      await wait(100);
      if (myRun !== runId) return;
      renderChoices(node.choices);
      waStatus.textContent = "online";
    } finally {
      if (myRun === runId) {
        busy = false;
        sendBtn.disabled = false;
      }
    }
  }

  async function onChoice(choice, btnEl) {
    if (busy) return;
    if (choice.next == null || Number.isNaN(Number(choice.next))) {
      console.error("Invalid choice next", choice);
      return;
    }

    const myRun = runId;
    busy = true;
    sendBtn.disabled = true;

    try {
      const wrap = btnEl?.closest(".choices");
      if (wrap) {
        wrap.querySelectorAll(".choice").forEach((b) => {
          b.disabled = true;
          if (b === btnEl) b.classList.add("selected");
        });
        await wait(200);
      }
      if (myRun !== runId) return;

      clearChoices();

      const outgoing =
        choice.userText ||
        (!choice.silent ? choice.label : null);
      if (outgoing) {
        appendMessage({
          type: "user",
          text: outgoing,
          replyPreview: choice.label,
        });
        chatBody.scrollTop = chatBody.scrollHeight;
        await wait(320);
      } else {
        await wait(120);
      }
      if (myRun !== runId) return;

      completedSteps = Math.min(completedSteps + 1, currentJourney().script.length);
      eventCursor = Math.min(
        eventCursor + 1,
        Math.max((currentJourney().events || []).length - 1, eventCursor + 1)
      );
      // Advance event cursor without capping below last index incorrectly
      const evLen = (currentJourney().events || []).length;
      eventCursor = Math.min(completedSteps, Math.max(evLen - 1, 0));
      renderSteps();
      renderEvents();

      nodeIndex = Number(choice.next);
      // playNode manages busy flag in finally
      busy = false;
      await playNode(nodeIndex, myRun);
    } catch (err) {
      console.error(err);
      busy = false;
      sendBtn.disabled = false;
      composerHint.textContent = "推进出错，请点击重新播放";
    }
  }

  async function sendFreeText(text) {
    const value = text.trim();
    if (!value || busy) return;
    const myRun = runId;
    composerInput.value = "";
    busy = true;
    sendBtn.disabled = true;
    clearChoices();
    appendMessage({ type: "user", text: value });
    chatBody.scrollTop = chatBody.scrollHeight;
    waStatus.textContent = "typing…";
    await wait(600);
    if (myRun !== runId) return;
    appendMessage({
      type: "bot",
      text: "Thanks - noted for your planner. Please tap a green suggested reply below to continue the guided journey.",
    });
    const node = currentJourney().script[nodeIndex];
    if (node && !node.complete && node.choices?.length) renderChoices(node.choices);
    waStatus.textContent = "online";
    busy = false;
    sendBtn.disabled = false;
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function resetJourney() {
    runId += 1;
    const myRun = runId;
    const j = currentJourney();
    nodeIndex = 0;
    completedSteps = 0;
    eventCursor = 0;
    busy = false;
    sendBtn.disabled = false;
    chatBody.innerHTML = "";
    outcomeBanner.hidden = true;
    goalText.textContent = j.goal;
    waStatus.textContent = "online";
    composerInput.value = "";
    updateClock();
    renderTabs();
    renderSteps();
    renderEvents();
    renderProfile();
    playNode(0, myRun);
  }

  document.getElementById("resetBtn").addEventListener("click", resetJourney);
  document.getElementById("hintBtn").addEventListener("click", () => {
    const first = chatBody.querySelector(".choice:not(:disabled)");
    if (first) {
      first.classList.add("pulse-hint");
      first.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(() => first.classList.remove("pulse-hint"), 1200);
    } else {
      composerInput.focus();
    }
  });

  document.getElementById("handoffBtn").addEventListener("click", async () => {
    if (busy) return;
    const myRun = runId;
    const savedChoices = currentJourney().script[nodeIndex]?.choices;
    busy = true;
    appendMessage({ type: "system", text: "Agent handoff · connected to human advisor" });
    waStatus.textContent = "typing…";
    await wait(450);
    if (myRun !== runId) return;
    const name = currentJourney().persona?.name?.split(" ")[0] || "there";
    appendMessage({
      type: "bot",
      text: `Hi ${name}, this is *Nova* from ReelNest. I've reviewed your profile and can help from here. You can keep using the green replies to continue the demo journey.`,
    });
    if (savedChoices?.length && !currentJourney().script[nodeIndex]?.complete) {
      renderChoices(savedChoices);
    }
    waStatus.textContent = "online · Nova";
    composerHint.textContent = "已转人工示意 · 仍可用绿色按钮继续完整旅程";
    busy = false;
    chatBody.scrollTop = chatBody.scrollHeight;
  });

  composerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendFreeText(composerInput.value);
  });

  setInterval(updateClock, 30000);
  resetJourney();
})();
