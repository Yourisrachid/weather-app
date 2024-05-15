export function weather() {

    document.addEventListener("DOMContentLoaded", function() {

        const button = document.querySelector('#submitBtn')

        

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
            const cityListContainer = document.getElementById('cityList');
            cityListContainer.innerHTML = '';
            filteredCities.forEach(city => {
                const cityName = city.city;
                const cityElement = document.createElement('div');
                cityElement.textContent = cityName;
                cityElement.addEventListener('click', () => {
                    document.getElementById('cityInput').value = cityName;
                    cityListContainer.innerHTML = '';
                });
                cityListContainer.appendChild(cityElement);
            });
        }

        const weatherForm = document.getElementById('weatherForm');
            
        weatherForm.addEventListener('submit', function(event) {
            event.preventDefault();
        
            const cityInput = document.getElementById('cityInput');
            const city = cityInput.value.trim();
        
            if (city) {
                fetchWeatherData(city);
            } else {
                console.error('City is empty');
            }
        });
        

        document.getElementById('cityInput').addEventListener('input', async (event) => {
            const inputValue = event.target.value;
            if (inputValue.length > 1) {
                const cities = await fetchCities();
                const filteredCities = filterCities(inputValue, cities);
                displayCities(filteredCities);
            } else {
                document.getElementById('cityList').innerHTML = '';
            }
        });



            function fetchWeatherData() {

                fetch(` https://api.openweathermap.org/data/2.5/forecast?q=${document.getElementById('cityInput').value}&appid=f569f7c440e13c5fe0bccce62f6283f8`)

                .then((response) => response.json())
                .then((data) => {


                    const todayWeather = document.querySelector('.weather');  

                    let j = 0;

                    for (let i = 0; i < 5; i++) {

                        if (i != 0) {
                            let j =+ 8;
                        }

                        console.log(j)
                        console.log(i)

                                    
                        const date = new Date(data.list[j].dt_txt);
                        const utcDate = date.toUTCString()
                        const utcDateSlice = utcDate.substring(0, utcDate.length - 4)
                        const newDate = new Date(utcDateSlice)

                
                        const stringDate = getFormattedDate(date.toISOString());
                        const stringHour = getFormattedHour(date.toISOString());
                
                        const dateDay = document.createElement('p');
                        const dateHour = document.createElement('p');
                        const weatherState = document.createElement('div')
                        const temp = document.createElement('p')
                        const tempmin = document.createElement('p')
                        const tempmax = document.createElement('p')
                        const state = document.createElement('p')
                        const details = document.createElement('button')
                        details.classList.add('details')

                        details.textContent = "Show next days details"

                        weatherState.appendChild(temp)
                        weatherState.appendChild(tempmin)
                        weatherState.appendChild(tempmax)
                        weatherState.appendChild(state)
                        weatherState.appendChild(details)


                
                        dateDay.textContent = stringDate;
                        dateHour.textContent = stringHour;

                    
                        temp.textContent ='Temperature : ' + parseFloat(data.list[j].main.temp-273).toFixed(2) + '°C'
                        tempmin.textContent ='Temperature min. : ' +  parseFloat(data.list[j].main.temp_min-273).toFixed(2) + '°C'
                        tempmax.textContent ='Temperature max. : ' +  parseFloat(data.list[j].main.temp_max-273).toFixed(2) + '°C'
                        state.textContent = `Weather : ${data.list[j].weather[0].description}`
                
                        todayWeather.appendChild(dateDay);
                        todayWeather.appendChild(dateHour);
                        todayWeather.appendChild(weatherState);

                        console.log(data.list[0].dt_txt)


                    }


                    details.addEventListener('click', function() {


                    })

                })
                .catch((error) => {
                    console.error('Error fetching weather data:', error);
                });
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
            
                const formattedHours = (hours < 10) ? `0${hours}` : hours;
                const formattedMinutes = (minutes < 10) ? `0${minutes}` : minutes;
            
                return `${formattedHours}:${formattedMinutes}`;
            }

    })

}