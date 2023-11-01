async function fetchSvg(url) {
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');
  return doc.documentElement;
}

// COMBINE SVGS
async function main() {
  const mainSvg = await fetchSvg('svgs/Rect.svg');
  const iconSvg = await fetchSvg('svgs/GG Logo svg.svg');

  // Get a reference to the SVG element in HTML
  const svg = document.getElementById("my-svg");

  // Append a clone of the main SVG to the SVG element in HTML
  svg.appendChild(mainSvg.cloneNode(true));

  // Create an SVG text element
  const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");

  // Set attributes for the text element (position, font-size, etc.)
  textElement.setAttribute("x", "250");
  textElement.setAttribute("y", "250");
  textElement.setAttribute("font-family", "Verdana");
  textElement.setAttribute("font-size", "24");
  textElement.setAttribute("fill", "black");
  
  // Add the text content
  textElement.textContent = "Matthew";
  
  // Append the text element to the main SVG
  svg.appendChild(textElement);

  // Create a new SVG container for the icon
  const iconContainer = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  iconContainer.setAttribute("x", "100");
  iconContainer.setAttribute("y", "200");
  iconContainer.setAttribute("width", "100");
  iconContainer.setAttribute("height", "100");

  // Append a clone of the icon to the icon container
  iconContainer.appendChild(iconSvg.cloneNode(true));

  // Append the icon container to the main SVG
  svg.appendChild(iconContainer);
  //DOWNLOADING SECTION

  // Get a reference to the download button
  const downloadButton = document.getElementById("download-button");

  // Add a click event listener to the button
  downloadButton.addEventListener("click", () => {
      // Serialize the SVG element to XML
      const svgXml = new XMLSerializer().serializeToString(svg);

      // Create a Blob from the SVG XML
      const blob = new Blob([svgXml], { type: "image/svg+xml" });

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "combined-svg-file.svg";

      // Simulate a click event on the anchor element
      downloadLink.click();

      // Clean up by revoking the URL
      URL.revokeObjectURL(url);
  });
}

// Run the main function
main();