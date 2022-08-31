const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        1400: {
            slidesPerView: 6,
            slidesPerGroup: 6,
        },
        1200: {
            slidesPerView: 6,
            slidesPerGroup: 6,
        },
        992: {
            slidesPerView: 5,
            slidesPerGroup: 5,
        },
        768: {
            slidesPerView: 3,
            slidesPerGroup: 3,
        },
        576: {
            slidesPerView: 2,
            slidesPerGroup: 2,
        },
        280: {
            slidesPerView: 1,
            slidesPerGroup: 1,
        },
    },
});
