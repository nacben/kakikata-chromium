document.addEventListener("DOMContentLoaded", function () {
  const extractButton = document.getElementById("extractButton");
  const fontSizeInput = document.getElementById("fontSizeInput");
  const fontOpacityInput = document.getElementById("fontOpacityInput");
  const addGridsCheckBox = document.getElementById("addGridsInput");

  chrome.storage.sync.get(
    ["fontSizeValue", "addGrids", "fontOpacityValue"],
    function (result) {
      const fontSizeValue = result.fontSizeValue || CONSTANTS.DEFAULT_FONT_SIZE;
      const addGrids = result.addGrids || false;
      const fontOpacityValue =
        result.fontOpacityValue || CONSTANTS.DEFAULT_FONT_OPACITY;

      addGridsCheckBox.checked = addGrids;
      fontSizeInput.value = fontSizeValue;
      fontOpacityInput.value = fontOpacityValue;
    }
  );

  extractButton.addEventListener("click", function () {
    chrome.storage.sync.set(
      {
        fontSizeValue: fontSizeInput.value,
        addGrids: addGridsCheckBox.checked,
        fontOpacityValue: fontOpacityInput.value,
      },
      function () {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.scripting.executeScript(
              {
                target: { tabId: tabs[0].id },
                function: getSelectedText,
              },
              (injectionResults) => {
                if (injectionResults && injectionResults[0]) {
                  const selectedText = injectionResults[0].result;
                  if (selectedText) {
                    chrome.runtime.sendMessage({
                      action: "createPDF",
                      text: selectedText,
                    });
                  } else {
                    alert(
                      "No text selected. Please highlight some text and try again."
                    );
                  }
                }
              }
            );
          }
        );
      }
    );
  });

  fontSizeInput.addEventListener("blur", () => {
    validateInput(fontSizeInput);
  });

  fontOpacityInput.addEventListener("blur", () => {
    validateInput(fontOpacityInput);
  });

  function validateInput(inputElement) {
    const min = parseInt(inputElement.min);
    const max = parseInt(inputElement.max);
    const value = parseInt(inputElement.value);

    if (value < min) {
      alert(`Value must be at least ${min}.`);
      inputElement.value = min;
    } else if (value > max) {
      alert(`Value cannot exceed ${max}.`);
      inputElement.value = max;
    }
  }

  function getSelectedText() {
    return window.getSelection().toString();
  }
});
