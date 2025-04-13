// GenerateGridFractionsEnhanced.jsx
// Enhanced script to generate gridded square images in Adobe Illustrator
// with color customization and automatic SVG export

// Configuration
var SQUARE_SIZE = 200; // Size in pixels
var MARGIN = 50; // Margin between artboards
var DEFAULT_FILL_COLOR = [230/255, 230/255, 230/255]; // Light gray
var STROKE_COLOR = [0, 0, 0]; // Black
var LABEL_FONT_SIZE = 14;
var ARTBOARD_SIZE = SQUARE_SIZE + 100; // Extra space for labels
var EXPORT_SVG = true; // Set to false to disable automatic SVG export

// Color presets - can be chosen by user
var COLOR_PRESETS = {
    "blue": [0.2, 0.4, 0.8],
    "red": [0.8, 0.2, 0.2],
    "green": [0.2, 0.8, 0.4],
    "purple": [0.6, 0.2, 0.8],
    "orange": [1.0, 0.6, 0.0],
    "teal": [0.0, 0.6, 0.6]
};

// CSV Parser Function
function parseCSV(csvString) {
    var lines = csvString.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    
    // Trim header names
    for (var h = 0; h < headers.length; h++) {
        headers[h] = headers[h].trim();
    }
    
    // Check if there's a Color column
    var hasColorColumn = headers.indexOf("Color") !== -1;
    
    for (var i = 1; i < lines.length; i++) {
        // Skip empty lines
        if (lines[i].trim() === "") continue;
        
        var currentLine = lines[i].split(",");
        if (currentLine.length >= 3) { // At least Label, Fraction, Direction
            var obj = {};
            for (var j = 0; j < headers.length && j < currentLine.length; j++) {
                obj[headers[j]] = currentLine[j].trim();
            }
            result.push(obj);
        }
    }
    
    return {
        data: result,
        hasColorColumn: hasColorColumn
    };
}

