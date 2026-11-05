function initLearnMoreMap() {
    const mapcontainer = document.getElementById('learnmoreMap');

    var learnmoremap = L.map(mapcontainer, {
        zoomControl: false // Disable default zoom controls
    }).setView([45.23572, -63.05802], 7); // Initial view of Halifax, NS


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(learnmoremap);

    // Custom control for the text in the top left corner
    const attributionText = 'Powered by the Nova Scotia Student Transit Network (NSSTN)';
    const customAttributionControl = L.control({ position: 'topleft' });
    customAttributionControl.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'leaflet-control-attribution');
        div.innerHTML = attributionText;
        return div;
    };

    customAttributionControl.addTo(learnmoremap);

    // Function to fetch data and add markers to the map
    function fetchData(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(stop => {
                    let icon = null;

                    for (const range in stopIdToIconMap) {
                        const [start, end] = range.split('-').map(Number);
                        if (stop.stop_id >= start && stop.stop_id <= end) {
                            icon = icons[stopIdToIconMap[range]];
                            break;
                        }
                    }
                    // You might want a default icon if no match is found
                    if (!icon) {
                        console.warn(`No icon mapping found for stop_id: ${stop.stop_id}`);
                        // icon = icons.defaultIcon;
                    }
                    if (icon) {
                        var marker = L.marker([stop.stop_lat, stop.stop_lon], { icon: icon }).addTo(learnmoremap);
                        let popupContent = `<b>${stop.stop_name}</b><br>`;
                        if (stop.stop_desc && stop.stop_desc !== 'default_desc') {
                            popupContent += `${stop.stop_desc}<br>`;

                            function isMobileDevice() {
                                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                            }

                            if (isMobileDevice()) {
                                popupContent += `<a href="geo:${stop.stop_lat},${stop.stop_lon}">Open Map</a>`;
                            } else {
                                popupContent += `<a href="https://www.google.com/maps/search/?api=1&query=$?q=${encodeURIComponent(stop.stop_name + ' ' + (stop.stop_desc !== 'default_desc' ? stop.stop_desc : ''))}">Open Map</a>`;
                            }
                        }
                        if (stop.stop_url) {
                            popupContent += `</br><a href="${stop.stop_url}" target="_blank">Open Website</a>`;
                        }
                        marker.bindPopup(popupContent);
                    }
                });

                if (data.next) {
                    fetchData(data.next);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }
    // Initial fetch call
    fetchData('http://localhost:8000/api/v1/stn/GetDest');


    // Define custom zoom control
    L.Control.CustomZoom = L.Control.extend({
        onAdd: function(map) {
            var container = L.DomUtil.create('div', 'leaflet-control-custom');

            var zoomInButton = L.DomUtil.create('button', '', container);
            zoomInButton.innerHTML = '+';
            zoomInButton.onclick = function() {
                map.zoomIn();
            };

            var zoomOutButton = L.DomUtil.create('button', '', container);
            zoomOutButton.innerHTML = '-';
            zoomOutButton.onclick = function() {
                map.zoomOut();
            };

            return container;
        },

        onRemove: function(map) {
            // Nothing to do here
        }
    });

    var customZoomControl = new L.Control.CustomZoom({ position: 'bottomright' });
    learnmoremap.addControl(customZoomControl);
}

initLearnMoreMap();