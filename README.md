# Gridded Square Fraction Generator for Adobe Illustrator

This script generates square diagrams divided into equal parts with a subset of parts shaded, based on fraction data from a CSV file.

## Requirements

- Adobe Illustrator (Script tested with CS6 and newer versions)

## Files

- `GenerateGridFractions.jsx` - The main Adobe Illustrator script
- `GenerateGridFractionsEnhanced.jsx` - Enhanced version with color customization and SVG export
- `sample_data.csv` - A sample CSV file with basic fraction data
- `sample_data_enhanced.csv` - A sample CSV file with color and font customization options

## CSV Format

### Basic Format
The CSV file should have the following columns:
- `Label`: Name or title for the diagram (e.g., 'Half', 'Three Fourths')
- `Fraction`: A string in the format 'numerator/denominator' (e.g., '3/4')
- `Direction`: Either 'horizontal' or 'vertical' to determine the division layout

Example:
```
Label,Fraction,Direction
Quarter,1/4,horizontal
Half,1/2,vertical
```

### Enhanced Format
The enhanced version supports additional columns:
- `Color`: Color name for filled areas (Blue, Red, Green, Purple, Orange, Teal)
- `FontSize`: Size of the label text in points
- `FontWeight`: Font weight (Regular or Bold)

Example:
```
Label,Fraction,Direction,Color,FontSize,FontWeight
Quarter,1/4,horizontal,Blue,14,Regular
Half,1/2,vertical,Red,16,Bold
```

## How to Use

1. Open Adobe Illustrator
2. Go to File > Scripts > Other Script...
3. Navigate to and select either `GenerateGridFractions.jsx` or `GenerateGridFractionsEnhanced.jsx`
4. When prompted, select your CSV file
5. If using the enhanced script, you'll be asked if you want to export SVGs automatically
6. The script will generate one square per row in the CSV, with each square on its own artboard
7. Save the document as an AI file to preserve all artboards

## Output

- Each square is 200x200 pixels by default
- The filled areas use the specified color (or light gray for the basic script)
- Each square includes its label (e.g., 'Quarter (1/4)') near the shape
- Each diagram is placed on a separate artboard
- The enhanced script can automatically export SVGs if requested

## Customization

You can modify the following variables at the top of the script:

```javascript
var SQUARE_SIZE = 200; // Size in pixels
var MARGIN = 50; // Margin between artboards
var FILL_COLOR = [230/255, 230/255, 230/255]; // Light gray (basic script)
var DEFAULT_FILL_COLOR = [230/255, 230/255, 230/255]; // Light gray (enhanced script)
var STROKE_COLOR = [0, 0, 0]; // Black
var LABEL_FONT_SIZE = 14;
var ARTBOARD_SIZE = SQUARE_SIZE + 100; // Extra space for labels
var EXPORT_SVG = true; // Set to false to disable automatic SVG export (enhanced script only)
```

### Color Presets (Enhanced Script)
The enhanced script includes the following color presets that can be specified in the CSV:
- Blue
- Red
- Green
- Purple
- Orange
- Teal

You can modify these colors in the `COLOR_PRESETS` object at the top of the enhanced script.

## Exporting

### Basic Script
To export each artboard as a separate file:
1. Go to File > Export > Export for Screens...
2. Select the artboards you want to export
3. Choose your preferred format (SVG, PNG, etc.)
4. Click Export

### Enhanced Script
The enhanced script can automatically export SVGs for all artboards if you select that option when prompted.

## Troubleshooting

If the script encounters an error:
- Make sure your CSV file follows the correct format
- Check that there are no empty rows or extra commas in the CSV
- Restart Illustrator and try again 