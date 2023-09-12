document.addEventListener("DOMContentLoaded", function() {       
    const filePath = '../assets/src/datos.json';
    const main = document.getElementsByTagName("main")[0];
    let rrssSelectIcon;

    function createInfluencerElement(influencer) {
        const articleElement = document.createElement("article");
        articleElement.className = "influencer-card";
        articleElement.innerHTML = `
            <header>
                <a href="/views/ficha.html" class="profile-pick" style="background-image: url('${influencer.image}')" ></a>
                <div>
                    <i class="${rrssSelectIcon}"></i>
                    <span>${influencer.username}</span>
                </div>
                <p>${influencer.gender}, ${influencer.age} años</p>
                <div class="nacionalidad"> 
                    <img class="flag" src="${influencer.country_flag}" alt="">
                    <span>${influencer.country_name}</span>
                </div>
                <p class="marquee-container">
                    <span class="marquee">
                        ${influencer.interests}
                    </span>
                </p>
            </header>
            <aside>
                <div class="title">
                    <h1>${influencer.name}</h1>
                    <i class="fa-solid fa-bars"></i>
                </div>
                <ul>
                    <li>
                        <div>
                            <i class="fa-solid fa-people-group"></i>
                            <span>Audiencia:</span>
                        </div>
                        <p>${influencer.followers}</p>
                    </li>
                    <li>
                        <div>
                            <i class="fa-solid fa-user-minus"></i>
                            <span>Fakes:</span>
                        </div>
                        <p>${influencer.fakes}</p>
                    </li>
                    <li>
                        <div>
                            <i class="fa-sharp fa-solid fa-heart"></i>                            
                            <span>Engagement:</span>
                        </div>
                        <p>${influencer.engagement}</p>
                    </li>
                    <li>
                        <div>
                            <div class="heart-pulse">&#x2665</div>
                            <span>Eng Ratio:</span>
                        </div>
                        <p>${influencer.engratio}</p>
                    </li>
                    <li>
                        <div>
                        <i class="fa-solid fa-eye"></i>
                            <span>Impresiones:</span>
                        </div>
                        <p>${influencer.impresions}</p>
                    </li>
                </ul>
            </aside>
        `;
        
        return articleElement;
    }

    function handleFetchError(error) {
        console.log(error);
    }

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON.');
            }
            return response.json();
        })
        .then(data => {
            const countryData = data.influcard.top_countries_formated.find(country => country.country_short == data.influcard.country);
            const rrssFindName = Object.keys(data.rrss_name).find(key => key === data.influcard.channel);
            
            if (rrssFindName) {
            const rrssFindIcon = Object.keys(data.rrss_icons).find(key => key === rrssFindName);
             rrssSelectIcon = data.rrss_icons[rrssFindIcon];
            } 
            
            
            if (countryData) {
                data.influcard.country_flag = countryData.href;
                data.influcard.country_name = countryData.country;
            }
            if (data.influcard.gender == 1){
                data.influcard.gender = 'Mujer';
            }else{
                data.influcard.gender = 'Hombre';
            }
           

            const influencer = {
                image: data.influcard.account_picture,
                name: data.influcard.name,      
                username: data.influcard.username,
                age: data.influcard.age, 
                gender: data.influcard.gender,
                interests: data.influcard.interests,
                country: data.influcard.country, 
                followers: data.influcard.followers,
                engagement: data.influcard.avg_engagement_formated,
                engratio: data.influcard.engratio,
                impresions: data.influcard.avg_impressions_formated, 
                fakes: data.influcard.followers_fake,
                country_flag: data.influcard.country_flag,
                country_name: data.influcard.country_name
            };

            for (let i = 1; i <= 6; i++){
                
                const article = createInfluencerElement(influencer);
                main.appendChild(article);
                const divElement = document.createElement("div");
                divElement.className = "influencer-card-info";
                article.appendChild(divElement);
                divElement.style.backgroundImage = `url('${data.influcard.account_picture}')`;
            }
            
        })
        .catch(handleFetchError);
       
});
