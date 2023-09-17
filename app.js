const movableBox = document.getElementById("movable-box");
const distanceDisplay = document.getElementById("distance-display");
const signalStrengthDisplay = document.getElementById("signal-strength-display");
const calculateButton = document.getElementById("calculate-button");
const takeReadingButton = document.getElementById("take-reading-button");
const readingsTableBody = document.querySelector("#readings-table tbody");
let isDragging = false;
let initialX = 0;
let readingSerial = 1;

// The scale factor to convert pixels to meters (adjust as needed)
const pixelToMeterScale = 0.02; // 1 pixel = 0.02 meters (adjust this value based on your desired scale)

movableBox.addEventListener("mousedown", (e) => {
    isDragging = true;
    initialX = e.clientX - movableBox.getBoundingClientRect().left;
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const containerRect = document.querySelector(".container").getBoundingClientRect();
        const maxX = containerRect.width - movableBox.offsetWidth;
        let newX = e.clientX - containerRect.left - initialX;
        newX = Math.min(Math.max(newX, 0), maxX); // Restrict movement within the container
        movableBox.style.left = `${newX}px`;

        // Calculate the distance between the transmitter and receiver in meters
        const distanceInMeters = (newX - 50) * pixelToMeterScale; // Initial position of the transmitter box

        // Display the distance in meters
        distanceDisplay.textContent = `Distance: ${distanceInMeters.toFixed(2)} meters`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// Function to calculate signal strength using the Friis Transmission Equation
function calculateSignalStrength(distance, transmitterPower, pathLossExponent, speedOfLight, carrierFrequency, receiverHeight, transmitterHeight) {
    // Calculate received signal strength (Friis Transmission Equation)
    const wavelength = speedOfLight / carrierFrequency;
    const freeSpacePathloss = (4 * Math.PI * distance) / wavelength;
    const receivedSignalStrength = transmitterPower - 20 * Math.log10(freeSpacePathloss) - 20 * Math.log10(wavelength / (4 * Math.PI));

    return receivedSignalStrength;
}

// Event listener for the "Calculate" button
calculateButton.addEventListener("click", () => {
    // Get user-defined parameter values
    const transmitterPower = parseFloat(document.getElementById("transmitter-power").value);
    const pathLossExponent = parseFloat(document.getElementById("pathloss-exponent").value);
    const carrierFrequency = parseFloat(document.getElementById("carrier-frequency").value);
    const receiverHeight = parseFloat(document.getElementById("receiver-height").value);
    const transmitterHeight = parseFloat(document.getElementById("transmitter-height").value);

    // Calculate the current distance
    const receiverX = parseFloat(movableBox.style.left.replace("px", ""));
    const distanceInMeters = (receiverX - 50) * pixelToMeterScale; // Initial position of the transmitter box

    // Calculate signal strength using user-defined parameters
    const speedOfLight = 3e8; // Speed of light (m/s)
    const signal = calculateSignalStrength(
        distanceInMeters,
        transmitterPower,
        pathLossExponent,
        speedOfLight,
        carrierFrequency,
        receiverHeight,
        transmitterHeight
    );

    // Display the calculated signal strength
    signalStrengthDisplay.textContent = `Signal Strength: ${signal.toFixed(2)} dBm`;
});

// Event listener for the "Take Reading" button
takeReadingButton.addEventListener("click", () => {
    // Get user-defined parameter values
    const transmitterPower = parseFloat(document.getElementById("transmitter-power").value);
    const pathLossExponent = parseFloat(document.getElementById("pathloss-exponent").value);
    const carrierFrequency = parseFloat(document.getElementById("carrier-frequency").value);
    const receiverHeight = parseFloat(document.getElementById("receiver-height").value);
    const transmitterHeight = parseFloat(document.getElementById("transmitter-height").value);

    // Calculate the current distance
    const receiverX = parseFloat(movableBox.style.left.replace("px", ""));
    const distanceInMeters = (receiverX - 50) * pixelToMeterScale; // Initial position of the transmitter box

    // Calculate signal strength using user-defined parameters
    const speedOfLight = 3e8; // Speed of light (m/s)
    const signal = calculateSignalStrength(
        distanceInMeters,
        transmitterPower,
        pathLossExponent,
        speedOfLight,
        carrierFrequency,
        receiverHeight,
        transmitterHeight
    );

    // Add the captured values and signal strength to the readings table
    const newRow = readingsTableBody.insertRow();
    const serialCell = newRow.insertCell(0);
    const transmitterPowerCell = newRow.insertCell(1);
    const pathLossExponentCell = newRow.insertCell(2);
    const carrierFrequencyCell = newRow.insertCell(3);
    const receiverHeightCell = newRow.insertCell(4);
    const transmitterHeightCell = newRow.insertCell(5);
    const distanceCell = newRow.insertCell(6);
    const signalStrengthCell = newRow.insertCell(7);

    serialCell.textContent = readingSerial;
    transmitterPowerCell.textContent = transmitterPower;
    pathLossExponentCell.textContent = pathLossExponent;
    carrierFrequencyCell.textContent = carrierFrequency;
    receiverHeightCell.textContent = receiverHeight;
    transmitterHeightCell.textContent = transmitterHeight;
    distanceCell.textContent = distanceInMeters.toFixed(2);
    signalStrengthCell.textContent = signal.toFixed(2);

    // Increment the reading serial number
    readingSerial++;
});