// Liga os botões ao WhatsApp e monta o formulário de marcação.
(function () {
  var cfg = window.CHIC_CONFIG || {};
  var numbers = { "1": cfg.whatsapp, "2": cfg.whatsapp2 };

  function waLink(number, message) {
    var digits = String(number || "").replace(/\D/g, "");
    return "https://wa.me/" + digits + "?text=" + encodeURIComponent(message);
  }

  function setLinks(message) {
    var links = document.querySelectorAll("[data-wa]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      a.href = waLink(numbers[a.getAttribute("data-wa")], message);
    }
  }

  // Botões simples (landing page e cabeçalho do site).
  var pageMessage = document.body.getAttribute("data-wa-message") || cfg.defaultMessage || "Olá! Gostava de marcar um horário.";
  setLinks(pageMessage);

  // Formulário de marcação (só existe no site).
  var booking = document.getElementById("booking");
  if (!booking) return;

  var services = [
    "Tranças e penteados",
    "Alisamento e tratamento",
    "Corte e escova",
    "Coloração e madeixas",
    "Mega hair e aplicações",
    "Penteados para eventos"
  ];
  var times = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
  var weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  function pad(n) { return String(n).padStart(2, "0"); }

  var days = [];
  for (var i = 0; i < 6; i++) {
    var d = new Date();
    d.setDate(d.getDate() + i);
    var date = pad(d.getDate()) + "/" + pad(d.getMonth() + 1);
    var name = weekdays[d.getDay()];
    days.push({
      label: i === 0 ? "Hoje" : i === 1 ? "Amanhã" : name + " " + pad(d.getDate()),
      full: (i === 0 ? "hoje" : i === 1 ? "amanhã" : name) + " (" + date + ")"
    });
  }

  var state = { service: 0, day: 1, time: 1 };
  var summaryEl = document.getElementById("booking-summary");

  function renderPills(containerId, items, key) {
    var box = document.getElementById(containerId);
    box.textContent = "";
    items.forEach(function (item, index) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pill";
      b.textContent = typeof item === "string" ? item : item.label;
      b.setAttribute("aria-pressed", state[key] === index ? "true" : "false");
      b.addEventListener("click", function () {
        state[key] = index;
        update();
      });
      box.appendChild(b);
    });
  }

  function update() {
    renderPills("service-pills", services, "service");
    renderPills("day-pills", days, "day");
    renderPills("time-pills", times, "time");

    var service = services[state.service];
    var day = days[state.day].full;
    var time = times[state.time];

    summaryEl.textContent = service + " · " + day + " · " + time;
    setLinks("Olá! Gostava de marcar no Salão Chic Hair Camama: " + service + ", " + day + " às " + time + ". Está disponível?");
  }

  update();
})();
