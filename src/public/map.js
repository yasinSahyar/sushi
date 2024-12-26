"use strict";
// sources:
// https://digitransit.fi/en/developers/apis/1-routing-api/itinerary-planning/
// route points are in Google polyline encoded format, so you need to add support for Leafletiin:
// https://github.com/jieter/Leaflet.encoded

const pstart = document.getElementById("start_time");
const pend = document.getElementById("end_time");

// show the map
const map = L.map("map").setView([60.1785553, 24.8786212], 13);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const apiAddress =
  "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql"; // cors issues may arise, use proxy or browser plugin if necessary

// fetch route with origin and target
function getRoute(origin, target) {
  // GraphQL query
  const GQLQuery = `{
  plan(
    from: {lat: ${origin.latitude}, lon: ${origin.longitude}}
    to: {lat: ${target.latitude}, lon: ${target.longitude}}
    numItineraries: 1
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        distance
        legGeometry {
          points
        }
      }
    }
  }
}`;

  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "digitransit-subscription-key": "894496821ed2453d826c99a2365a1703",
    },
    body: JSON.stringify({ query: GQLQuery }),
  };

  fetch(apiAddress, fetchOptions)
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      console.log(result.data.plan.itineraries[0].legs);
      const d = new Date();
      d.setTime(result.data.plan.itineraries[0].legs[0].startTime);
      pstart.innerHTML = `Start time: ${d}`;
      d.setTime(result.data.plan.itineraries[0].legs[0].endTime);
      pend.innerHTML = `End time: ${d}`;

      const googleEncodedRoute = result.data.plan.itineraries[0].legs;
      for (let i = 0; i < googleEncodedRoute.length; i++) {
        let color = "";
        switch (googleEncodedRoute[i].mode) {
          case "WALK":
            color = "green";
            break;
          case "BUS":
            color = "red";
            break;
          case "RAIL":
            color = "cyan";
            break;
          case "TRAM":
            color = "magenta";
            break;
          default:
            color = "blue";
            break;
        }
        const route = googleEncodedRoute[i].legGeometry.points;
        const pointObjects = L.Polyline.fromEncoded(route).getLatLngs(); // fromEncoded: convert Google encoding to Leaflet polylines
        L.polyline(pointObjects)
          .setStyle({
            color,
          })
          .addTo(map);
      }
      map.fitBounds([
        [origin.latitude, origin.longitude],
        [target.latitude, target.longitude],
      ]);
    })
    .catch(function (e) {
      console.error(e.message);
    });
}

const form = document.getElementById("navdata");

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  try {
    const start_location = document.getElementById("start").value;
    console.log(start_location);
    const end_location = document.getElementById("end").value;
    const start_response = await fetch(
      `https://api.digitransit.fi/geocoding/v1/search?text=${start_location}&size=1&digitransit-subscription-key=894496821ed2453d826c99a2365a1703`
    );
    const end_response = await fetch(
      `https://api.digitransit.fi/geocoding/v1/search?text=${end_location}&size=1&digitransit-subscription-key=894496821ed2453d826c99a2365a1703`
    );
    const start_cordinates = await start_response.json();
    const end_cordinates = await end_response.json();
    console.log(start_cordinates.bbox[1]);
    console.log(end_cordinates.bbox[1]);
    getRoute(
      { latitude: start_cordinates.bbox[1], longitude: end_cordinates.bbox[0] },
      { latitude: end_cordinates.bbox[1], longitude: end_cordinates.bbox[0] }
    );
  } catch (error) {
    console.log(error.message);
  }
});
