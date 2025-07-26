const playingSounds = {};

function toggleLoop(id, btn) {
    const audio = document.getElementById(id);
    const icon = btn.querySelector('.icon');
    if (audio.paused) {
        audio.play();
        icon.textContent = '⏸️'; // Pausa
    } else {
        audio.pause();
        icon.textContent = '▶️'; // Play
    }
}

function setVolume(id, value) {
    const audio = document.getElementById(id);
    audio.volume = value;
}

