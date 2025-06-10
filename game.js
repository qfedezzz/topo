document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const gameBoard = document.getElementById('gameBoard');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const messageDisplay = document.getElementById('message');
    const popSound = document.getElementById('popSound');
    const laughSound = document.getElementById('laughSound');
    
    // Variables del juego
    let score = 0;
    let timeLeft = 30;
    let gameInterval;
    let timerInterval;
    let isGameRunning = false;
    let currentHole = null;
    
    // Mensajes personalizados
    const catchMessages = [
        "¡Lo atrapaste!",
        "¡Buen trabajo!",
        "¡Así se hace!",
        "¡Otra vez!",
        "¡Eres rápido!"
    ];
    
    // Inicializar el tablero
    function createBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'hole';
            hole.dataset.index = i;
            hole.addEventListener('click', handleHoleClick);
            gameBoard.appendChild(hole);
        }
    }
    
    // Mostrar la cara en un agujero aleatorio
    function showFace() {
        // Ocultar la cara anterior si existe
        if (currentHole) {
            const currentFace = currentHole.querySelector('.face');
            if (currentFace) currentFace.remove();
        }
        
        // Seleccionar un agujero aleatorio
        const holes = document.querySelectorAll('.hole');
        const randomIndex = Math.floor(Math.random() * holes.length);
        currentHole = holes[randomIndex];
        
        // Crear y mostrar la cara
        const face = document.createElement('div');
        face.className = 'face';
        currentHole.appendChild(face);
        
        // Configurar tiempo aleatorio para esconder la cara
        const showTime = Math.random() * 1500 + 500; // Entre 0.5 y 2 segundos
        setTimeout(() => {
            if (isGameRunning && face.parentNode) {
                face.remove();
                showFace();
            }
        }, showTime);
    }
    
    // Manejar clic en un agujero
    function handleHoleClick(e) {
        if (!isGameRunning) return;
        
        const hole = e.currentTarget;
        const face = hole.querySelector('.face');
        
        if (face) {
            // Atrapado!
            face.remove();
            score++;
            scoreDisplay.textContent = score;
            
            // Reproducir sonido
            popSound.currentTime = 0;
            popSound.play();
            
            // Mostrar mensaje aleatorio
            const randomMsg = catchMessages[Math.floor(Math.random() * catchMessages.length)];
            messageDisplay.textContent = randomMsg;
            
            // Mostrar nueva cara rápidamente
            setTimeout(showFace, 500);
        }
    }
    
    // Iniciar el juego
    function startGame() {
        if (isGameRunning) return;
        
        isGameRunning = true;
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        messageDisplay.textContent = '';
        
        // Iniciar temporizador
        timerInterval = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                endGame();
            }
        }, 1000);
        
        // Iniciar aparición de caras
        showFace();
        
        // Deshabilitar botón de inicio
        startBtn.disabled = true;
    }
    
    // Finalizar el juego
    function endGame() {
        isGameRunning = false;
        clearInterval(timerInterval);
        
        // Ocultar la cara actual
        if (currentHole) {
            const currentFace = currentHole.querySelector('.face');
            if (currentFace) currentFace.remove();
        }
        
        // Mostrar mensaje final
        messageDisplay.textContent = `¡Juego terminado! Puntuación: ${score}`;
        
        // Reproducir sonido de risa
        laughSound.play();
        
        // Habilitar botón de inicio
        startBtn.disabled = false;
    }
    
    // Reiniciar el juego
    function resetGame() {
        endGame();
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        messageDisplay.textContent = '';
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Inicializar el juego
    createBoard();
});