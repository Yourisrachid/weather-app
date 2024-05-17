export function localWeather() {
    document.addEventListener("DOMContentLoaded", function() {

        const weatherContainer = document.querySelector('.weather');


        async function fetchWeatherData() {
            weatherContainer.innerHTML = '';
            removeHourContainer();

            let getLocationPromise = new Promise((resolve, reject) => {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                    
                        lat = position.coords.latitude
                        long = position.coords.longitude
            
    
                        resolve({latitude: lat, 
                                longitude: long})
                    })
            
                } else {
                    reject("your browser doesn't support geolocation API")
                }
            })

            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${getLocationPromise.then((location) => {location.latitude.toFixed(2)})}&lon=${getLocationPromise.then((location) => {location.longitude})}&appid=f569f7c440e13c5fe0bccce62f6283f8`);
                const data = await response.json();

                if (data.cod !== "200") {
                    throw new Error(data.message);
                }

                const secondsToAdd = data.city.timezone;

                const hourContainer = document.createElement('div');
                hourContainer.classList.add('hour-container');
                weatherContainer.parentNode.insertBefore(hourContainer, weatherContainer);

                function updateHour() {
                    const date = new Date();
                    const utcDate = date.toUTCString();
                    const utcDateSlice = utcDate.substring(0, utcDate.length - 4);
                    const newDate = new Date(utcDateSlice);

                    function addSeconds(date, seconds) {
                        date.setSeconds(date.getSeconds() + seconds);
                        return date;
                    }

                    addSeconds(newDate, secondsToAdd);

                    const stringHour = getFormattedHour(newDate.toISOString());

                    hourContainer.innerHTML = '';
                    const dateHour = document.createElement('p');
                    const cityHour = document.createElement('p');
                    cityHour.classList.add('cityHour');
                    cityHour.textContent =  `Actual time in ${city} :`
                    dateHour.textContent = stringHour;
                    hourContainer.appendChild(cityHour)
                    hourContainer.appendChild(dateHour);
                }

                updateHour();
                setInterval(updateHour, 1000);

                for (let i = 0; i < 5; i++) {
                    let j = i * 8;

                    const fiveDate = new Date(data.list[j].dt_txt);
                    const stringDate = getFormattedDate(fiveDate.toISOString());

                    const dayContainer = document.createElement('div');
                    dayContainer.classList.add('day-container');

                    const dateDay = document.createElement('p');
                    dateDay.classList.add('dateDay')
                    const weatherState = document.createElement('div');
                    const temp = document.createElement('p');
                    const tempmin = document.createElement('p');
                    const tempmax = document.createElement('p');
                    const state = document.createElement('p');
                    const details = document.createElement('button');
                    details.classList.add('details');
                    const spanDetails = document.createElement('span')
                    spanDetails.textContent = "Show Details";
                    details.appendChild(spanDetails)



                    const weatherIcon = document.createElement('img');
                    weatherIcon.src = `http://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png`;
                    weatherIcon.alt = data.list[j].weather[0].description;

                    weatherState.appendChild(temp);
                    weatherState.appendChild(tempmin);
                    weatherState.appendChild(tempmax);
                    weatherState.appendChild(state);
                    weatherState.appendChild(weatherIcon);
                    weatherState.appendChild(details);


                    dateDay.textContent = stringDate;

                    temp.textContent = 'T° : ' + parseFloat(data.list[j].main.temp - 273).toFixed(2) + '°C';
                    tempmin.textContent = 'T° min. : ' + parseFloat(data.list[j].main.temp_min - 273).toFixed(2) + '°C';
                    tempmax.textContent = 'T° max. : ' + parseFloat(data.list[j].main.temp_max - 273).toFixed(2) + '°C';
                    state.textContent = `Weather : ${data.list[j].weather[0].description}`;

                    details.addEventListener('click', function() {
                        toggleTemperatureChart(data, i, dayContainer);
                    });

                    dayContainer.appendChild(dateDay);
                    dayContainer.appendChild(weatherState);

                    weatherContainer.appendChild(dayContainer);
                }
            } catch (error) {
                const errorMessage = document.createElement('p');
                errorMessage.textContent = `Error: ${error.message}`;
                weatherContainer.appendChild(errorMessage);
                console.error('Error fetching weather data:', error);
            }
        }

        function removeHourContainer() {
            const hourContainer = document.querySelector('.hour-container');
            if (hourContainer) {
                hourContainer.remove();
            }
        }

        function toggleTemperatureChart(data, dayIndex, detailsContainer) {
            const chartCanvas = detailsContainer.querySelector('canvas.chart');

            if (chartCanvas) {
                detailsContainer.removeChild(chartCanvas);
                detailsContainer.querySelector('.details span').textContent = "Show Details";
                detailsContainer.querySelector('.details').style.marginLeft = "11%";

            } else {
                generateTemperatureChart(data, dayIndex, detailsContainer);
                detailsContainer.querySelector('.details span').textContent = "Close Details";
                detailsContainer.querySelector('.details').style.marginLeft = "8%";
            }
        }

        function generateTemperatureChart(data, dayIndex, detailsContainer) {
            const temperatures = [];
            for (let i = dayIndex * 8; i < (dayIndex + 1) * 8; i++) {
                temperatures.push(parseFloat(data.list[i].main.temp - 273).toFixed(2));
            }

            const chartCanvas = document.createElement('canvas');
            chartCanvas.classList.add('chart');
            chartCanvas.width = 400;
            chartCanvas.height = 200;

            const chartCtx = chartCanvas.getContext('2d');
            const body = document.querySelector('body')

            const temperatureChart = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: ['12:00', '15:00', '18:00', '21:00', '00:00', '03:00', '06:00', '09:00'],
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: temperatures,
                        borderColor: (body.classList.contains('darkmode')) ? '#FAC921' : 'rgb(5, 6, 45)',
                        backgroundColor: 'rgba(0, 0, 255, 0.1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            detailsContainer.appendChild(chartCanvas);
        }

        function getFormattedDate(dateString) {
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const date = new Date(dateString);
            const monthIndex = date.getMonth();
            const day = date.getDate();

            return `${months[monthIndex]} ${day}`;
        }

        function getFormattedHour(dateString) {
            const date = new Date(dateString);
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();

            const formattedHours = (hours < 10) ? `0${hours}` : hours;
            const formattedMinutes = (minutes < 10) ? `0${minutes}` : minutes;
            const formattedSeconds = (seconds < 10) ? `0${seconds}` : seconds;

            return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
        }

        fetchWeatherData();

    });



} 