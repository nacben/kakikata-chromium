importScripts("static/js/libs/jspdf.umd.min.js");
importScripts("static/js/custom-font.js");
importScripts("static/js/constants.js");

const { jsPDF } = globalThis.jspdf;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "createPDF") {
    createPDF(request.text);
    return true;
  }
});

async function createPDF(text) {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add the font to the virtual file system
  doc.addFileToVFS("static/fonts/custom-font.ttf", font);

  // Add the font
  doc.addFont("static/fonts/custom-font.ttf", "CustomFont", "normal");

  // Use the font
  doc.setFont("CustomFont");

  let { fontSizeValue, addGrids, fontOpacityValue } =
    await chrome.storage.sync.get([
      "fontSizeValue",
      "addGrids",
      "fontOpacityValue",
    ]);

  fontSizeValue = parseInt(fontSizeValue);
  fontOpacityValue = parseFloat(fontOpacityValue / 100);
  console.log(fontOpacityValue);
  // Set text size
  doc.setFontSize(fontSizeValue);

  // Set margins and page dimensions
  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Load the logo
  const logoUrl = chrome.runtime.getURL("static/img/logo.png");
  let logoImg;

  // Logo dimensions and positioning
  const logoRatio = 486 / 1652; // height / width
  const logoWidth = 30; // Adjust this value to make the logo larger or smaller
  const logoHeight = logoWidth * logoRatio;
  const logoX = margin;
  const logoY = margin;

  let pageNumber = 1;

  // Function to add page elements
  function addPageElements() {
    if (logoImg) {
      doc.addImage(
        logoImg,
        "PNG",
        logoX,
        logoY,
        logoWidth,
        logoHeight,
        undefined,
        "FAST",
        0
      );

      // Set opacity for the logo
      doc.setGState(new doc.GState({ opacity: 0.3 }));
      doc.addImage(
        logoImg,
        "PNG",
        logoX,
        logoY,
        logoWidth,
        logoHeight,
        undefined,
        "FAST",
        0
      );
      doc.setGState(new doc.GState({ opacity: 1 })); // Reset opacity
    }

    // Add link
    doc.setFont("helvetica");
    doc.setFontSize(16);
    doc.textWithLink(
      "genkier.com",
      pageWidth - margin - 30,
      pageHeight - margin,
      { url: "https://genkier.com" }
    );
    // Add page number
    doc.setFontSize(10); // Smaller font size for page number
    doc.text(`Page ${pageNumber}`, margin, pageHeight - margin);
    doc.setFontSize(fontSizeValue); // Reset to default size

    pageNumber++; // Increment page number

    doc.setFont("CustomFont");
    doc.setFontSize(fontSizeValue);
  }

  const cellSize = fontSizeValue * 0.7; // Adjust this value to change grid size

  // Function to draw a character with a grid
  function drawCharacterWithGrid(char, x, y) {
    // Draw the grid
    if (addGrids) {
      doc.setDrawColor(200);
    } else {
      doc.setDrawColor(255);
    }
    doc.rect(x, y, cellSize, cellSize);

    // Draw the character
    doc.setGState(new doc.GState({ opacity: fontOpacityValue }));
    doc.text(char, x + cellSize / 2, y + cellSize / 2, {
      align: "center",
      baseline: "middle",
    });
    doc.setGState(new doc.GState({ opacity: 1 }));
  }

  // First, load the image
  fetch(logoUrl)
    .then((response) => response.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    )
    .then((logoData) => {
      logoImg = logoData;

      // Now create the PDF
      let cursorX = margin;
      let cursorY = margin + 20; // Start below the logo

      // Add the first page elements
      addPageElements();

      // Process each character in the text
      for (let char of text) {
        // Check if we need to start a new line
        if (cursorX > pageWidth - margin - cellSize) {
          cursorX = margin;
          cursorY += cellSize;
        }

        // Check if we need to start a new page
        if (cursorY > pageHeight - margin - cellSize) {
          doc.addPage();
          addPageElements();
          cursorX = margin;
          cursorY = margin + 20;
        }

        // Draw the character with grid
        drawCharacterWithGrid(char, cursorX, cursorY);

        // Move cursor for next character
        cursorX += cellSize;
      }

      // Generate PDF data URL
      const pdfDataUri = doc.output("datauristring");

      // Open PDF in new tab
      chrome.tabs.create({ url: pdfDataUri });
    })
    .catch((error) => console.error("Error loading logo:", error));
}
