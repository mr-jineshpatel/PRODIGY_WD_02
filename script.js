let time = 0;
let running = false;
let laps = [];
let lapStartTime = 0; // Time when the current lap started
const digitalDisplay = document.getElementById('timeDisplay');
const startStopButton = document.getElementById('startStopButton');
const lapResetButton = document.getElementById('lapResetButton');
const secondHand = document.getElementById('secondHand');
const minuteHand = document.getElementById('minuteHand');
const hourHand = document.getElementById('hourHand');
const lapsList = document.getElementById('lapsList');
const viewToggleButtonStopwatch = document.getElementById('viewToggleStopwatch');
const viewToggleButtonAnalog = document.getElementById('viewToggleAnalog');
const modeToggleButton = document.getElementById('modeToggleButton');
const digitalStopwatchSection = document.getElementById('digitalStopwatchSection');
const analogClockSection = document.getElementById('analogClockSection');

let interval;

// Format time into mm:ss:ms format
function formatTime(time) {
    const milliseconds = `0${Math.floor((time / 10) % 100)}`.slice(-2);
    const seconds = `0${Math.floor((time / 1000) % 60)}`.slice(-2);
    const minutes = `0${Math.floor(time / 60000)}`.slice(-2);
    return `${minutes}:${seconds}:${milliseconds}`;
}

// Update digital display and analog hands
function updateDisplay() {
    digitalDisplay.textContent = formatTime(time);
    const seconds = (time / 1000) % 60;
    const minutes = Math.floor((time / 60000) % 60);
    const hours = Math.floor(time / 3600000);

    // Calculate rotation degrees
    const secondDeg = (seconds / 60) * 360;
    const minuteDeg = (minutes / 60) * 360;
    const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;

    // Apply rotation
    secondHand.style.transform = `rotate(${secondDeg}deg)`;
    minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
    hourHand.style.transform = `rotate(${hourDeg}deg)`;
}

// Start or stop the stopwatch
function toggleRunning() {
    running = !running;
    if (running) {
        interval = setInterval(() => {
            time += 10;
            updateDisplay();
        }, 10);
        lapStartTime = time; // Start lap timer from current time
        startStopButton.textContent = 'Stop';
        startStopButton.classList.replace('start', 'stop');
        lapResetButton.textContent = 'Lap';
        lapResetButton.classList.replace('reset', 'lap');
    } else {
        clearInterval(interval);
        startStopButton.textContent = 'Start';
        startStopButton.classList.replace('stop', 'start');
        lapResetButton.textContent = 'Reset';
        lapResetButton.classList.replace('lap', 'reset');
    }
}

// Reset the stopwatch
function reset() {
    running = false;
    clearInterval(interval);
    time = 0;
    lapStartTime = 0; // Reset lap start time
    updateDisplay();
    laps = [];
    updateLapsDisplay();
    startStopButton.textContent = 'Start';
    startStopButton.classList.replace('stop', 'start');
    lapResetButton.textContent = 'Lap';
    lapResetButton.classList.replace('reset', 'lap');
}

// Record a lap
function recordLap() {
    if (running) {
        // Record lap time from the start of the current lap
        const lapTime = time - lapStartTime;
        laps.push(lapTime);
        lapStartTime = time; // Reset lap start time for the next lap
        updateLapsDisplay();
    }
}

// Update the laps display
function updateLapsDisplay() {
    lapsList.innerHTML = laps.slice().reverse().map((lap, index) => `<li>Lap ${laps.length - index}: ${formatTime(lap)}</li>`).join('');
}

// Toggle between digital and analog
function toggleView(view) {
    if (view === 'digital') {
        digitalStopwatchSection.classList.remove('hidden');
        analogClockSection.classList.add('hidden');
        viewToggleButtonStopwatch.classList.add('active');
        viewToggleButtonAnalog.classList.remove('active');
    } else if (view === 'analog') {
        digitalStopwatchSection.classList.add('hidden');
        analogClockSection.classList.remove('hidden');
        viewToggleButtonAnalog.classList.add('active');
        viewToggleButtonStopwatch.classList.remove('active');
    }
}

// Toggle between dark and light mode
modeToggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    modeToggleButton.textContent = document.body.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';
});

// Event listeners for view toggle buttons
viewToggleButtonStopwatch.addEventListener('click', () => toggleView('digital'));
viewToggleButtonAnalog.addEventListener('click', () => toggleView('analog'));

// Event listeners for buttons
startStopButton.addEventListener('click', toggleRunning);
lapResetButton.addEventListener('click', () => {
    if (running) {
        recordLap();
    } else {
        reset();
    }
});
