function showLoader() {
    Swal.fire({
        title: '',
        html: '<div class="loader"></div>',
        showConfirmButton: false,
        allowOutsideClick: false,
        onBeforeOpen: () => {
        Swal.showLoading();
        },
    });
}
showLoader();
function hideLoader() {
    Swal.close();
}  

document.addEventListener("DOMContentLoaded", () => {       
    const filePath = '../assets/src/datos.json';


    function handleFetchError(error) {
        console.log(error);
    }

    fetch(filePath, {
        mode: 'no-cors' 
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON.');
            }
            return response.json();
        })
            .then(data => {

                document.querySelector('.influencer-foto').style.backgroundImage = `url('${data.influcard.account_picture}')`;
                document.getElementById('influencer_name').innerHTML = data.influcard.name;
                document.getElementById('influencer_username').innerHTML = data.influcard.username;
                
                const countryData = data.influcard.top_countries_formated.find(country => country.country_short == data.influcard.country);
                if (countryData) {
                    data.influcard.country_flag = countryData.href;
                    data.influcard.country_short = countryData.country_short;
                }
                if (data.influcard.gender == 1){
                    data.influcard.gender = 'Mujer';
                } else {
                    data.influcard.gender = 'Hombre';
                }
                
                document.getElementById('influencer_info').innerHTML = `
                    <img class="flag" src="${data.influcard.country_flag}" alt="Bandera">
                    <span>${data.influcard.country_short} - ${data.influcard.gender}, ${data.influcard.age} años</span>
                `;
                document.getElementById('last_update').innerHTML = 'Datos actualizados a ' + data.influcard.lastupdate;
                

            let texto = '';

            const reachPercent = Math.round(data.influcard.reach);
            const relevancePercent = Math.round(data.influcard.relevance);
            const resonancePercent = Math.round(data.influcard.resonance);

            function createChart(div, percent, color) {
                let chart = am4core.create(div, am4charts.PieChart);

                chart.innerRadius = am4core.percent(60); 

                let data = [{
                    "category": "Completado",
                    "value": percent, 
                    "color": am4core.color(color) 
                }, {
                    "category": "Restante",
                    "value": percent - 100, 
                    "color": am4core.color("lightgrey") 
                }];

                chart.data = data;

                let series = chart.series.push(new am4charts.PieSeries());
                series.dataFields.value = "value";
                series.dataFields.category = "category";
                series.slices.template.propertyFields.fill = "color";

                series.labels.template.text = "";
                series.ticks.template.disabled = true;

                let label = series.createChild(am4core.Label);
                label.text = percent + "%"; 
                label.horizontalCenter = "middle";
                label.verticalCenter = "middle";
                label.fontSize = 12;
            }
            createChart(chartdiv1, reachPercent, 'rgb(107, 139, 245);');
            createChart(chartdiv2, relevancePercent, 'orange')
            createChart(chartdiv3, resonancePercent, 'lightblue')

            
              
            

            document.getElementById('totalAudience').innerHTML = data.influcard.followers_formated;
            document.getElementById('totalFakeFollowers').innerHTML = data.influcard.fake_followers_formated + " %";
            document.getElementById('totalRealAudience').innerHTML = data.influcard.real_followers_formated;

            Object.keys(data.ages_array).forEach(age => {
                const ageDiv = document.createElement('div');
                ageDiv.classList.add('agre-distribution-chart');
            
                const ageSpan = document.createElement('span');
                ageSpan.classList.add('fw-400');
                ageSpan.innerHTML = data.ages_array[age];
            
                const agePercentKey = `insight_perc_${age}`;
                const agePercentRounded = data.influcard[agePercentKey].toFixed(2);
                        
                const progressDiv = document.createElement('div');
                progressDiv.classList.add('progress', 'ic-progress');

                const progressBar = document.createElement('div');
                progressBar.classList.add('progress-bar');
                progressBar.style.backgroundColor = '#459BEA';
                progressBar.style.width = `${agePercentRounded}%`;

                progressDiv.appendChild(progressBar);

                const valueSpan1 = document.createElement('span');
                valueSpan1.textContent = `${agePercentRounded}%`;

                

                ageDiv.appendChild(ageSpan);
                ageDiv.appendChild(progressDiv);
                ageDiv.appendChild(valueSpan1);

                document.getElementById("age-distribution-container").appendChild(ageDiv);
            });
        
            data.influcard.top_countries_formated.forEach(pais =>{
                const countryDiv = document.createElement('div');
                countryDiv.classList.add('country-distribution-chart');

                const flagDiv = document.createElement('div');
                flagDiv.classList.add('country-flag');

                const img = document.createElement('img');
                img.src = ".."+pais.href;
                img.alt = "bandera";
                img.classList.add('flag');


                const countrySpan = document.createElement('span');
                countrySpan.textContent = pais.country_short;

                flagDiv.appendChild(img);
                flagDiv.appendChild(countrySpan);

                const progressDiv = document.createElement('div');
                progressDiv.classList.add('progress', 'ic-progress');

                const progressBar = document.createElement('div');
                progressBar.classList.add('progress-bar');
                progressBar.style.backgroundColor = '#FF5E5C';
                progressBar.style.width = `${pais.value}%`;

                progressDiv.appendChild(progressBar);

                const valueSpan1 = document.createElement('span');
                valueSpan1.textContent = pais.value + ' %';

                

                countryDiv.appendChild(flagDiv);
                countryDiv.appendChild(progressDiv);
                countryDiv.appendChild(valueSpan1);

                document.getElementById("container-country").appendChild(countryDiv);

            })

            am4core.ready(function() {
    
                am4core.useTheme(am4themes_animated);
                
                const chart = am4core.create("gender_chart_doughnut", am4charts.PieChart);
                chart.hiddenState.properties.opacity = 1; 
                
                const series = chart.series.push(new am4charts.PieSeries());
                series.dataFields.value = "value";
                series.dataFields.radiusValue = "value";
                series.dataFields.category = "gender";
                
                series.colors.list = [
                    am4core.color("#28b5ff"),
                    am4core.color("#E84393")
                ];
                                
                
                series.slices.template.cornerRadius = 6;
                series.labels.template.disabled = true;
                series.ticks.template.disabled = true;
                series.slices.template.tooltipText = "";
                
                series.hiddenState.properties.endAngle = -90;
                
                chart.legend = new am4charts.Legend();
                chart.legend.valueLabels.template.fontSize = 14; 
                chart.legend.valueLabels.template.fontWeight = "500";
                chart.legend.labels.template.fontSize = 14; 
                chart.legend.labels.template.fontWeight = "500";

                chart.numberFormatter.precision=-1;
                    chart.numberFormatter.decimalSeparator=".";
                    chart.numberFormatter.thousandsSeparator="";
                    chart.legend.valueLabels.template.text = '{value}%'
                    
                const markerTemplate = chart.legend.markers.template;
                markerTemplate.width = 10;
                markerTemplate.height = 10;
        
                chart.data = [
                    {
                        gender: "Hombres",
                        value: data.influcard.insight_perc_m  },
                    {
                        gender: "Mujeres",
                        value: data.influcard.insight_perc_f   }
                ];
                
            });

            am4core.ready(function () {

                am4core.useTheme(am4themes_animated);
            
                const chart = am4core.create("categories_chart_doughnut", am4charts.XYChart);
                chart.data = data.influcard.post_territory;
                chart.padding(10, 10, 10, 10);
            
                const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.dataFields.category = "category";
                categoryAxis.renderer.minGridDistance = 1;
                categoryAxis.renderer.inversed = true;
                categoryAxis.renderer.grid.template.disabled = true;
                categoryAxis.renderer.labels.template.fontSize = 14;
                categoryAxis.renderer.labels.template.fontWeight = 500;
            
                const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                valueAxis.min = 0;
            
            
                const series = chart.series.push(new am4charts.ColumnSeries());
                series.dataFields.categoryY = "category";
                series.dataFields.valueX = "value";
                series.tooltipText = "{valueX.value}"
                series.columns.template.strokeOpacity = 0;
                series.columns.template.column.cornerRadiusBottomRight = 5;
                series.columns.template.column.cornerRadiusTopRight = 5;
                series.columns.template.propertyFields.fill = "color";
                series.fillOpacity = 0.6;
            
                const labelBullet = series.bullets.push(new am4charts.LabelBullet())
                labelBullet.label.horizontalCenter = "right";
                labelBullet.label.text = "{values.valueX.workingValue.formatNumber('#.0as')}%";
                labelBullet.label.fontWeight = 500;
            });

            am4core.ready(function () {

                am4core.useTheme(am4themes_animated);
            
                const chart = am4core.create("pie_post_hour_range", am4charts.XYChart);
                chart.hiddenState.properties.opacity = 0; 
            
            
                chart.data = JSON.parse(data.influcard.post_moment_json);
            
                const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "type";
                categoryAxis.renderer.grid.template.strokeOpacity = 0;
                categoryAxis.renderer.minGridDistance = 0;
                categoryAxis.renderer.labels.template.dx = -40;
                categoryAxis.renderer.minWidth = 120;
                categoryAxis.renderer.tooltip.dx = -10;
                categoryAxis.numberFormatter.numberFormat = "#.#'%'";
                categoryAxis.renderer.labels.template.fontSize = 14;
                categoryAxis.renderer.labels.template.fontWeight = 500;
            
                const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.inside = true;
                valueAxis.renderer.labels.template.fillOpacity = 0;
                valueAxis.renderer.grid.template.strokeOpacity = 0;
                valueAxis.min = 0;
                valueAxis.cursorTooltipEnabled = false;
                valueAxis.renderer.baseGrid.strokeOpacity = 0;
                valueAxis.renderer.labels.template.dy = 20;
            
            
                const series = chart.series.push(new am4charts.ColumnSeries);
                series.dataFields.valueX = "value";
                series.dataFields.categoryY = "type";
                series.tooltipText = "{valueX.value} ";
                series.tooltip.pointerOrientation = "vertical";
                series.tooltip.dy = -10;
                series.columnsContainer.zIndex = 100;
                series.columns.template.propertyFields.fill = "color";
            
                const columnTemplate = series.columns.template;
                columnTemplate.height = am4core.percent(30);
                columnTemplate.maxHeight = 30;
                columnTemplate.column.cornerRadius(60, 10, 60, 10);
                columnTemplate.strokeOpacity = 0;
            
            
                series.mainContainer.mask = undefined;
            
                const cursor = new am4charts.XYCursor();
                chart.cursor = cursor;
                cursor.lineX.disabled = true;
                cursor.lineY.disabled = true;
                cursor.behavior = "none";
            
                const bullet = columnTemplate.createChild(am4charts.CircleBullet);
                bullet.circle.radius = 10;
                bullet.valign = "middle";
                bullet.align = "left";
                bullet.isMeasured = true;
                bullet.interactionsEnabled = false;
                bullet.horizontalCenter = "right";
                bullet.interactionsEnabled = false;
            
                const hoverState = bullet.states.create("hover");
                const outlineCircle = bullet.createChild(am4core.Circle);
                outlineCircle.adapter.add("radius", function (radius, target) {
                    const circleBullet = target.parent;
                    return circleBullet.circle.pixelRadius + 5;
                })
            
                const image = bullet.createChild(am4core.Image);
                image.width = 20;
                image.height = 20;
                image.horizontalCenter = "middle";
                image.verticalCenter = "middle";
                image.propertyFields.href = "href";
            
                image.adapter.add("mask", function (mask, target) {
                    const circleBullet = target.parent;
                    return circleBullet.circle;
                })
            });

            function extractAccountNumber(url) {
                let match = url.match(/account=(\d+)/);
                if (match && match[1]) {
                    return parseInt(match[1]);
                }
                return null;
}

            data.influcard.brands_images.forEach(function (brand) {
                let accountNumber = extractAccountNumber(brand.image);
                
                if (data.influcard.brands_selected_arrray.includes(accountNumber)) {
                    let brandDiv = document.createElement('div');
                    brandDiv.classList.add('brand');

                    let brandImage = document.createElement('img');
                    brandImage.src = brand.image;
                    brandImage.alt = brand.name;

                    let brandName = document.createElement('span');
                    brandName.innerHTML = brand.name;
                    brandName.classList.add('fw-400');


                    brandDiv.appendChild(brandImage);
                    brandDiv.appendChild(brandName);
                    

                    document.getElementById('brands_container').appendChild(brandDiv);
                }
            });

            document.getElementById('audience').innerHTML = data.influcard.followers_formated;
            document.getElementById('reach').innerHTML = data.influcard.reach_formated;
            document.getElementById('impressions').innerHTML = data.influcard.impressions_formated;
            document.getElementById('impressions-reach').innerHTML = data.influcard.ir_alcance + '%';
            document.getElementById('impressions-audience').innerHTML = data.influcard.ir_audiencia + '%';

            document.getElementById('reproductions').innerHTML = data.influcard.vplays_formated;
            document.getElementById('reproductions-reach').innerHTML = data.influcard.vr_alcance + '%';
            document.getElementById('reproductions-audience').innerHTML = data.influcard.vr_audiencia + '%';
           
            document.getElementById('engagement').innerHTML = data.influcard.engagement_formated;
            document.getElementById('engagement-reach').innerHTML = data.influcard.er_alcance + '%';
            document.getElementById('engagement-audience').innerHTML = data.influcard.er_audiencia + '%';

            

            am4core.ready(function () {
               
                am4core.useTheme(am4themes_animated);
            
            
                var chart = am4core.create("bar_engagement_hour_range", am4charts.XYChart);
            
                chart.data = JSON.parse(data.influcard.post_day_json);

                var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "day";
                categoryAxis.renderer.grid.template.location = 0;
                categoryAxis.renderer.minGridDistance = 30;
                categoryAxis.renderer.grid.template.disabled = true;
            
                categoryAxis.tooltip.disabled = true;
                categoryAxis.renderer.labels.template.horizontalCenter = "middle";
                categoryAxis.renderer.labels.template.verticalCenter = "middle";
            
                var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.renderer.minWidth = 50;
                valueAxis.numberFormatter.numberFormat = "#.#'%'";
            
                var series = chart.series.push(new am4charts.ColumnSeries());
                series.sequencedInterpolation = true;
                series.dataFields.valueY = "rate";
                series.dataFields.categoryX = "day";
                series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
                series.columns.template.strokeWidth = 0;
            
                series.tooltip.pointerOrientation = "vertical";
                series.columns.template.column.fillOpacity = 0.8;
            
                var hoverState = series.columns.template.column.states.create("hover");
                hoverState.properties.fillOpacity = 1;
            
                series.columns.template.adapter.add("fill", function (fill, target) {
                    return chart.colors.getIndex(target.dataItem.index);
                });
            
                chart.cursor = new am4charts.XYCursor();

                
                
            });
            hideLoader();
          

            document.getElementById('generateImageBtn').addEventListener('click', function() {
                // Tu clave de API de Screenshotlayer
                const apiKey = '86977a68b8d7d0e9cc1eefebf348ac49';
    
                // URL del sitio web que deseas capturar
                const urlToCapture = window.location.href; // Captura la URL actual
    
                // Tamaño personalizado de la captura de pantalla (1720x900)
                const width = 1720;
                const height = 900;
    
                // Especifica el formato de la imagen como "jpeg"
                const format = 'PNG';
    
                // Crea la URL de la API de Screenshotlayer con los parámetros personalizados
                const apiUrl = `https://api.screenshotlayer.com/capture?access_key=${apiKey}&url=${urlToCapture}&viewport=${width}x${height}&format=${format}`;
    
                // Crea un enlace temporal para cargar la imagen
                const image = new Image();
    
                // Asigna la URL de la API a la imagen
                image.src = apiUrl;
    
                // Escucha el evento "load" para asegurarte de que la imagen se ha cargado completamente
                image.onload = function() {
                    // Crea un enlace de descarga para la captura de pantalla
                    const downloadLink = document.createElement('a');
                    downloadLink.href = image.src;
                    downloadLink.download = 'captura.jpeg'; // Nombre de archivo de descarga (extensión .jpeg)
    
                    // Simula un clic en el enlace de descarga
                    downloadLink.click();
                };
            });
            
            
            
        })  
        .catch(handleFetchError);
});







