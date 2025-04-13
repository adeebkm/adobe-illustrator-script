// GenerateGridFractions.jsx
// Script to generate gridded square images in Adobe Illustrator
// based on fraction data from a CSV file

// Configuration
var SQUARE_SIZE = 200; // Size in pixels
var MARGIN = 50; // Margin between artboards
var FILL_COLOR = [230/255, 230/255, 230/255]; // Light gray
var STROKE_COLOR = [0, 0, 0]; // Black
var LABEL_FONT_SIZE = 14;
var ARTBOARD_SIZE = SQUARE_SIZE + 100; // Extra space for labels

// CSV Parser Function
function parseCSV(csvString) {
    var lines = csvString.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    
    for (var i = 1; i < lines.length; i++) {
        var currentLine = lines[i].split(",");
        if (currentLine.length === headers.length) {
            var obj = {};
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentLine[j];
            }
            result.push(obj);
        }
    }
    
    return result;
}

// Function to create a gridded square
function createGriddedSquare(doc, label, fraction, direction, artboardIndex) {
    // Parse fraction
    var fractionParts = fraction.split("/");
    var numerator = parseInt(fractionParts[0]);
    var denominator = parseInt(fractionParts[1]);
    
    // Create a new artboard
    var artboardX = artboardIndex * (ARTBOARD_SIZE + MARGIN);
    var artboard = doc.artboards.add([artboardX, 0, artboardX + ARTBOARD_SIZE, ARTBOARD_SIZE]);
    artboard.name = label;
    
    // Create the main square
    var squareX = artboardX + (ARTBOARD_SIZE - SQUARE_SIZE) / 2;
    var squareY = (ARTBOARD_SIZE - SQUARE_SIZE) / 2;
    var square = doc.pathItems.rectangle(squareY, squareX, SQUARE_SIZE, SQUARE_SIZE);
    square.filled = false;
    square.stroked = true;
    square.strokeColor = new RGBColor();
    square.strokeColor.red = STROKE_COLOR[0] * 255;
    square.strokeColor.green = STROKE_COLOR[1] * 255;
    square.strokeColor.blue = STROKE_COLOR[2] * 255;
    square.strokeWidth = 1;
    
    // Create grid divisions
    var cells = [];
    var cellSize;
    
    if (direction.toLowerCase() === "horizontal") {
        cellSize = SQUARE_SIZE / denominator;
        for (var i = 0; i < denominator; i++) {
            var cell = doc.pathItems.rectangle(
                squareY + (i * cellSize),
                squareX,
                cellSize,
                SQUARE_SIZE
            );
            cells.push(cell);
            
            // Add dividing lines
            if (i > 0) {
                var divLine = doc.pathItems.add();
                divLine.setEntirePath([
                    [squareX, squareY + (i * cellSize)],
                    [squareX + SQUARE_SIZE, squareY + (i * cellSize)]
                ]);
                divLine.stroked = true;
                divLine.strokeColor = new RGBColor();
                divLine.strokeColor.red = STROKE_COLOR[0] * 255;
                divLine.strokeColor.green = STROKE_COLOR[1] * 255;
                divLine.strokeColor.blue = STROKE_COLOR[2] * 255;
                divLine.strokeWidth = 1;
                divLine.filled = false;
            }
        }
    } else { // vertical
        cellSize = SQUARE_SIZE / denominator;
        for (var i = 0; i < denominator; i++) {
            var cell = doc.pathItems.rectangle(
                squareY,
                squareX + (i * cellSize),
                SQUARE_SIZE,
                cellSize
            );
            cells.push(cell);
            
            // Add dividing lines
            if (i > 0) {
                var divLine = doc.pathItems.add();
                divLine.setEntirePath([
                    [squareX + (i * cellSize), squareY],
                    [squareX + (i * cellSize), squareY + SQUARE_SIZE]
                ]);
                divLine.stroked = true;
                divLine.strokeColor = new RGBColor();
                divLine.strokeColor.red = STROKE_COLOR[0] * 255;
                divLine.strokeColor.green = STROKE_COLOR[1] * 255;
                divLine.strokeColor.blue = STROKE_COLOR[2] * 255;
                divLine.strokeWidth = 1;
                divLine.filled = false;
            }
        }
    }
    
    // Fill the first 'numerator' cells
    for (var i = 0; i < numerator; i++) {
        cells[i].filled = true;
        cells[i].fillColor = new RGBColor();
        cells[i].fillColor.red = FILL_COLOR[0] * 255;
        cells[i].fillColor.green = FILL_COLOR[1] * 255;
        cells[i].fillColor.blue = FILL_COLOR[2] * 255;
    }
    
    // Add label
    var labelText = doc.textFrames.add();
    labelText.position = [
        artboardX + (ARTBOARD_SIZE - SQUARE_SIZE) / 2,
        squareY + SQUARE_SIZE + 30
    ];
    labelText.contents = label + " (" + fraction + ")";
    labelText.textRange.characterAttributes.size = LABEL_FONT_SIZE;
}

// Main function
function main() {
    // Ask user to select the CSV file
    var csvFile = File.openDialog("Select CSV file", "*.csv");
    if (!csvFile) {
        alert("No file selected. Exiting script.");
        return;
    }
    
    csvFile.open('r');
    var csvContent = csvFile.read();
    csvFile.close();
    
    // Parse CSV data
    var data = parseCSV(csvContent);
    
    if (data.length === 0) {
        alert("No valid data found in the CSV file.");
        return;
    }
    
    // Create a new document
    var doc = app.documents.add(
        DocumentColorSpace.RGB,
        ARTBOARD_SIZE,
        ARTBOARD_SIZE,
        data.length
    );
    
    // Process each row and create gridded squares
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        createGriddedSquare(
            doc,
            row.Label,
            row.Fraction,
            row.Direction,
            i
        );
    }
    
    alert("Generated " + data.length + " gridded squares.");
    
    // Adjust artboard view to fit all artboards
    app.executeMenuCommand('fitall');
}

// Run the script
try {
    main();
} catch (e) {
    alert("Error: " + e.message);
} 