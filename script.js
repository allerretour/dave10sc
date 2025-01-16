const maxRounds = 10;
let scores = Array(maxRounds).fill(0); // Array to track scores
let resetStates = Array(maxRounds).fill(false); // Array to track reset states
let selectedRound = -1; // To keep track of the selected round

// Dynamically generate round buttons and their sections
function createRounds() {
    const roundsContainer = document.querySelector('.round-buttons');

    for (let i = 0; i < maxRounds; i++) {
        // Create Round Button
        const roundButton = document.createElement('button');
        roundButton.classList.add('round-button', 'grey');
        roundButton.innerHTML = `<div class="round">Round ${i + 1}</div><div class="score">Score: 0</div>`;
        roundButton.onclick = () => showRoundDetails(i, roundButton);
        roundsContainer.appendChild(roundButton);

        // Create Round Details Section
        const roundDetails = document.createElement('div');
        roundDetails.classList.add('round-section');
        roundDetails.id = `round-${i + 1}-details`;

        roundDetails.innerHTML = `
            <h2>Round ${i + 1} Details</h2>
            <div class="score-controls">
                <button onclick="changeScore(${i}, -1)">-</button>
                <input id="score-input-${i}" type="number" value="0" min="0" max="${i + 1}" onchange="updateScore(${i})" />
                <button onclick="changeScore(${i}, 1)">+</button>
            </div>
            <button class="reset-button" onclick="toggleReset(${i})">Reset Score</button>
        `;
        document.body.appendChild(roundDetails);
    }
}

// Show Round Details and Highlight Selected Round
function showRoundDetails(round, roundButton) {
    const allSections = document.querySelectorAll('.round-section');
    allSections.forEach(section => section.style.display = 'none'); // Hide all details

    const roundDetails = document.getElementById(`round-${round + 1}-details`);
    roundDetails.style.display = 'block'; // Show selected round details

    // Remove highlight from the previously selected round
    if (selectedRound !== -1) {
        const previousButton = document.querySelectorAll('.round-button')[selectedRound];
        previousButton.classList.remove('highlighted');
    }

    // Highlight the current selected round button
    roundButton.classList.add('highlighted');
    selectedRound = round; // Update selected round index
}

// Change Score
function changeScore(round, delta) {
    if (resetStates[round]) return; // Cannot change score if reset is triggered

    let scoreInput = document.getElementById(`score-input-${round}`);
    let currentScore = parseInt(scoreInput.value);
    let maxScore = round + 1;

    // Update score
    let newScore = currentScore + delta;

    if (newScore >= 0 && newScore <= maxScore) {
        scoreInput.value = newScore;
        scores[round] = newScore;
    }

    updateRoundButton(round);
    updateRoundScore(round);
    updateGrandTotal();
}

// Update Round Button Color
function updateRoundButton(round) {
    const roundButton = document.querySelectorAll('.round-button')[round];
    const score = scores[round];
    const maxScore = round + 1;

    // Default to grey if score is 0 and reset is not triggered
    if (score === 0 && !resetStates[round]) {
        roundButton.classList.add('grey');
        roundButton.classList.remove('blue', 'green', 'red');
    } 
    // Blue if score is between 0 and max score
    else if (score > 0 && score < maxScore && !resetStates[round]) {
        roundButton.classList.add('blue');
        roundButton.classList.remove('green', 'grey', 'red');
    } 
    // Green if score is equal to max score
    else if (score === maxScore && !resetStates[round]) {
        roundButton.classList.add('green');
        roundButton.classList.remove('blue', 'grey', 'red');
    } 
    // Red if reset is triggered
    else if (resetStates[round]) {
        roundButton.classList.add('red');
        roundButton.classList.remove('blue', 'green', 'grey');
    }
}

// Update Round Score Display
function updateRoundScore(round) {
    const roundScoreDisplay = document.querySelectorAll('.round-button .score')[round];
    roundScoreDisplay.textContent = `Score: ${scores[round]}`;
}

// Toggle Reset State
function toggleReset(round) {
    resetStates[round] = !resetStates[round];
    updateRoundButton(round);
    updateRoundScore(round);
    updateGrandTotal();
}

// Update Grand Total
function updateGrandTotal() {
    const total = scores.reduce((sum, score) => sum + score, 0);
    document.getElementById('grand-total').textContent = total;
}

// Update the Score based on the input field
function updateScore(round) {
    let scoreInput = document.getElementById(`score-input-${round}`);
    let currentScore = parseInt(scoreInput.value);
    let maxScore = round + 1;

    if (currentScore < 0) {
        scoreInput.value = 0;
    } else if (currentScore > maxScore) {
        scoreInput.value = maxScore;
    }

    scores[round] = parseInt(scoreInput.value);
    updateRoundButton(round);
    updateRoundScore(round);
    updateGrandTotal();
}

// Initial Setup
createRounds();
updateGrandTotal();
