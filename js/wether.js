const url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://goweather.herokuapp.com/weather/oslo')}`;

export async function get_temp() {
    const response = await fetch(url);
    try {
        if(response.status >=200 && response.status < 300){
            const result = await response.json();
            console.log(result)
            const main_el = document.getElementById('temp')
            const temperature_element = document.createElement('h3');
            temperature_element.textContent = result.temperature;
            main_el.append(temperature_element);
            const temperatureArray = result.temperature.split(' ');
            const todayTemperature = parseInt(temperatureArray[0]);
            const calculatedTemperature = 80 - todayTemperature*2;
            const valuePipe = document.querySelector('.value');
            valuePipe.style.height = `${calculatedTemperature}%`;
            const temperaturePipe = document.querySelector('#term_pipe');
            if(todayTemperature <= 5 ){
                temperaturePipe.style.backgroundColor = '#00F';
                
            }

    }else if(response.status === 404){
        throw new Error('url ikke funnet')
    }else if(response.status === 500){
        throw new Error('feil med server')
    }
    
    }catch (error) {
        const error_box = document.querySelector('.error');
        error_box.textContent = error.message
        error_box.classList.toggle('hide-error')

    }


};


const urlMet = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.91389&lon=10.75449&altitude=11';
// const url = 'https://goweather.herokuapp.com/weather/oslo';

export async function getWeather() {
    // hämtar data från extern källa
    const response = await fetch(urlMet);
    // konverter response til json med funksjonen json()
    const result = await response.json(); 
    const mainEl = document.getElementById('app');

    //Hente ut nåvärende time fra to karakterer og kombinerer dem
    const currentDate = new Date();
    const hoursNow = `${currentDate.getHours()}:00`;
    const currentIndex = result.properties.timeseries.find(serie => {
        return serie.time.includes(hoursNow);
    });

    const main_el = document.getElementById('temp');
    const currentTemperature = currentIndex.data.instant.details.air_temperature;
    const temperature_element = document.createElement('h3');
    temperature_element.textContent = `${currentTemperature} ℃`;
    main_el.append(temperature_element);
    const sky_situation = currentIndex.data.next_1_hours.summary.symbol_code;
    console.log(sky_situation)
    const weather_cont = document.querySelector('#wed');
    
    weather_cont.style.backgroundImage= `url(../assets/images/png/${sky_situation}.png)`

    const calculatedTemperature = 80 - currentTemperature*2;
    const valuePipe = document.querySelector('.value');
    valuePipe.style.height = `${calculatedTemperature}%`;
    const temperaturePipe = document.querySelector('#term_pipe');
    if(currentTemperature <= 5 ){
        temperaturePipe.style.backgroundColor = '#00F';

    }

};