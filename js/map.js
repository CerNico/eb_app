export async function make_map() {


    const bike_stations = await get_stations();

    const status = await get_status();
    const check_bikes = (id)=> {
        return status.find((station)=> {
            return station.station_id === id
        })
    }

    const feature_bikes = bike_stations.map(station => {

        const checked = check_bikes(station.station_id)

        return {
                'type': 'feature',
                'properties': {
                    station: station.name,
                    address: station.address,
                    capacity: station.capacity,
                    bikes: checked.num_bikes_available
                },
                'geometry': {
                'type': 'Point',
                coordinates: [station.lon, station.lat]
                }
            }
        });


    const geo_stations = {
        'type': 'FeatureCollection',
        'features': feature_bikes
    }

    const mapbox_key = 'pk.eyJ1IjoiY2VybmljIiwiYSI6ImNsMHdnbW15ODBsaTIzZ3A1dmxwczFvd3YifQ.HJwUmj7zw6wYQ9Jb2JOcMw';

    mapboxgl.accessToken = mapbox_key;
        const map = new mapboxgl.Map (
        { container: 'map', // container ID
        style: 'mapbox://styles/cernic/cl1l2zqrq000d14r2k28u9z6t', // style URL

        center: [10.7522, 59.9139], // starting position [lng, lat]
        zoom: 13 // starting zoom
    });


    geo_stations.features.forEach(station => {
        const marker_el = document.createElement('div')
        marker_el.classList.add('marker');
        
        marker_el.addEventListener('click', () => {
            poppup_mesage(
                station.properties.station, 
                station.properties.capacity, 
                station.properties.bikes)
        });
        new mapboxgl.Marker(marker_el)
        .setLngLat(station.geometry.coordinates)
        .addTo(map);
    });

};

function poppup_mesage(station, capacity, bikes) {
    const card_el = document.querySelector('.info_cont')
    card_el.classList.remove('hide');

    const station_name = document.querySelector('.station_title')
        console.log(station_name)
        station_name.textContent = station

        const Bike_capacity = document.querySelector('.capacity')
        Bike_capacity.textContent =`${bikes}/${capacity}`

    
    const close_card = document.querySelector('.info_cont')
    close_card.addEventListener('click', (event) => {
        event.preventDefault();
        card_el.classList.add('hide')
    })
}

async function get_stations (){
    const url = 'https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json';
    const response = await fetch(url);
    const stations = await response.json();
    return stations.data.stations
}

async function get_status (){
    const url = 'https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json';
    const response = await fetch(url);
    const stations = await response.json();
    return stations.data.stations
}