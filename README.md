# Kakikata Generator: Master Japanese Handwriting

This Chrome extension helps you learn Japanese handwriting by generating PDFs of highlighted text with visual aids.  It utilizes a custom font (Kanji stroke order font v4.004) and allows users to customize font size and opacity, as well as add grids for better stroke order practice.

## Features

* **Generates PDFs:** Creates PDFs from highlighted text on any webpage.
* **Customizable Font:** Employs a custom font designed for practicing Japanese handwriting.
* **Adjustable Font Size and Opacity:** Allows users to fine-tune the appearance of the text for optimal learning.
* **Grid Option:**  Provides an option to overlay grids on the characters for improved stroke order visualization.

## Installation

This extension is designed for Google Chrome.  You can install it by:

1. Cloning this repository.
2. Opening Chrome and navigating to `chrome://extensions/`.
3. Enabling "Developer mode" in the top right corner.
4. Clicking "Load unpacked" and selecting the `kakikata-chromium` directory.


## Usage

1. **Highlight text:** Select the Japanese text you wish to practice on any webpage.
2. **Open the extension popup:** Click on the extension's icon in the Chrome toolbar.
3. **Adjust settings (optional):** Modify the font size, opacity, and grid options as desired.
4. **Click "Generate kakikata":** This will generate a PDF with the highlighted text, incorporating your chosen settings.  The PDF will open in a new tab.

## Technologies Used

* JavaScript
* HTML
* CSS
* Bootstrap (for styling)
* jsPDF (for PDF generation)