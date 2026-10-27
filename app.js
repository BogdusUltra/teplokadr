// Автоматически убираем .html из адресной строки браузера
if (window.location.protocol.startsWith("http") && window.location.pathname.endsWith(".html")) {
  const cleanPath = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  window.history.replaceState(null, "", cleanPath + window.location.search + window.location.hash);
}

/**
 * Интерактивная логика сайта «Тёплый Кадр»:
 * 1. Модальное окно заказа с формированием готовой заявки в WhatsApp / Telegram
 * 2. Калькуляторы стоимости на страницах услуг
 * 3. Переключатели 7 стилей портретов и 6 шаблонов оформления фильма
 * 4. Ползунок «До / После» и FAQ-аккордеоны
 */

const STUDIO_CONTACTS = {
  whatsappPhone: "79147173132", // Реальный номер WhatsApp и MAX: +7 914 717-31-32
  maxPhoneDisplay: "+7 (914) 717-31-32",
  maxUrl: "https://max.ru", // Мессенджер MAX
  telegramUser: "teplo_kadr", // Реальный Telegram: @teplo_kadr
};

function openOrderModal(serviceName = "Консультация по подарку", tariffName = "Подбор тарифа", price = "") {
  const modal = document.getElementById("orderModal");
  if (!modal) return;
  const serviceInput = document.getElementById("modalService");
  const tariffInput = document.getElementById("modalTariff");
  const titleEl = document.getElementById("modalTitle");
  const subEl = document.getElementById("modalSub");

  if (serviceInput) serviceInput.value = serviceName;
  if (tariffInput) tariffInput.value = price ? `${tariffName} (${price})` : tariffName;
  if (titleEl) titleEl.textContent = serviceName;
  if (subEl) subEl.textContent = price ? `Выбранный вариант: ${tariffName} — ${price}` : `Тариф: ${tariffName}`;

  modal.classList.add("active");
}

function closeOrderModal() {
  const modal = document.getElementById("orderModal");
  if (modal) modal.classList.remove("active");
}

function buildLeadMessage() {
  const service = document.getElementById("modalService")?.value || "Подарок";
  const tariff = document.getElementById("modalTariff")?.value || "";
  const name = document.getElementById("modalClientName")?.value.trim() || "Клиент с сайта";
  const occasion = document.getElementById("modalOccasion")?.value || "Праздник";
  const comment = document.getElementById("modalComment")?.value.trim() || "";

  let lines = [
    `Здравствуйте, студия «Тёплый Кадр»! 👋`,
    `Хочу заказать: *${service}*`,
  ];
  if (tariff) lines.push(`Выбранный пакет: *${tariff}*`);
  lines.push(`Повод: ${occasion}`);
  lines.push(`Меня зовут: ${name}`);
  if (comment) lines.push(`Пожелания: ${comment}`);
  lines.push(`Готов(а) прислать фото для бесплатной пробы!`);
  return lines.join("\n");
}

function sendLeadToWhatsApp() {
  const msg = encodeURIComponent(buildLeadMessage());
  window.open(`https://wa.me/${STUDIO_CONTACTS.whatsappPhone}?text=${msg}`, "_blank");
}

function sendLeadToMax() {
  const rawMsg = buildLeadMessage();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(rawMsg).catch(() => {});
  }
  alert(
    `Текст вашей заявки скопирован! 📋\n\nНаш номер в мессенджере MAX:\n${STUDIO_CONTACTS.maxPhoneDisplay}\n\nСейчас откроется MAX — просто вставьте скопированный текст в диалог по номеру +7 914 717-31-32.`
  );
  window.open(STUDIO_CONTACTS.maxUrl, "_blank");
}

function sendLeadToTelegram() {
  const msg = encodeURIComponent(buildLeadMessage());
  window.open(`https://t.me/${STUDIO_CONTACTS.telegramUser}?text=${msg}`, "_blank");
}

// Инициализация интерактивных элементов после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  // Закрытие модалки по клику на фон
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeOrderModal();
    });
  }

  // Аккордеоны FAQ
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (item) item.classList.toggle("open");
    });
  });

  // Ползунки «До / После»
  document.querySelectorAll(".ba-container").forEach((container) => {
    const input = container.querySelector(".ba-slider-input");
    const overlay = container.querySelector(".ba-overlay");
    const beforeImg = overlay?.querySelector("img");

    const syncWidth = () => {
      if (beforeImg) {
        beforeImg.style.width = `${container.offsetWidth}px`;
      }
    };
    window.addEventListener("resize", syncWidth);
    syncWidth();

    if (input && overlay) {
      input.addEventListener("input", (e) => {
        overlay.style.width = `${e.target.value}%`;
        syncWidth();
      });
    }
  });
});

