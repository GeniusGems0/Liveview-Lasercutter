async function fetchSvg(url) {
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');
  return doc.documentElement;
}

function chooseFont() {

}

function createTextElement(name) {
  const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
  name_font = "Verdana"
  textElement.setAttribute("x", "250");
  textElement.setAttribute("y", "250");
  textElement.setAttribute("font-family", name_font);
  textElement.setAttribute("font-size", "24");
  textElement.setAttribute("fill", "black");
  textElement.setAttribute("id", "name-text");
  textElement.textContent = name;
  return textElement;
}

function createIconContainer(iconSvg) {
  const iconContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iconContainer.setAttribute("x", "100");
  iconContainer.setAttribute("y", "200");
  iconContainer.setAttribute("width", "30mm");
  iconContainer.setAttribute("height", "30mm");
  iconContainer.appendChild(iconSvg.cloneNode(true));
  return iconContainer;
}

function updateTextElement(svg, newName) {
  let textElement = svg.querySelector("#name-text");
  if (textElement) {
    textElement.textContent = newName;
  } 
  else {
    textElement = createTextElement(newName);
    textElement.id = "name-text"; 
    svg.appendChild(textElement);
  }
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

function updateIcon(svg, newIconSvgUrl) {
  let iconContainer = svg.querySelector("#icon-container");
  if (iconContainer) {
    svg.removeChild(iconContainer);
  }

  fetchSvg(newIconSvgUrl).then(newIconSvg => {
    const newIconContainer = createIconContainer(newIconSvg);
    newIconContainer.id = "icon-container"; 
    svg.appendChild(newIconContainer);
  });
}

async function main() {
  const mainSvg = await fetchSvg('svgs/Rect.svg');
  const iconSvg = await fetchSvg('svgs/GG Logo svg.svg');

  const svg = document.getElementById("my-svg");
  svg.appendChild(mainSvg.cloneNode(true));

  const textElement = createTextElement("Name Goes Here");
  svg.appendChild(textElement);

  const iconContainer = createIconContainer(iconSvg);
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
  const svg = document.getElementById("my-svg");

  updateButton.addEventListener('click', () => {
    const newName = nameInput.value;
    updateTextElement(svg, newName);
  });
});