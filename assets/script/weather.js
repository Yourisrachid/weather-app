export function weather() {
    document.addEventListener("DOMContentLoaded", function() {

        const button = document.querySelector('#submitBtn');
        const cityInput = document.getElementById('cityInput');
        const cityListContainer = document.getElementById('cityList');
        const weatherContainer = document.querySelector('.weather');

        async function fetchCities() {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities');
                const data = await response.json();
                return data.data;
            } catch (error) {
                console.error('Error fetching cities:', error);
                return [];
            }
        }

        function filterCities(inputValue, cities) {
            return cities.filter(city => city.city.toLowerCase().startsWith(inputValue.toLowerCase()));
        }

        function displayCities(filteredCities) {
            cityListContainer.innerHTML = '';
            filteredCities.forEach(city => {
                const cityName = city.city;
                const cityElement = document.createElement('div');
                cityElement.textContent = cityName;
                cityElement.addEventListener('click', () => {
                    cityInput.value = cityName;
                    cityListContainer.innerHTML = '';
                });
                cityListContainer.appendChild(cityElement);
            });
        }

        const weatherForm = document.getElementById('weatherForm');
        weatherForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const city = cityInput.value.trim();
            if (city) {
                fetchWeatherData(city);
            } else {
                console.error('City is empty');
            }
        });

        cityInput.addEventListener('input', async (event) => {
            const inputValue = event.target.value;
            if (inputValue.length > 1) {
                const cities = await fetchCities();
                const filteredCities = filterCities(inputValue, cities);
                displayCities(filteredCities);
            } else {
                cityListContainer.innerHTML = '';
            }
        });

        document.addEventListener('click', function(event) {
            if (event.target !== cityInput && !cityListContainer.contains(event.target)) {
                cityListContainer.innerHTML = '';
            }
        });

        async function fetchWeatherData(city) {
            weatherContainer.innerHTML = '';
            removeHourContainer();

            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f569f7c440e13c5fe0bccce62f6283f8`);
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
                    dateHour.textContent = stringHour;
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
                    const weatherState = document.createElement('div');
                    const temp = document.createElement('p');
                    const tempmin = document.createElement('p');
                    const tempmax = document.createElement('p');
                    const state = document.createElement('p');
                    const details = document.createElement('button');
                    details.classList.add('details');

                    details.textContent = "Show Details";

                    const weatherIcon = document.createElement('img');
                    weatherIcon.src = `http://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png`;
                    weatherIcon.alt = data.list[j].weather[0].description;

                    weatherState.appendChild(temp);
                    weatherState.appendChild(tempmin);
                    weatherState.appendChild(tempmax);
                    weatherState.appendChild(state);
                    weatherState.appendChild(details);
                    weatherState.appendChild(weatherIcon);

                    dateDay.textContent = stringDate;

                    temp.textContent = 'Temperature : ' + parseFloat(data.list[j].main.temp - 273).toFixed(2) + '°C';
                    tempmin.textContent = 'Temperature min. : ' + parseFloat(data.list[j].main.temp_min - 273).toFixed(2) + '°C';
                    tempmax.textContent = 'Temperature max. : ' + parseFloat(data.list[j].main.temp_max - 273).toFixed(2) + '°C';
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
                detailsContainer.querySelector('.details').textContent = "Show Details";
            } else {
                generateTemperatureChart(data, dayIndex, detailsContainer);
                detailsContainer.querySelector('.details').textContent = "Close Details";
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

            const temperatureChart = new Chart(chartCtx, {
                type: 'line',
                data: {
                    labels: ['12:00', '15:00', '18:00', '21:00', '00:00', '03:00', '06:00', '09:00'],
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: temperatures,
                        borderColor: 'blue',
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

    });
}
