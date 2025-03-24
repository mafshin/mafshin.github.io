// Country data with Persian translations
const countries_data = [
    {
        name: "ایران",
        englishName: "Iran",
        code: "ir",
        region: "آسیا",
        capital: "تهران",
        population: "85 میلیون",
        language: "فارسی",
        currency: "ریال",
        area: "1,648,195 کیلومتر مربع",
        funFact: "ایران دارای یکی از قدیمی‌ترین تمدن‌های جهان است و پرسپولیس که در سال 518 قبل از میلاد ساخته شده، یکی از آثار باستانی مشهور آن است."
    },
    {
        name: "مصر",
        englishName: "Egypt",
        code: "eg",
        region: "آفریقا",
        capital: "قاهره",
        population: "104 میلیون",
        language: "عربی",
        currency: "پوند مصر",
        area: "1,001,450 کیلومتر مربع",
        funFact: "اهرام مصر در گیزا از عجایب هفتگانه جهان باستان هستند و اهرام بزرگ گیزا تنها عجیبه‌ای است که تا امروز باقی مانده است."
    },
    {
        name: "چین",
        englishName: "China",
        code: "cn",
        region: "آسیا",
        capital: "پکن",
        population: "1.4 میلیارد",
        language: "چینی ماندارین",
        currency: "یوان",
        area: "9,596,960 کیلومتر مربع",
        funFact: "دیوار بزرگ چین با طول بیش از 21,000 کیلومتر، طولانی‌ترین سازه ساخته شده توسط انسان در جهان است."
    },
    {
        name: "هند",
        englishName: "India",
        code: "in",
        region: "آسیا",
        capital: "دهلی نو",
        population: "1.38 میلیارد",
        language: "هندی، انگلیسی",
        currency: "روپیه",
        area: "3,287,263 کیلومتر مربع",
        funFact: "تاج محل در آگرا، یکی از عجایب هفتگانه جدید جهان است که توسط شاه جهان برای همسرش ممتاز محل ساخته شد."
    },
    {
        name: "روسیه",
        englishName: "Russia",
        code: "ru",
        region: "آسیا/اروپا",
        capital: "مسکو",
        population: "144 میلیون",
        language: "روسی",
        currency: "روبل",
        area: "17,098,246 کیلومتر مربع",
        funFact: "روسیه بزرگترین کشور جهان است و مساحت آن تقریباً دو برابر کشور دوم (کانادا) است."
    },
    {
        name: "برزیل",
        englishName: "Brazil",
        code: "br",
        region: "آمریکای جنوبی",
        capital: "برازیلیا",
        population: "213 میلیون",
        language: "پرتغالی",
        currency: "رئال",
        area: "8,515,767 کیلومتر مربع",
        funFact: "جنگل‌های آمازون که بخش بزرگی از آن در برزیل قرار دارد، بیش از 20 درصد اکسیژن جهان را تولید می‌کند."
    },
    {
        name: "ایالات متحده آمریکا",
        englishName: "United States",
        code: "us",
        region: "آمریکای شمالی",
        capital: "واشنگتن دی.سی.",
        population: "331 میلیون",
        language: "انگلیسی",
        currency: "دلار",
        area: "9,833,517 کیلومتر مربع",
        funFact: "گرند کانیون در ایالت آریزونا یکی از عمیق‌ترین دره‌های جهان است و حدود 446 کیلومتر طول دارد."
    },
    {
        name: "آلمان",
        englishName: "Germany",
        code: "de",
        region: "اروپا",
        capital: "برلین",
        population: "83 میلیون",
        language: "آلمانی",
        currency: "یورو",
        area: "357,022 کیلومتر مربع",
        funFact: "در آلمان بیش از 1,500 نوع سوسیس و بیش از 1,000 نوع نان مختلف تولید می‌شود."
    },
    {
        name: "ژاپن",
        englishName: "Japan",
        code: "jp",
        region: "آسیا",
        capital: "توکیو",
        population: "126 میلیون",
        language: "ژاپنی",
        currency: "ین",
        area: "377,975 کیلومتر مربع",
        funFact: "ژاپن از بیش از 6,800 جزیره تشکیل شده است و به دلیل قرار گرفتن روی کمربند آتشفشانی، حدود 110 آتشفشان فعال دارد."
    },
    {
        name: "استرالیا",
        englishName: "Australia",
        code: "au",
        region: "اقیانوسیه",
        capital: "کانبرا",
        population: "25 میلیون",
        language: "انگلیسی",
        currency: "دلار استرالیا",
        area: "7,692,024 کیلومتر مربع",
        funFact: "استرالیا تنها کشوری است که یک قاره کامل را پوشش می‌دهد و 80 درصد حیوانات و گیاهان آن منحصر به فرد و بومی این کشور هستند."
    },
    {
        name: "فرانسه",
        englishName: "France",
        code: "fr",
        region: "اروپا",
        capital: "پاریس",
        population: "67 میلیون",
        language: "فرانسوی",
        currency: "یورو",
        area: "643,801 کیلومتر مربع",
        funFact: "برج ایفل که نماد پاریس و فرانسه است، در ابتدا قرار بود فقط برای 20 سال بماند، اما به دلیل محبوبیت، حفظ شد."
    },
    {
        name: "ترکیه",
        englishName: "Turkey",
        code: "tr",
        region: "آسیا/اروپا",
        capital: "آنکارا",
        population: "84 میلیون",
        language: "ترکی",
        currency: "لیر",
        area: "783,356 کیلومتر مربع",
        funFact: "استانبول تنها شهر بزرگ جهان است که در دو قاره مختلف (آسیا و اروپا) قرار دارد."
    },
    {
        name: "عربستان سعودی",
        englishName: "Saudi Arabia",
        code: "sa",
        region: "آسیا",
        capital: "ریاض",
        population: "34 میلیون",
        language: "عربی",
        currency: "ریال سعودی",
        area: "2,149,690 کیلومتر مربع",
        funFact: "عربستان سعودی بزرگترین کشور بدون رودخانه در جهان است."
    },
    {
        name: "کانادا",
        englishName: "Canada",
        code: "ca",
        region: "آمریکای شمالی",
        capital: "اتاوا",
        population: "38 میلیون",
        language: "انگلیسی، فرانسوی",
        currency: "دلار کانادا",
        area: "9,984,670 کیلومتر مربع",
        funFact: "کانادا دارای بیشترین طول ساحل در جهان است که حدود 202,080 کیلومتر می‌باشد."
    },
    {
        name: "مکزیک",
        englishName: "Mexico",
        code: "mx",
        region: "آمریکای شمالی",
        capital: "مکزیکوسیتی",
        population: "129 میلیون",
        language: "اسپانیایی",
        currency: "پزو",
        area: "1,964,375 کیلومتر مربع",
        funFact: "مکزیک مبدأ شکلات، ذرت و فلفل است و اولین بار کاکائو توسط تمدن مایا و آزتک در این منطقه کشت شد."
    },
];

