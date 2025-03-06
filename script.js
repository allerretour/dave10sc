function createRow(startNumber, count, rowName, rowColor) {
    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row-container");

    const rowNameInput = document.createElement("input");
    rowNameInput.classList.add("row-name");
    rowNameInput.value = rowName; // Set initial row name
    rowNameInput.style.color = rowColor;
    rowNameInput.style.border = "none";
    rowNameInput.style.background = "transparent";
    rowNameInput.style.outline = "none";
    rowNameInput.style.width = "100%";

    rowContainer.appendChild(rowNameInput);

    const row = document.createElement("div");
    row.classList.add("row");

    const container = document.createElement("div");
    container.classList.add("container");

    for (let i = 0; i < count; i++) {
        const field = document.createElement("div");
        field.classList.add("field");

        const topLabel = document.createElement("label");
        topLabel.classList.add("top-label");
        topLabel.textContent = startNumber + i;
        topLabel.style.backgroundColor = rowColor; // Set background color to match total
        topLabel.style.color = "white"; // Ensure the text is readable on the background

        const input = document.createElement("input");
        input.type = "text";
        input.classList.add("row-input");
        input.setAttribute("data-top-label", startNumber + i);
        input.placeholder = "";

        const bottomLabel = document.createElement("label");
        bottomLabel.classList.add("bottom-label");
        bottomLabel.textContent = "";

        field.appendChild(topLabel);
        field.appendChild(input);
        field.appendChild(bottomLabel);
        container.appendChild(field);
    }

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("total");
    totalDiv.textContent = "0";
    totalDiv.style.backgroundColor = rowColor; // Set background color for total

    row.appendChild(container);
    row.appendChild(totalDiv);
    rowContainer.appendChild(row);

    document.getElementById("rows-container").appendChild(rowContainer);
    
}



function generateTable() {
    const rowsContainer = document.getElementById("rows-container");
    rowsContainer.innerHTML = ""; // Clear previous rows

    const numRows = parseInt(document.getElementById("numRows").value);
    const numInputs = parseInt(document.getElementById("numInputs").value);
    const colors = ["#3498db", "#e74c3c", "#2ecc71", "#f39c12", "#9b59b6"]; // Different row colors

    // Generate the rows
    for (let i = 1; i <= numRows; i++) {
        createRow(1, numInputs, `Joueur ${i}`, colors[i % colors.length]);
    }
    toggleControls();
    focusFirstCell(); // Set focus on the first input
}



        function updateTotals() {
            document.querySelectorAll(".row").forEach(row => {
                let sum = 0;
                row.querySelectorAll(".row-input").forEach(input => {
                    let value = parseFloat(input.value) || 0;
                    sum += value;
                });
                row.querySelector(".total").textContent = sum;
            });
        }


        function toggleControls() {
    const controls = document.getElementById("controlsContainer");
    controls.classList.toggle("hidden");
    focusFirstCell();
}




document.addEventListener("input", function(event) {
    if (event.target.classList.contains("row-input")) {
        let input = event.target;
        let topLabel = parseInt(input.getAttribute("data-top-label"));
        let bottomLabel = input.nextElementSibling;
        let value = input.value.trim();

        // Get the custom "+5" value from the control panel
        const customPlusFive = parseInt(document.getElementById("customPlusFiveValue").value);

        // Allow only numbers ≤ topLabel, "x", or "z"
        if (!/^\d+$/.test(value) && value !== "x" && value !== "z") {
            input.value = "";
            bottomLabel.textContent = "";
            input.style.backgroundColor = "#f9f9f9";
            return;
        }

        let numericValue = parseInt(value);

        if (value === "x") {
            input.value = topLabel + topLabel;
            bottomLabel.textContent = "COMPLET";
            bottomLabel.style.color = "#27ae60";
            input.style.backgroundColor = "#27ae60"; // Green
            input.style.color = "white";
        } else if (value === "z") {
            input.value = topLabel + topLabel + customPlusFive; // Use the custom value
            bottomLabel.textContent = "PARFAIT";
            bottomLabel.style.color = "#f39c12";
            input.style.backgroundColor = "#f39c12"; // Orange
            input.style.color = "white";
        } else if (numericValue === 0) {
            bottomLabel.textContent = "MANQUÉ";
            bottomLabel.style.color = "#e74c3c";
            input.style.backgroundColor = "#e74c3c"; // Red
            input.style.color = "white";
        } else if (numericValue < topLabel) {
            bottomLabel.textContent = "ARRET";
            bottomLabel.style.color = "#2c3e50";
            input.style.backgroundColor = "#2c3e50"; // Dark Blue
            input.style.color = "white";
        } else {
            input.value = "";
            bottomLabel.textContent = "";
            input.style.backgroundColor = "#f9f9f9";
        }

        updateTotals();
    }
});


        document.addEventListener("keydown", function (event) {
            const focusedInput = document.activeElement;
        
            if (focusedInput && focusedInput.classList.contains("row-input")) {
                const currentRow = focusedInput.closest(".row");
        const currentRowContainer = currentRow.closest(".row-container");
        const allRows = Array.from(document.querySelectorAll(".row-container"));
        const rowInputs = Array.from(currentRow.querySelectorAll(".row-input"));
        const currentIndex = rowInputs.indexOf(focusedInput);

        const currentRowIndex = allRows.indexOf(currentRowContainer);
        const totalRows = allRows.length;
        
                // Move to the same column in the next row (w key)
        // Move to the same column in the next row (w key) with looping
        if (event.key === "w") {
            event.preventDefault();
            const nextRowContainer = allRows[(currentRowIndex + 1) % totalRows]; // Loop to first row if at the end
            const nextRowInputs = Array.from(nextRowContainer.querySelectorAll(".row-input"));
            if (nextRowInputs.length > 0) {
                nextRowInputs[currentIndex % nextRowInputs.length].focus();
            }
        }

        // Move to the same column in the previous row (q key) with looping
        if (event.key === "q") {
            event.preventDefault();
            const prevRowContainer = allRows[(currentRowIndex - 1 + totalRows) % totalRows]; // Loop to last row if at the top
            const prevRowInputs = Array.from(prevRowContainer.querySelectorAll(".row-input"));
            if (prevRowInputs.length > 0) {
                prevRowInputs[currentIndex % prevRowInputs.length].focus();
            }
        }
        
                // Move to the next column in the same row (s key) with looping
        if (event.key === "s") {
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % rowInputs.length; // Loop to first column if at the end
            rowInputs[nextIndex].focus();
        }

        // Move to the previous column in the same row (a key) with looping
        if (event.key === "a") {
            event.preventDefault();
            const prevIndex = (currentIndex - 1 + rowInputs.length) % rowInputs.length; // Loop to last column if at the start
            rowInputs[prevIndex].focus();
        }
            }
        
            // Increment value when pressing "b"
            if (event.key === "b") {
                event.preventDefault();
        
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
        });
        function focusFirstCell() {
            setTimeout(() => {
                const firstRow = document.querySelector(".row-container");
                if (firstRow) {
                    const firstInput = firstRow.querySelector(".row-input");
                    if (firstInput) {
                        firstInput.focus();
                    }
                }
            }, 100); // Add a small delay to ensure DOM is fully rendered
        }
        