// Function to create a gridded square
function createGriddedSquare(doc, row, artboardIndex, hasColorColumn) {
    try {
        // Extract data from row
        var label = row.Label;
        var fraction = row.Fraction;
        var direction = row.Direction;
        
        // Parse fraction
        var fractionParts = fraction.split("/");
        var numerator = parseInt(fractionParts[0]);
        var denominator = parseInt(fractionParts[1]);
        
        // Determine fill color
        var fillColor;
        if (hasColorColumn && row.Color && COLOR_PRESETS[row.Color.toLowerCase()]) {
            fillColor = COLOR_PRESETS[row.Color.toLowerCase()];
        } else {
            fillColor = DEFAULT_FILL_COLOR;
        }
        
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
            // Create horizontal divisions
            cellSize = SQUARE_SIZE / denominator;
            
            for (var i = 0; i < denominator; i++) {
                // Create cell rectangles
                var cell = doc.pathItems.rectangle(
                    squareY + (i * cellSize),
                    squareX,
                    SQUARE_SIZE,
                    cellSize
                );
                cells.push(cell);
            }
            
            // Add dividing lines
            for (var i = 1; i < denominator; i++) {
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
        } else { // vertical
            // Create vertical divisions
            cellSize = SQUARE_SIZE / denominator;
            
            for (var i = 0; i < denominator; i++) {
                // Create cell rectangles
                var cell = doc.pathItems.rectangle(
                    squareY,
                    squareX + (i * cellSize),
                    cellSize,
                    SQUARE_SIZE
                );
                cells.push(cell);
            }
            
            // Add dividing lines
            for (var i = 1; i < denominator; i++) {
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
        
        // Fill the first 'numerator' cells
        for (var i = 0; i < numerator && i < cells.length; i++) {
            cells[i].filled = true;
            cells[i].fillColor = new RGBColor();
            cells[i].fillColor.red = fillColor[0] * 255;
            cells[i].fillColor.green = fillColor[1] * 255;
            cells[i].fillColor.blue = fillColor[2] * 255;
        }
        
        // Add label
        var labelText = doc.textFrames.add();
        labelText.position = [
            artboardX + (ARTBOARD_SIZE - SQUARE_SIZE) / 2,
            squareY + SQUARE_SIZE + 30
        ];
        labelText.contents = label + " (" + fraction + ")";
        labelText.textRange.characterAttributes.size = LABEL_FONT_SIZE;
        
        // Apply custom font styles if specified
        if (row.FontSize) {
            labelText.textRange.characterAttributes.size = parseInt(row.FontSize);
        }
        
        if (row.FontWeight && row.FontWeight.toLowerCase() === "bold") {
            labelText.textRange.characterAttributes.fillColor = new RGBColor();
            labelText.textRange.characterAttributes.fillColor.red = 0;
            labelText.textRange.characterAttributes.fillColor.green = 0;
            labelText.textRange.characterAttributes.fillColor.blue = 0;
            labelText.textRange.characterAttributes.strokeWeight = 0.5;
        }
        
        return label; // Return label for use in export
    } catch (e) {
        alert("Error creating square for " + label + ": " + e.message);
        return label || "Unknown";
    }
}

// Function to export SVGs
function exportSVGs(doc, exportFolder, artboardNames) {
    try {
        if (!EXPORT_SVG) return;
        
        // Create SVG export options
        var exportOptions = new ExportOptionsSVG();
        exportOptions.embedRasterImages = false;
        exportOptions.cssProperties = SVGCSSPropertyLocation.STYLEATTRIBUTES;
        exportOptions.fontSubsetting = SVGFontSubsetting.GLYPHSUSED;
        exportOptions.documentEncoding = SVGDocumentEncoding.UTF8;
        
        // Export each artboard
        for (var i = 0; i < artboardNames.length; i++) {
            var artboardName = artboardNames[i];
            doc.artboards.setActiveArtboardIndex(i);
            
            var svgFile = new File(exportFolder + "/" + artboardName + ".svg");
            doc.exportFile(svgFile, ExportType.SVG, exportOptions);
        }
    } catch (e) {
        alert("Error exporting SVGs: " + e.message);
    }
}

// Main function
function main() {
    try {
        // Ask user to select the CSV file
        var csvFile = File.openDialog("Select CSV file", "*.csv");
        if (!csvFile) {
            alert("No file selected. Exiting script.");
            return;
        }
        
        // Read CSV file
        csvFile.open('r');
        var csvContent = csvFile.read();
        csvFile.close();
        
        if (csvContent === "") {
            alert("CSV file is empty.");
            return;
        }
        
        // Parse CSV data
        var result = parseCSV(csvContent);
        var data = result.data;
        var hasColorColumn = result.hasColorColumn;
        
        if (data.length === 0) {
            alert("No valid data found in the CSV file.");
            return;
        }
        
        // Ask if user wants to export SVGs
        var exportFolder = null;
        if (EXPORT_SVG) {
            var exportSVGsChoice = confirm("Would you like to automatically export all artboards as SVG files?");
            if (exportSVGsChoice) {
                exportFolder = Folder.selectDialog("Select a folder to export SVGs to");
                if (!exportFolder) {
                    alert("No export folder selected. SVGs will not be exported.");
                    EXPORT_SVG = false;
                }
            } else {
                EXPORT_SVG = false;
            }
        }
        
        // Create a new document
        var docPreset = new DocumentPreset();
        docPreset.colorMode = DocumentColorSpace.RGB;
        docPreset.width = ARTBOARD_SIZE;
        docPreset.height = ARTBOARD_SIZE;
        docPreset.units = RulerUnits.Pixels;
        
        var doc = app.documents.addDocument(DocumentColorSpace.RGB, docPreset);
        
        // Remove the default artboard
        if (doc.artboards.length > 0) {
            doc.artboards.remove(0);
        }
        
        // Process each row and create gridded squares
        var artboardNames = [];
        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            var artboardName = createGriddedSquare(
                doc,
                row,
                i,
                hasColorColumn
            );
            artboardNames.push(artboardName);
        }
        
        alert("Generated " + data.length + " gridded squares.");
        
        // Adjust artboard view to fit all artboards
        app.executeMenuCommand('fitall');
        
        // Export SVGs if requested
        if (EXPORT_SVG && exportFolder) {
            exportSVGs(doc, exportFolder, artboardNames);
            alert("Exported " + artboardNames.length + " SVG files to: " + exportFolder.fsName);
        }
    } catch (e) {
        alert("Main error: " + e.message);
    }
}

// Run the script
try {
    main();
} catch (e) {
    alert("Outer error: " + e.message);
} 