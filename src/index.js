if (document.readyState !== "loading") {
  console.log("Document is ready!");
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready after waiting!");
    initializeCode();
  });
}
async function initializeCode() {
  const fetchData = async () => {
    const url =
      "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    initMap(data);
  };

  const fetchPositive = async () => {
    const url =
      "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";

    const res = await fetch(url);
    const data = await res.json();

    const positiveArray = Object.values(data.dataset.value);

    return positiveArray;
  };

  const fetchNegative = async () => {
    const url =
      "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";

    const res = await fetch(url);
    const data = await res.json();

    const negativeArray = Object.values(data.dataset.value);

    return negativeArray;
  };

  const initMap = (dataMunicipality) => {
    let map = L.map("map", {
      minZoom: -3,
    });

    let geoJson = L.geoJSON(dataMunicipality, {
      onEachFeature: getFeature,
      weight: 2,
    }).addTo(map);

    let osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }
    ).addTo(map);

    map.fitBounds(geoJson.getBounds());
  };

  const getFeature = (feature, layer) => {
    if (!feature) return;
    layer.bindTooltip(feature.properties.name);
    layer.bindPopup(
      `<ul>
            <li>Name: ${feature.properties.name}</li>
            <li>Positive migration: ${
              positiveArray[feature.properties.kunta]
            }</li>
            <li>Negative migration: ${
              negativeArray[feature.properties.kunta]
            }</li>
      </ul>`
    );
  };

  const positiveArray = await fetchPositive();
  console.log(positiveArray);
  const negativeArray = await fetchNegative();
  console.log(negativeArray);
  fetchData();
}
