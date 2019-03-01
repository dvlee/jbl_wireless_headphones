let isMobile = false;
let autoPlayAction;
let autoPlay = false;
let swiperOptions = {
    slidesPerView: 1,
    slideClass: 'products__item',
    spaceBetween: 65,
    loop: true
}

windowResize();

// Init fullpage plugin
new fullpage('#main', {
    autoScrolling:true,
    fitToSection: false,
    anchors: ['about', 'wireless', 'anc', 'technologies', 'sound'],
    afterLoad: function(origin, destination, direction){
        animateScene(destination.item.getAttribute('data-scene'), 2000);
    }
});

// Init mobile sliders
new Swiper('.mobile-swiper', swiperOptions)

// Events for player buttons
document.querySelector('.footer__player-btn--prev').addEventListener('click', btn => {
    enableAutoPlay(false);
    fullpage_api.moveSectionUp();
    ga('send', {
        hitType: 'event',
        eventCategory: 'panel',
        eventAction: 'click',
        eventLabel: 'back'
    });
});
document.querySelector('.footer__player-btn--next').addEventListener('click', btn => {
    enableAutoPlay(false);
    fullpage_api.moveSectionDown();
    ga('send', {
        hitType: 'event',
        eventCategory: 'panel',
        eventAction: 'click',
        eventLabel: 'foward'
    });
});
document.querySelector('.footer__player-btn--play').addEventListener('click', btn => {
    enableAutoPlay();
});

// Hide preloader when page loaded
window.addEventListener('load', () => {
    document.getElementById('preloader').style.display = 'none';
});

window.addEventListener('resize', windowResize);

// Click event for products button "подробнее"
document.querySelectorAll('.btn--move-to-last').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        let model = btn.getAttribute('data-model');
        fullpage_api.moveTo(5,0);
        document.querySelector('.products__tabs-item[data-model="'+model+'"]').click();
    })
});


document.querySelectorAll('.products__tabs-item').forEach(btn => {
    btn.addEventListener('click', e => {
        if (btn.classList.contains('m-visible')) return;

        let model = btn.getAttribute('data-model');

        if (isMobile) {
            enableFullpageScrolling(false);
            document.querySelector('.products__tabs-content').classList.add('showPopup');    
        } else {
            if (btn.classList.contains('active') || isMobile) return;
        }
        document.querySelector('.products__tabs-item.active').classList.remove('active');
        btn.classList.add('active');
        document.querySelector('.products__tabs-content-item.active').classList.remove('active');
        document.querySelector('.products__tabs-content-item--'+model).classList.add('active');
    })
});

document.querySelectorAll('.products__tabs-item-color').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        if (btn.classList.contains('active') || isMobile) return;

        let color = btn.getAttribute('data-color');
        let colorsList = btn.parentNode;
        let parentTab = colorsList.parentNode.parentNode;
        colorsList.querySelector('.products__tabs-item-color.active').classList.remove('active');
        btn.classList.add('active');
        parentTab.querySelector('.products__tabs-item-image .active').classList.remove('active');
        parentTab.querySelector('.products__tabs-item-image--'+color).classList.add('active');
    })
});

document.querySelectorAll('.products__tabs-content-color').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;

        let color = btn.getAttribute('data-color');
        let colorsList = btn.parentNode;
        let parentTab = colorsList.parentNode;
        colorsList.querySelector('.products__tabs-content-color.active').classList.remove('active');
        btn.classList.add('active');
        parentTab.querySelector('.products__tabs-content-image .active').classList.remove('active');
        parentTab.querySelector('.products__tabs-content-image--'+color).classList.add('active');
    })
});


document.querySelectorAll('.products__tabs-content-close').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        let tabsContent = btn.parentNode.parentNode;
        tabsContent.classList.remove('showPopup');
        enableFullpageScrolling(true);
    })
});


document.querySelector('.header__menu-btn').addEventListener('click', btn => {
    if (document.body.classList.contains('menuOpen'))
        document.body.classList.remove('menuOpen');
    else
        document.body.classList.add('menuOpen');
});

document.body.addEventListener('click', e => {
    let target = e.target;
    if (target.classList.contains('popmechanic-link')) {
        // console.log('link');
        sendGA('popup', 'link');
    } else if (target.classList.contains('popmechanic-close')) {
        // console.log('close');
        sendGA('popup', 'close');
    } else if (target.classList.contains('popmechanic-button')) {
        // console.log('shop');
        sendGA('popup', 'shop');
    }
})




// Sending click event for google tag manager
function sendGA(category, label) {
    gtag('event', 'click', {'event_category': category,'event_label': label});
}

// Enable/Disable scrolling of page, needs for mobile's products "popup"
function enableFullpageScrolling(bool) {
    fullpage_api.setAllowScrolling(bool);
    fullpage_api.setKeyboardScrolling(bool);
} 

// Enable/disable auto scrolling pages
function enableAutoPlay(bool = true, interval = 5000) {
    let playBtn = document.querySelector('.footer__player-btn--play');
    let stopAutoPlay = () => {
        clearInterval(autoPlayAction);
        autoPlay = false;
        playBtn.classList.remove('active');
    }
    if (bool && !autoPlay) {
        autoPlay = true;
        playBtn.classList.add('active');
        let root = document.querySelector('.main');
        let sections = root.querySelectorAll('.section');
        fullpage_api.moveSectionDown();
        autoPlayAction = setInterval(() => {
            let currentSection = root.querySelector('.section.active');
            let currentSectionAnchor = currentSection.getAttribute('data-anchor');
            let nextSection = currentSection.nextElementSibling;
            if (nextSection) {
                let nextSectionAnchor = nextSection.getAttribute('data-anchor');
                fullpage_api.moveTo(nextSectionAnchor);

                if (!nextSection.nextElementSibling) {
                    stopAutoPlay();
                    // console.log('stopped');
                }
            } else {
                stopAutoPlay();
                // console.log('stopped');
            }
        }, interval);
        // console.log('play');
        ga('send', {
            hitType: 'event',
            eventCategory: 'panel',
            eventAction: 'click',
            eventLabel: 'play'
        });
    } else {
        stopAutoPlay();
        // console.log('stop');
        ga('send', {
            hitType: 'event',
            eventCategory: 'panel',
            eventAction: 'click',
            eventLabel: 'stop'
        });
    }
}

// Animates background sequence
function animateScene(scene, duration) {
    document.querySelectorAll('.scene img').forEach(img => { img.style.opacity = 0; });
    
    if (document.querySelectorAll('.scene.active').length > 0)
        document.querySelector('.scene.active').classList.remove('active');

    let newScene = document.querySelector('.scene--'+scene);
    newScene.classList.add('active');

    let images = newScene.querySelectorAll('img');
    images[0].style.opacity = 1;

    let interval = duration / images.length;
    let index = 0;
    images.forEach(img => { img.style.opacity = 0; })

    let sequence = setInterval(() => {
        images[index].style.opacity = 0;
        if (index + 1 >= images.length) {
            clearInterval(sequence);
            
        } else {
            images[index++].style.opacity = 1;
        }
    }, interval);

}

function windowResize() {
    if (window.innerWidth < 768) {
        if (!isMobile) isMobile = true;
    } else {
        if (isMobile) isMobile = false;
    }
}

