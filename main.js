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
    const navLinks = headerData.nav.map(navItem => `<li><a href="${navItem.NavLink}" class="text-gray-800 font-bold hover:text-white">${navItem.linkTitle}</a></li>`).join('');
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
        slide.className = 'splide__slide flex flex-col md:flex-row items-center justify-center p-4 md:p-8 rounded-lg shadow-md';
        slide.dataset.bgGradient = block.bgGradient; 
        slide.innerHTML = `
            <div class="slide-content text-center md:text-left flex-1 pr-2 md:pr-5 md:mb-[16%]">
                <h2 class="text-2xl md:text-4xl font-bold mb-2 md:mb-4">${block.heading}</h2>
                <p class="text-lg mb-2 md:mb-4">${block.description}</p>
                <div class="price text-xl md:text-3xl font-bold mt-3 md:mt-5 mb-2 md:mb-3 text-white">${block.price}</div>
                <div class="social-icons flex items-center justify-center md:justify-start gap-3 md:gap-5 mt-5 md:mt-10">
                    ${createSocialIcons(socialIcons)}
                </div>
            </div>
            <div class="slide-image flex-1 text-center ml-0 md:ml-5 mr-0 md:mr-5 relative md:left-[12%]">
                <img src="${block.media}" alt="${block.heading}" class="w-80 h-auto max-w-[80%] mb-[36%]">
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
        arrows: true,
        heightRatio: 0.6,
        drag: true,
        breakpoints: {
      640: {
        heightRatio: 0.8,
      },
      768: {
        heightRatio: 1,
      },
      1024: {
        heightRatio: 0.6,
      },
    },
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