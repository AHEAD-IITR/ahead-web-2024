// Function to fetch JSON data and insert it into divs
function loadInfo(jsonFile, divId) {
    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            const container = document.querySelector(`#${divId} .info-container`);

            data.forEach(item => {
                // Create a div for each entry
                const infoItem = document.createElement('div');
                infoItem.classList.add('info-item');

                // Create the anchor element for name and link
                const linkElement = document.createElement('a');
                linkElement.textContent = item.name;
                if (item.link) {
                    linkElement.href = item.link;
                    linkElement.target = "_blank"; // Open link in a new tab
                }

                // Append the anchor element to the info item
                infoItem.appendChild(linkElement);
                container.appendChild(infoItem);
            });
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });
}

// Load data for MSC, Intern, and Research Assistant
loadInfo('../json/msc.json', 'msc'); // Fetch and load MSC data
loadInfo('../json/intern.json', 'intern'); // Fetch and load Intern data
loadInfo('../json/research_asst.json', 'research-assistant'); // Fetch and load Research Assistant data
