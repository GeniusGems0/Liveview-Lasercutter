async function fetchSvg(url) {
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');
  return doc.documentElement;
}

function chooseFont() {
  const fontInput = document.getElementById('font-select'); // Assuming you have a <select> element with id="font-select"
  const svg = document.getElementById("my-svg");
  const name = svg.querySelector("#name-text").textContent || "Name Goes Here";
  const selectedFont = fontInput.value;

  updateTextElement(svg, name, selectedFont);
}

function createTextElement(name, font = "Futura") {
  const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textElement.setAttribute("x", "250");
  textElement.setAttribute("y", "250");
  textElement.setAttribute("font-family", font);
  textElement.setAttribute("font-size", "24");
  textElement.setAttribute("fill", "black");
  textElement.setAttribute("id", "name-text");
  textElement.textContent = name;
  return textElement;
}

function updateTextElement(svg, newName, newFont) {
  let textElement = svg.querySelector("#name-text");
  const maxWidth = 240; 

  if (textElement) {
    textElement.textContent = newName;
    textElement.setAttribute("font-family", newFont);
    fitTextToContainer(textElement, maxWidth);
  } 
  else {
    textElement = createTextElement(newName, newFont);
    svg.appendChild(textElement);
    fitTextToContainer(textElement, maxWidth);
  }
}

function fitTextToContainer(textElement, maxWidth) {
  // Create a temporary span for measurement
  const tempSpan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
  tempSpan.setAttribute("style", "white-space: nowrap;");
  tempSpan.textContent = textElement.textContent;
  textElement.textContent = '';
  textElement.appendChild(tempSpan);

  // Start with a large font size
  let fontSize = 40;
  textElement.setAttribute("font-size", fontSize);

  // Measure the width of the text
  let textWidth = tempSpan.getComputedTextLength();

  // Reduce the font size until the text fits within the maximum width
  while (textWidth > maxWidth && fontSize > 0) {
    fontSize--;
    textElement.setAttribute("font-size", fontSize);
    textWidth = tempSpan.getComputedTextLength();
  }

  // Set the final text content with the adjusted font size
  textElement.textContent = tempSpan.textContent;
}

// Set up event listeners after the page has loaded
window.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('name-input').addEventListener('change', (event) => {
    const newName = event.target.value;
    const svg = document.getElementById("my-svg");
    updateTextElement(svg, newName);
  });

  document.getElementById('icon-select').addEventListener('change', (event) => {
    const newIconUrl = event.target.value;
    const svg = document.getElementById("my-svg");
    updateIcon(svg, newIconUrl);
  });
});

function createIconContainer(iconSvg, x, y, width, height) {
  const iconContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iconContainer.setAttribute("x", x);
  iconContainer.setAttribute("y", y);
  iconContainer.setAttribute("width", width);
  iconContainer.setAttribute("height", height);
  iconContainer.appendChild(iconSvg.cloneNode(true));
  return iconContainer;
}

async function updateIcon(svg, newIconSvgUrl) {
  console.log(`Fetching new icon: ${newIconSvgUrl}`); // Debugging line

  let iconContainer = svg.querySelector("#icon-container");
  if (iconContainer) {
    svg.removeChild(iconContainer);
  }

  try {
    const newIconSvg = await fetchSvg(newIconSvgUrl);
    const newIconContainer = createIconContainer(newIconSvg, 100, 200, "30mm", "30mm");
    newIconContainer.id = "icon-container"; 
    svg.appendChild(newIconContainer);
    console.log("Icon updated successfully."); // Debugging line
  } catch (error) {
    console.error("Failed to update the icon:", error); // Debugging line
  }
}

async function main() {
  const mainSvg = await fetchSvg('svgs/Square Glitter Tile.svg');
  const iconSvg = await fetchSvg('svgs/None.svg');

  const svg = document.getElementById("my-svg");
  svg.appendChild(mainSvg.cloneNode(true));

  const textElement = createTextElement("Name Goes Here");
  svg.appendChild(textElement);

  const iconContainer = createIconContainer(iconSvg, 100, 200, "30mm", "30mm");
  svg.appendChild(iconContainer);

  setUpDownload(svg);
}

function setUpDownload(svgElement) {
  const downloadButton = document.getElementById("download-button");
  downloadButton.addEventListener("click", () => {
    const svgXml = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgXml], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "combined-svg-file.svg";
    downloadLink.click();
    URL.revokeObjectURL(url);
  });
}

main();

document.addEventListener('DOMContentLoaded', () => {
  const updateButton = document.getElementById('updateNameButton');
  const nameInput = document.getElementById('nameInput');
  const fontSelect = document.getElementById('font-select'); // Get the font select element
  const iconSelect = document.getElementById('icon-select'); // Get the icon select element
  const svg = document.getElementById("my-svg");

  updateButton.addEventListener('click', () => {
    const newName = nameInput.value;
    const newFont = fontSelect.value; // Get the selected font
    const newIconUrl = iconSelect.value; // Get the selected icon URL

    updateTextElement(svg, newName, newFont); // Update the name and font
    updateIcon(svg, newIconUrl); // Update the icon
    
  });
});