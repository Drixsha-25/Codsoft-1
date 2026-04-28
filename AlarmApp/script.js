let alarmTime = "";

// Enable sound after user click
document.body.addEventListener("click", () => {
  let audio = document.getElementById("sound");
  audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
  }).catch(()=>{});
}, { once: true });

// Live clock
setInterval(() => {
  let now = new Date();

  let timeString = now.toLocaleTimeString();
  document.getElementById("time").innerText = timeString;

  let current = now.toTimeString().slice(0,5);

  if (alarmTime === current) {
    ringAlarm();
  }

}, 1000);

// Set alarm
function setAlarm() {
  let input = document.getElementById("alarmTime").value;

  if (!input) {
    alert("Select time first!");
    return;
  }

  alarmTime = input;
  document.getElementById("status").innerText = "Alarm set for " + alarmTime;
}

// Ring alarm
function ringAlarm() {
  let audio = document.getElementById("sound");
  audio.loop = true;
  audio.play();

  let stop = confirm("⏰ Alarm Ringing! Click OK to stop");

  if (stop) {
    audio.pause();
    audio.currentTime = 0;
    alarmTime = "";
    document.getElementById("status").innerText = "Alarm stopped";
  }
}