// Main initialization function
document.addEventListener('DOMContentLoaded', function() {
    let width = 0;
    let height = 0;
    let currentCountry = null;
    let countriesList = document.getElementById('countryList');
    let countrySearch = document.getElementById('countrySearch');
    let regionFilter = document.getElementById('regionFilter');
    let countryInfo = document.getElementById('countryInfo');
    let countryInfoName = document.getElementById('countryName');
    let countryInfoBody = document.querySelector('.info-body');
    
    // Create map components
    const svg = d3.select('#map');
    const g = svg.append('g');
    
    // Setup zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });
    
    svg.call(zoom);
    
    // Load map data
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then((data) => {
            // Hide loading indicator
            document.querySelectorAll('.loading').forEach(el => el.style.display = 'none');
            
            // Update map dimensions
            updateMapDimensions();
            
            // Draw the map
            const countries = topojson.feature(data, data.objects.countries);
            drawMap(countries);
            
            // Populate country list
            populateCountryList();
            
            // Setup event listeners
            setupEventListeners();
        })
        .catch(error => {
            console.error('Error loading map data:', error);
        });
        
    // Draw the world map
    function drawMap(countries) {
        // Setup projection
        const projection = d3.geoNaturalEarth1()
            .fitSize([width, height], countries);
        
        const path = d3.geoPath()
            .projection(projection);
        
        // Draw countries
        g.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', path)
            .attr('data-name', d => d.properties.name)
            .on('click', function(event, d) {
                // Find country in our data
                const countryData = countries_data.find(country => 
                    country.englishName.toLowerCase() === d.properties.name.toLowerCase() ||
                    country.name.toLowerCase() === d.properties.name.toLowerCase()
                );
                
                if (countryData) {
                    selectCountry(countryData);
                    
                    // Highlight on map
                    d3.selectAll('.country').classed('active', false);
                    d3.select(this).classed('active', true);
                    
                    // Zoom to country
                    const bounds = path.bounds(d);
                    const dx = bounds[1][0] - bounds[0][0];
                    const dy = bounds[1][1] - bounds[0][1];
                    const x = (bounds[0][0] + bounds[1][0]) / 2;
                    const y = (bounds[0][1] + bounds[1][1]) / 2;
                    const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
                    const translate = [width / 2 - scale * x, height / 2 - scale * y];
                    
                    svg.transition()
                        .duration(750)
                        .call(zoom.transform, d3.zoomIdentity
                            .translate(translate[0], translate[1])
                            .scale(scale));
                }
            });
    }
    
        // Populate the country list sidebar
    function populateCountryList() {
        countriesList.innerHTML = '';
        
        const searchTerm = countrySearch.value.toLowerCase();
        const regionValue = regionFilter.value;
        
        const filteredCountries = countries_data.filter(country => {
            const matchesSearch = country.name.toLowerCase().includes(searchTerm);
            const matchesRegion = regionValue === '' || country.region.includes(regionValue);
            return matchesSearch && matchesRegion;
        });
        
        if (filteredCountries.length === 0) {
            const noResults = document.createElement('div');
            noResults.textContent = 'کشوری یافت نشد.';
            noResults.style.padding = '15px';
            noResults.style.textAlign = 'center';
            countriesList.appendChild(noResults);
            return;
        }
        
        filteredCountries.forEach(country => {
            const countryItem = document.createElement('div');
            countryItem.className = 'country-item';
            countryItem.setAttribute('data-name', country.name);
            
            // Add flag to country item
            const flagImg = document.createElement('img');
            flagImg.src = `https://flagcdn.com/${country.code}.svg`;
            flagImg.alt = `پرچم ${country.name}`;
            flagImg.className = 'country-list-flag';
            
            const countryName = document.createElement('span');
            countryName.textContent = country.name;
            
            countryItem.appendChild(flagImg);
            countryItem.appendChild(countryName);
            
            countryItem.addEventListener('click', () => {
                selectCountryFromList(country);
            });
            
            countriesList.appendChild(countryItem);
        });
    }
    
    // Select a country from the list
    function selectCountryFromList(country) {
        // Update UI for list item
        document.querySelectorAll('.country-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const selectedItem = document.querySelector(`.country-item[data-name="${country.name}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        
        // Find and highlight on map
        const mapCountry = d3.selectAll('.country').filter(function(d) {
            return d && d.properties && (
                d.properties.name.toLowerCase() === country.englishName.toLowerCase() ||
                d.properties.name.toLowerCase() === country.name.toLowerCase()
            );
        });
        
        if (!mapCountry.empty()) {
            // Remove previous highlighting
            d3.selectAll('.country').classed('active', false);
            
            // Highlight this country
            mapCountry.classed('active', true);
            
            // Trigger click event to zoom to country
            mapCountry.dispatch('click');
        }
        
        // Show country info
        selectCountry(country);
    }
    
    // Display country information
    function selectCountry(country) {
        currentCountry = country;
        
        // Update info panel
        countryInfoName.textContent = country.name;
        
        // Build info content
        let infoHTML = `
            <div class="flag-container">
                <img src="https://flagcdn.com/${country.code}.svg" alt="پرچم ${country.name}" class="country-flag">
            </div>
            <div class="info-item"><span class="info-label">منطقه: </span>${country.region}</div>
            <div class="info-item"><span class="info-label">پایتخت: </span>${country.capital}</div>
            <div class="info-item"><span class="info-label">جمعیت: </span>${country.population}</div>
            <div class="info-item"><span class="info-label">زبان: </span>${country.language}</div>
            <div class="info-item"><span class="info-label">واحد پول: </span>${country.currency}</div>
            <div class="info-item"><span class="info-label">مساحت: </span>${country.area}</div>
            <div class="fun-fact">
                <span class="info-label">نکته جالب: </span>${country.funFact}
            </div>
        `;
        
        countryInfoBody.innerHTML = infoHTML;
        countryInfo.classList.add('active');
    }
    
    // Setup all event listeners
    function setupEventListeners() {
        // Search box input
        countrySearch.addEventListener('input', populateCountryList);
        
        // Region filter change
        regionFilter.addEventListener('change', populateCountryList);
        
        // Zoom control buttons
        document.getElementById('zoomIn').addEventListener('click', () => {
            svg.transition()
                .duration(300)
                .call(zoom.scaleBy, 1.3);
        });
        
        document.getElementById('zoomOut').addEventListener('click', () => {
            svg.transition()
                .duration(300)
                .call(zoom.scaleBy, 0.7);
        });
        
        // Reset map button
        document.getElementById('resetMap').addEventListener('click', resetMap);
        
        // Window resize
        window.addEventListener('resize', () => {
            updateMapDimensions();
            resetMap();
        });
    }
    
    // Reset map to initial state
    function resetMap() {
        // Reset zoom and transform
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
        
        // Clear selection
        d3.selectAll('.country').classed('active', false);
        document.querySelectorAll('.country-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Hide country info
        countryInfo.classList.remove('active');
        currentCountry = null;
    }
    
    // Update map dimensions based on container size
    function updateMapDimensions() {
        const mapContainer = document.querySelector('.map-container');
        width = mapContainer.clientWidth;
        height = mapContainer.clientHeight;
        
        svg.attr('width', width)
           .attr('height', height);
    }
    
    // Add a keyboard shortcut for accessibility (press 'r' to reset map)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'r' || e.key === 'ر') {
            resetMap();
        }
    });
});

// Function to change font - can be called externally
function changeFont(fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
}