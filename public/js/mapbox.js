export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoic3Byb3ZhIiwiYSI6ImNrZndnazFqeDFid3QyenFxMzhqMXJodGMifQ.PBWY0kmIZr5Q0yqPk6WT6A';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/sprova/ckfwi133401jw1codfy076tra',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup()
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description} </p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
