// Variables globales
let soundsData = [];
const audioElements = {};
const playingSounds = {};

// Función para cargar los datos del JSON
async function loadSoundsData() {
    try {
        const response = await fetch('data/info.json');
        soundsData = await response.json();
        generateUI();
    } catch (error) {
        console.error('Error cargando los datos:', error);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
    }
}

// Función para generar la interfaz desde los datos
function generateUI() {
    const container = document.getElementById('categories-container');
    container.innerHTML = ''; // Limpiar contenedor
    
    soundsData.forEach(category => {
        // Crear contenedor de categoría
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.dataset.categoryId = category.id;
        
        // Crear encabezado de categoría
        const header = document.createElement('div');
        header.className = 'category-header';
        
        // Determinar icono de categoría
        const categoryIconHTML = getIconHTML({
            iconSource: category.iconSource,
            icon: category.icon
        });
        
        header.innerHTML = `
            <h3 class="category-title">
                ${categoryIconHTML}
                ${category.name}
            </h3>
            <i class="fas fa-chevron-down toggle-icon"></i>
        `;
        
        // Crear contenedor de sonidos
        const soundsContainer = document.createElement('div');
        soundsContainer.className = 'sounds-container';
        
        // Añadir sonidos a la categoría
        category.sounds.forEach(sound => {
            const soundElement = document.createElement('div');
            soundElement.className = 'sound-card';
            
            // Obtener HTML del icono del sonido
            const soundIconHTML = getIconHTML({
                iconSource: sound.iconSource,
                icon: sound.icon
            });
            
            soundElement.innerHTML = `
                ${soundIconHTML}
                <h4 class="sound-title">${sound.name}</h4>
                <div class="sound-controls">
                    <button class="play-btn" data-sound-id="${sound.id}">
                        <i class="fas fa-play"></i>
                    </button>
                    <div class="volume-control">
                        <i class="fas fa-volume-down"></i>
                        <input type="range" min="0" max="1" step="0.01" 
                               class="volume-slider" 
                               data-sound-id="${sound.id}" value="0.5">
                        <i class="fas fa-volume-up"></i>
                    </div>
                </div>
            `;
            soundsContainer.appendChild(soundElement);
            
            // Crear elemento de audio
            const audio = new Audio(sound.file);
            audio.volume = 0.5;
            audio.loop = true;
            audioElements[sound.id] = audio;
            playingSounds[sound.id] = false;
        });
        
        // Añadir elementos al DOM
        categoryElement.appendChild(header);
        categoryElement.appendChild(soundsContainer);
        container.appendChild(categoryElement);
        
        // Evento para expandir/colapsar categoría
        header.addEventListener('click', () => {
            categoryElement.classList.toggle('active');
        });
    });
}

// Función para reproducir/pausar un sonido
function toggleSound(soundId, button) {
	const audio = audioElements[soundId];
	const icon = button.querySelector('i');
	
	if (playingSounds[soundId]) {
		audio.pause();
		button.classList.remove('playing');
		icon.classList.remove('fa-pause');
		icon.classList.add('fa-play');
	} else {
		audio.play();
		button.classList.add('playing');
		icon.classList.remove('fa-play');
		icon.classList.add('fa-pause');
	}
	
	playingSounds[soundId] = !playingSounds[soundId];
}

// Función para ajustar el volumen
function setVolume(soundId, volume) {
	audioElements[soundId].volume = volume;
}

// Función para detener todos los sonidos
function stopAllSounds() {
	Object.keys(audioElements).forEach(soundId => {
		const audio = audioElements[soundId];
		audio.pause();
		audio.currentTime = 0;
		playingSounds[soundId] = false;
	});
	
	// Actualizar botones
	document.querySelectorAll('.play-btn').forEach(btn => {
		btn.classList.remove('playing');
		const icon = btn.querySelector('i');
		icon.classList.remove('fa-pause');
		icon.classList.add('fa-play');
	});
}

// Función para generar el HTML del icono según la fuente
function getIconHTML(iconData) {
    if (iconData.iconSource === "fontawesome") {
        return `<i class="${iconData.icon} sound-icon"></i>`;
    } else if (iconData.iconSource === "material") {
        return `<i class="material-icons sound-icon">${iconData.icon}</i>`;
    } else {
        // Icono por defecto si no se reconoce la fuente
        return `<i class="fas fa-music sound-icon"></i>`;
    }
}

// Función para pausar todos los sonidos
function pauseAllSounds() {
	Object.keys(audioElements).forEach(soundId => {
		if (playingSounds[soundId]) {
			audioElements[soundId].pause();
			playingSounds[soundId] = false;
		}
	});
	
	// Actualizar botones
	document.querySelectorAll('.play-btn').forEach(btn => {
		btn.classList.remove('playing');
		const icon = btn.querySelector('i');
		icon.classList.remove('fa-pause');
		icon.classList.add('fa-play');
	});
}

// Eventos después de cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
	// Cargar los datos y generar la interfaz
    loadSoundsData();
	
	// Evento para los botones de reproducción
    document.addEventListener('click', (e) => {
        if (e.target.closest('.play-btn')) {
            const btn = e.target.closest('.play-btn');
            const soundId = btn.dataset.soundId;
            toggleSound(soundId, btn);
        }
    });
	
	// Evento para los controles de volumen
	document.addEventListener('input', (e) => {
		if (e.target.classList.contains('volume-slider')) {
			const soundId = e.target.dataset.soundId;
			const volume = parseFloat(e.target.value);
			setVolume(soundId, volume);
		}
	});
	
	// Eventos para los controles globales
	document.getElementById('stop-all-btn').addEventListener('click', stopAllSounds);
	document.getElementById('pause-all-btn').addEventListener('click', pauseAllSounds);
	
	// Abrir la primera categoría por defecto
	document.querySelector('.category').classList.add('active');
});