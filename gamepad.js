let gamepadIndex = null;
let lastButtonState = {}; // To store the last state of each button (whether it was pressed or not)

function detectGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            gamepadIndex = i; // Store the index of the first connected gamepad
            break;
        }
    }
}

function handleGamepadInput() {
    const gamepad = navigator.getGamepads ? navigator.getGamepads()[gamepadIndex] : null;
    if (!gamepad) return;

    const buttons = gamepad.buttons;

    // Prevent multiple presses by checking button state changes
    buttons.forEach((button, index) => {
        // If the button is pressed and it wasn't pressed before
        if (button.pressed && !lastButtonState[index]) {
            lastButtonState[index] = true; // Mark the button as pressed

            // Call the appropriate action based on the button index
            if (index === 13) { // Right shoulder button (or equivalent)
                moveToNextRow();
            } else if (index === 12) { // Left shoulder button (or equivalent)
                moveToPreviousRow();
            } else if (index === 15) { // Right trigger or button (depends on gamepad)
                moveToNextColumn();
            } else if (index === 14) { // Left trigger or button (depends on gamepad)
                moveToPreviousColumn();
            } else if (index === 0) { // A button (or equivalent)
                incrementValue();
            } else if (index === 1) { // B button (or equivalent) - Set to "x"
                setValueTo("x");
            } else if (index === 2) { // X button (or equivalent) - Set to "z"
                setValueTo("z");
            } else if (index === 3) { // Y button (or equivalent) - Set to "0"
                setValueTo("0");
            }
        } else if (!button.pressed) {
            // When the button is released, reset its state
            lastButtonState[index] = false;
        }
    });
}

function setValueTo(value) {
    const focusedInput = document.activeElement;
    if (focusedInput && focusedInput.classList.contains("row-input")) {
        let topLabel = parseInt(focusedInput.getAttribute("data-top-label"));
        let bottomLabel = focusedInput.nextElementSibling;

        // Get the custom "+5" value from the control panel
        const customPlusFive = parseInt(document.getElementById("customPlusFiveValue").value);

        // Allow only numbers ≤ topLabel, "x", or "z"
        //if (!/^\d+$/.test(focusedInput.value) && value !== "x" && value !== "z") {
        //    focusedInput.value = "";
        //    bottomLabel.textContent = "";
        //    focusedInput.style.backgroundColor = "#f9f9f9";
        //    return;
        //}

        let numericValue = parseInt(focusedInput.value);

        if (value === "x") {
            focusedInput.value = topLabel + topLabel;
            bottomLabel.textContent = "COMPLET";
            bottomLabel.style.color = "#27ae60";
            focusedInput.style.backgroundColor = "#27ae60"; // Green
            focusedInput.style.color = "white";
        } else if (value === "z") {
            focusedInput.value = topLabel + topLabel + customPlusFive; // Use the custom value
            bottomLabel.textContent = "PARFAIT";
            bottomLabel.style.color = "#f39c12";
            focusedInput.style.backgroundColor = "#f39c12"; // Orange
            focusedInput.style.color = "white";
        } else if (value === "0") {
            focusedInput.value = 0;
            bottomLabel.textContent = "MANQUÉ";
            bottomLabel.style.color = "#e74c3c";
            focusedInput.style.backgroundColor = "#e74c3c"; // Red
            focusedInput.style.color = "white";
        }

        focusedInput.dispatchEvent(new Event("input"));
        updateTotals();
    }
}

function moveToNextRow() {
    const focusedInput = document.activeElement;
    if (focusedInput && focusedInput.classList.contains("row-input")) {
        const currentRow = focusedInput.closest(".row");
        const currentRowContainer = currentRow.closest(".row-container");
        const allRows = Array.from(document.querySelectorAll(".row-container"));
        const rowInputs = Array.from(currentRow.querySelectorAll(".row-input"));
        const currentIndex = rowInputs.indexOf(focusedInput);

        const currentRowIndex = allRows.indexOf(currentRowContainer);
        const totalRows = allRows.length;

        const nextRowContainer = allRows[(currentRowIndex + 1) % totalRows];
        const nextRowInputs = Array.from(nextRowContainer.querySelectorAll(".row-input"));
        if (nextRowInputs.length > 0) {
            nextRowInputs[currentIndex % nextRowInputs.length].focus();
        }
    }
}

function moveToPreviousRow() {
    const focusedInput = document.activeElement;
    if (focusedInput && focusedInput.classList.contains("row-input")) {
        const currentRow = focusedInput.closest(".row");
        const currentRowContainer = currentRow.closest(".row-container");
        const allRows = Array.from(document.querySelectorAll(".row-container"));
        const rowInputs = Array.from(currentRow.querySelectorAll(".row-input"));
        const currentIndex = rowInputs.indexOf(focusedInput);

        const currentRowIndex = allRows.indexOf(currentRowContainer);
        const totalRows = allRows.length;

        const prevRowContainer = allRows[(currentRowIndex - 1 + totalRows) % totalRows];
        const prevRowInputs = Array.from(prevRowContainer.querySelectorAll(".row-input"));
        if (prevRowInputs.length > 0) {
            prevRowInputs[currentIndex % prevRowInputs.length].focus();
        }
    }
}

function moveToNextColumn() {
    const focusedInput = document.activeElement;
    if (focusedInput && focusedInput.classList.contains("row-input")) {
        const currentRow = focusedInput.closest(".row");
        const rowInputs = Array.from(currentRow.querySelectorAll(".row-input"));
        const currentIndex = rowInputs.indexOf(focusedInput);

        const nextIndex = (currentIndex + 1) % rowInputs.length; // Loop to first column if at the end
        rowInputs[nextIndex].focus();
    }
}

function moveToPreviousColumn() {
    const focusedInput = document.activeElement;
    if (focusedInput && focusedInput.classList.contains("row-input")) {
        const currentRow = focusedInput.closest(".row");
        const rowInputs = Array.from(currentRow.querySelectorAll(".row-input"));
        const currentIndex = rowInputs.indexOf(focusedInput);

        const prevIndex = (currentIndex - 1 + rowInputs.length) % rowInputs.length; // Loop to last column if at the start
        rowInputs[prevIndex].focus();
    }
}

function incrementValue() {
    const focusedInput = document.activeElement;
    if (focusedInput && focusedInput.classList.contains("row-input")) {
        let currentValue = parseFloat(focusedInput.value) || 0;
        let topLabel = parseInt(focusedInput.getAttribute("data-top-label"));
        let bottomLabel = focusedInput.nextElementSibling;

        let newValue = currentValue + 1;
        if (newValue >= topLabel) {
            newValue = 1;
        }

        focusedInput.value = newValue;

        if (newValue === topLabel) {
            bottomLabel.textContent = "COMPLET";
            bottomLabel.style.color = "#27ae60";
            focusedInput.style.backgroundColor = "#27ae60";
            focusedInput.style.color = "white";
        } else if (newValue < topLabel) {
            bottomLabel.textContent = "ARRET";
            bottomLabel.style.color = "#2c3e50";
            focusedInput.style.backgroundColor = "#2c3e50";
            focusedInput.style.color = "white";
        }

        focusedInput.dispatchEvent(new Event("input"));
        updateTotals();
    }
}

function gamepadLoop() {
    detectGamepad();
    if (gamepadIndex !== null) {
        handleGamepadInput();
    }
    requestAnimationFrame(gamepadLoop); // Keep the gamepad loop running
}

// Start the gamepad input loop
gamepadLoop();
