import './style.css';

fetch('content.json')
    .then(response => response.json())
    .then(jsonData => {
        loadHeader(jsonData.header);
        loadCarousel(jsonData.sectionBlocks, jsonData.socialIcons);
        initializeSplide(jsonData.sectionBlocks);
    })
    .catch(error => console.error('Error loading JSON data:', error));

function loadHeader(headerData) {
    const header = document.getElementById('site-header');
    const logo = header.querySelector('.logo-container img');
    logo.src = headerData.logo;
    
    const navMenu = document.getElementById('nav-menu');
    const navLinks = headerData.nav.map(navItem => `<li><a href="${navItem.NavLink}" class="text-gray-800 font-bold">${navItem.linkTitle}</a></li>`).join('');
    navMenu.innerHTML = navLinks;
    
    const signUpButton = document.getElementById('cta-signup');
    if (!headerData.showSignUpButton) {
        signUpButton.classList.add('hidden');
    }
}

function loadCarousel(sectionBlocks, socialIcons) {
    const carouselList = document.getElementById('carousel-list');
    sectionBlocks.forEach(block => {
        const slide = document.createElement('li');
        slide.className = 'splide__slide flex items-center justify-center p-5 rounded-lg shadow-md';
        slide.dataset.bgGradient = block.bgGradient; 
        slide.innerHTML = `
            <div class="slide-content flex-1 px-5 mb-[15%]">
                <h2 class="text-4xl font-bold mb-4">${block.heading}</h2>
                <p class="text-lg mb-4">${block.description}</p>
                <div class="price text-3xl font-bold mt-5 mb-3 text-white">${block.price}</div>
                <div class="social-icons flex gap-5 mt-10">
                    ${createSocialIcons(socialIcons)}
                </div>
            </div>
            <div class="slide-image flex-1 text-center left-[12%] relative">
                <img src="${block.media}" alt="${block.heading}" class="w-80 h-auto max-w-[80%] mb-[25%]">
            </div>
        `;
        carouselList.appendChild(slide);
    });
}

function createSocialIcons(socialIcons) {
    if (!socialIcons || !Array.isArray(socialIcons)) {
        return ''; 
    }

    return socialIcons.map(icon => `
        <a href="${icon.link}" class="inline-block w-10 h-10 text-center text-white no-underline text-2xl relative z-10 rounded-full transition-colors duration-300 border-2 border-white p-2 hover:border-none">
            <img src="${icon.icon}" alt="${icon.name}" class="w-full h-full object-contain">
        </a>
    `).join('');
}

function initializeSplide(sectionBlocks) {
    const splide = new Splide('.splide', {
        type: 'fade',
        autoplay: false,
        pauseOnHover: false,
        resetProgress: false,
        pagination: false,
        heightRatio: 0.5,
        classes: {
        arrows: 'splide__arrows custom-arrow-class',
        arrow : 'splide__arrow custom-arrow-class',
        prev  : 'splide__arrow--prev custom-prev-class',
        next  : 'splide__arrow--next custom-next-class',
    },
    });

    splide.on('mounted moved', function () {
        const activeSlide = splide.Components.Elements.slides[splide.index];
        const bgGradient = activeSlide.dataset.bgGradient;
        if (bgGradient) {
            document.body.style.background = bgGradient; 
        } else {
            console.error('No gradient data found for the active slide.');
        }
    });

    splide.mount();
}