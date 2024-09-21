// Referensi Awal
let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const setAlarm = document.getElementById("setAlarm"); // Mendapatkan tombol set alarm
const activeAlarms = document.querySelector(".activeAlarms"); // Memperbaiki referensi
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");

let initialHour = 0,
    initialMinute = 0,
    alarmIndex = 0;

// Menambahkan nol di depan angka tunggal
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Menampilkan Waktu
function displayTimer() {
    let date = new Date();
    let [hours, minutes, seconds] = [
        appendZero(date.getHours()),
        appendZero(date.getMinutes()),
        appendZero(date.getSeconds()),
    ];

    // Menampilkan timer
    timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

    // Alarm
    alarmsArray.forEach((alarm) => {
        if (alarm.isActive) {
            if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
                alarmSound.play();
                alarmSound.loop = true;
            }
        }
    });
}

// Pemeriksaan input untuk angka nol di depan
const inputCheck = (inputValue) => {
    inputValue = parseInt(inputValue);
    if (inputValue < 10) {
        inputValue = appendZero(inputValue);
    }
    return inputValue;
};

hourInput.addEventListener("input", () => {
    hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
    minuteInput.value = inputCheck(minuteInput.value);
});

// Fungsi untuk menyimpan alarmsArray ke localStorage
const saveAlarms = () => {
    localStorage.setItem("alarms", JSON.stringify(alarmsArray));
};

// Membuat div alarm
const createAlarm = (alarmObj) => {
    // Kunci dari objek
    const { id, alarmHour, alarmMinute, isActive } = alarmObj;

    // Div alarm
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}</span>`;

    // Checkbox
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    if (isActive) {
        checkbox.checked = true;
    }
    checkbox.addEventListener("click", (e) => {
        if (e.target.checked) {
            startAlarm(e);
        } else {
            stopAlarm(e);
        }
    });
    alarmDiv.appendChild(checkbox);

    // Tombol hapus
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e) => deleteAlarm(e));
    alarmDiv.appendChild(deleteButton);
    activeAlarms.appendChild(alarmDiv);
};

// Menetapkan Alarm
setAlarm.addEventListener("click", () => {
    alarmIndex += 1;

    // Objek alarm
    let alarmObj = {};
    alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}`;
    alarmObj.alarmHour = hourInput.value;
    alarmObj.alarmMinute = minuteInput.value;
    alarmObj.isActive = false;

    alarmsArray.push(alarmObj);
    createAlarm(alarmObj);

    // Menyimpan alarm ke localStorage
    saveAlarms();

    // Reset input
    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
});

// Memulai alarm
const startAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = true;

        // Menyimpan alarm ke localStorage
        saveAlarms();
    }
};

// Menghentikan alarm
const stopAlarm = (e) => {
    let searchId = e.target.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        alarmsArray[index].isActive = false;
        alarmSound.pause();

        // Menyimpan alarm ke localStorage
        saveAlarms();
    }
};

// Menghapus alarm
const deleteAlarm = (e) => {
    let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
    let [exists, obj, index] = searchObject("id", searchId);
    if (exists) {
        e.target.parentElement.parentElement.remove();
        alarmsArray.splice(index, 1);

        // Menyimpan alarm ke localStorage
        saveAlarms();
    }
};

// Fungsi pembantu untuk mencari dalam array
const searchObject = (parameter, value) => {
    let alarmObject,
        objIndex,
        exists = false;
    alarmsArray.forEach((alarm, index) => {
        if (alarm[parameter] === value) {
            exists = true;
            alarmObject = alarm;
            objIndex = index;
        }
    });
    return [exists, alarmObject, objIndex];
};

window.onload = () => {
    setInterval(displayTimer, 1000); // Interval 1 detik
    initialHour = 0;
    initialMinute = 0;

    // Memuat alarm dari localStorage
    if (localStorage.getItem("alarms")) {
        alarmsArray = JSON.parse(localStorage.getItem("alarms"));
        alarmsArray.forEach((alarm) => {
            createAlarm(alarm);

            // Memastikan alarmIndex melanjutkan dari indeks terakhir
            let alarmIdParts = alarm.id.split("_");
            let currentIndex = parseInt(alarmIdParts[0]);
            if (currentIndex > alarmIndex) {
                alarmIndex = currentIndex;
            }
        });
    } else {
        alarmsArray = [];
        alarmIndex = 0;
    }

    hourInput.value = appendZero(initialHour);
    minuteInput.value = appendZero(initialMinute);
};
