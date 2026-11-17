
// Memory with 16 values
let memory = [
    10, 20, 30, 45,
    50, 8, 70, 80,
    90, 100, 110, 120,
    130, 140, 150, 160
];

// CPU registers
let registers = {
    R1: 25,
    R2: 40,
    R3: 60,
    R4: 80
};

// Selected addressing mode
let selected = "";

// Get HTML elements
let modeButtons = document.querySelectorAll(".mode-btn");
let input = document.getElementById("userValue");
let calculateBtn = document.getElementById("calculateBtn");

let modeText = document.getElementById("selectedMode");
let answerText = document.getElementById("finalAnswer");
let stepsText = document.getElementById("steps");

// Select addressing mode
modeButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        selected = button.dataset.mode;

        modeButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        modeText.textContent = selected.toUpperCase();
        answerText.textContent = "Waiting for calculation";
        stepsText.textContent = "Enter a value and click Calculate Operand.";

        if (selected === "register") {
            input.placeholder = "Enter R1, R2, R3 or R4";
        } else {
            input.placeholder = "Enter a number";
        }
    });
});

// Function to calculate operand
function calculateOperand(mode, value) {

    if (mode === "immediate") {

        let number = Number(value);

        if (value.trim() === "" || !Number.isFinite(number)) {
            throw new Error("Enter a valid number.");
        }

        return {
            answer: number,
            steps: "Immediate mode: The given value is the operand."
        };
    }

    if (mode === "direct") {

        let address = Number(value);

        if (value.trim() === "" || !Number.isInteger(address) ||
            address < 0 || address >= memory.length) {
            throw new Error("Enter a memory address from 0 to 15.");
        }

        return {
            answer: memory[address],
            steps: "Direct mode: Memory[" + address +
                   "] = " + memory[address]
        };
    }

    if (mode === "indirect") {

        let address = Number(value);

        if (value.trim() === "" || !Number.isInteger(address) ||
            address < 0 || address >= memory.length) {
            throw new Error("Enter a memory address from 0 to 15.");
        }

        let nextAddress = memory[address];

        if (!Number.isInteger(nextAddress) ||
            nextAddress < 0 || nextAddress >= memory.length) {
            throw new Error("The next address is outside memory.");
        }

        return {
            answer: memory[nextAddress],
            steps: "Indirect mode: Memory[" + address + "] = " +
                   nextAddress + ", then Memory[" + nextAddress +
                   "] = " + memory[nextAddress]
        };
    }

    if (mode === "register") {

        let registerName = value.trim().toUpperCase();

        if (registers[registerName] === undefined) {
            throw new Error("Use R1, R2, R3 or R4.");
        }

        return {
            answer: registers[registerName],
            steps: registerName + " contains " +
                   registers[registerName]
        };
    }

    throw new Error("Please select an addressing mode.");
}

// Calculate button operation
calculateBtn.addEventListener("click", function() {

    try {

        let value = input.value;

        let result = calculateOperand(selected, value);

        answerText.textContent = result.answer;
        stepsText.textContent = result.steps;

        console.log(selected, "Answer:", result.answer);

    } catch (error) {

        answerText.textContent = "Error";
        stepsText.textContent = error.message;

        console.log(error.message);
    }
});