// Переключатель 6 шаблонов оформления на странице Мультфильма
function switchTemplatePreview(tplIdx, btnEl) {
  const templates = [
    {
      img: "media/style_templates/tpl_05_glass_timeline.png",
      title: "Шаблон №5: Apple Frosted Glass + Таймлайн Жизни (Хит выбора!)",
      desc: "Полупрозрачное матовое стекло в стиле iOS и нижняя шкала эпох жизни именинника (1996 Детство → 2005 Школа → 2014 Универ → 2022 Любовь → 2026 Юбилей). Не перекрывает кадр и смотрится как дорогой фильм на Apple TV.",
    },
    {
      img: "media/style_templates/tpl_01_storybook.png",
      title: "Шаблон №1: Тёплая Золотая Сказка Disney",
      desc: "Классическое сказочное оформление с тёплым золотым свечением и мягкой виньеткой — идеально для детских праздников и душевных семейных историй.",
    },
    {
      img: "media/style_templates/tpl_02_cinema.png",
      title: "Шаблон №2: Голливудская Киноплёнка (Widescreen 21:9)",
      desc: "Кинематографичные каше-полосы сверху и снизу с элегантной золотой подписью главы — превращает мультфильм в настоящий голливудский трейлер.",
    },
    {
      img: "media/style_templates/tpl_03_album.png",
      title: "Шаблон №3: Семейный Фотоальбом (Polaroid Frame)",
      desc: "Уютная светлая рамка семейного альбома с архивным штампом года — вызывает тёплую ностальгию у родителей, бабушек и дедушек.",
    },
    {
      img: "media/style_templates/tpl_04_pop_comedy.png",
      title: "Шаблон №4: Яркий Комедийный Ситком",
      desc: "Сочные контрастные плашки для весёлых юбилеев, корпоративов и дружеских компаний с искромётным юмором.",
    },
    {
      img: "media/style_templates/tpl_06_luxury_gold.png",
      title: "Шаблон №6: Премиум Юбилей (Тёмный Бархат и Золото)",
      desc: "Торжественная тонкая золотая рамка для показа на большом экране в ресторане или банкетном зале на 50, 60 и 70 лет.",
    },
  ];

  const data = templates[tplIdx];
  if (!data) return;

  const imgEl = document.getElementById("tplPreviewImg");
  const titleEl = document.getElementById("tplPreviewTitle");
  const descEl = document.getElementById("tplPreviewDesc");
  if (imgEl) imgEl.src = data.img;
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;

  document.querySelectorAll(".tpl-tab-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
}

// Переключатель 7 стилей портретов на странице Фотосессии
function switchStyleGallery(styleIdx, btnEl) {
  const styles = [
    {
      img: "media/family_styles/style_06.png",
      title: "1. 3D Мультфильм Disney / Pixar (Хит заказов!)",
      desc: "Объёмный кино-стиль: 100% узнаваемость лиц, добрый взгляд, фирменная улыбка, причёски, любимый свитер и даже ваш домашний питомец.",
    },
    {
      img: "media/family_styles/style_05.png",
      title: "2. Аниме Хаяо Миядзаки (Studio Ghibli)",
      desc: "Нежная акварельная рисовка и солнечный уют — идеальный вариант для истории любви, годовщины свадьбы и печати на холсте.",
    },
    {
      img: "media/family_styles/style_04.png",
      title: "3. Ностальгия 90-х (Кассета VHS и тот самый ковёр)",
      desc: "Перенесём вашу семью в ламповую атмосферу 90-х с настенным ковром, свитерами Boys и датой съёмки на плёнке!",
    },
    {
      img: "media/family_styles/style_03.png",
      title: "4. Королевская Династия и Рыцарский Замок",
      desc: "Глава семьи в сияющих доспехах, супруга в королевском бархате, и даже кот в рыцарском мини-шлеме — роскошный подарок на юбилей.",
    },
    {
      img: "media/family_styles/style_02.png",
      title: "5. Каменный Век (Добрый семейный юмор)",
      desc: "Пещерный уют, меха и саблезубый домашний котик — вызывает бурю восторга и смеха у гостей на празднике.",
    },
    {
      img: "media/family_styles/style_01.png",
      title: "6. Пиксель-Арт 16-Bit (Ретро-приставка Sega / Dendy)",
      desc: "Ностальгический стиль классических видеоигр 90-х — крутой подарок для мужа, брата, друга или IT-специалиста.",
    },
    {
      img: "media/family_styles/style_07.png",
      title: "7. Исходное домашнее фото семьи",
      desc: "Вот с такого обычного снимка на диване мы начали работу — без студийного света и позирования.",
    },
  ];

  const data = styles[styleIdx];
  if (!data) return;

  const imgEl = document.getElementById("stylePreviewImg");
  const titleEl = document.getElementById("stylePreviewTitle");
  const descEl = document.getElementById("stylePreviewDesc");
  if (imgEl) imgEl.src = data.img;
  if (titleEl) titleEl.textContent = data.title;
  if (descEl) descEl.textContent = data.desc;

  document.querySelectorAll(".style-tab-btn").forEach((b) => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
}

// Калькулятор оживления фото на странице photo-alive.html
function updatePhotoAliveCalc() {
  const countEl = document.getElementById("photoCountRange");
  const countLabel = document.getElementById("photoCountLabel");
  const voiceCheck = document.getElementById("photoVoiceCheck");
  const restoreCheck = document.getElementById("photoRestoreCheck");
  const totalEl = document.getElementById("photoCalcTotal");
  const btnEl = document.getElementById("photoCalcOrderBtn");

  if (!countEl || !totalEl) return;
  const count = parseInt(countEl.value, 10);
  if (countLabel) countLabel.textContent = `${count} фото`;

  // Базовая цена за кадр снижается при объёме
  let perPhoto = 500;
  if (count >= 10) perPhoto = 450;
  if (count >= 20) perPhoto = 400;

  let total = count * perPhoto;
  if (voiceCheck?.checked) total += 2500;
  if (restoreCheck?.checked) total += count * 150;

  const formatted = total.toLocaleString("ru-RU") + " ₽";
  totalEl.textContent = formatted;
  if (btnEl) {
    btnEl.onclick = () =>
      openOrderModal(
        "Оживление архивных фотографий",
        `${count} оживших фото${voiceCheck?.checked ? " + диктор" : ""}`,
        formatted
      );
  }
}
