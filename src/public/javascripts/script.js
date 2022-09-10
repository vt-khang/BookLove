// Show and hide menu by a button
var navbarNav = document.getElementById('navbarNav');
var navIcons = document.getElementById('navIcons');

function ShowAndHideMenu() {
    navIcons.classList.toggle('fa-xmark');
    if (navIcons.classList.contains('fa-xmark')) {
        navbarNav.style.top = '0';
    } else {
        navbarNav.style.top = '-100vh';
    }
}

// Collapsible button of genres
var collapsibleBtn = document.getElementById('collapsibleBtn');
var collapsibleDownBtn = document.getElementById('collapsibleDownBtn');
var collapsibleUpBtn = document.getElementById('collapsibleUpBtn');

function Collapse() {
    if (collapsibleBtn.classList.contains('container-collapse')) {
        collapsibleDownBtn.classList.add('d-none');
        collapsibleUpBtn.classList.remove('d-none');
        collapsibleBtn.classList.remove('container-collapse');
    } else {
        collapsibleDownBtn.classList.remove('d-none');
        collapsibleUpBtn.classList.add('d-none');
        collapsibleBtn.classList.add('container-collapse');
    }
}

// Show more filter
var filterLanguages = document.getElementById('filterLanguages');
var filterGenres = document.getElementById('filterGenres');

function ShowMoreFilterGenres() {
    if (filterGenres.classList.contains('enabled')) {
        filterGenres.classList.remove('enabled');
    } else {
        filterGenres.classList.add('enabled');
    }
}
function ShowMoreFilterLanguages() {
    if (filterLanguages.classList.contains('enabled')) {
        filterLanguages.classList.remove('enabled');
    } else {
        filterLanguages.classList.add('enabled');
    }
}

// Hide required pop-up of input form
document.addEventListener(
    'invalid',
    (function () {
        return function (e) {
            e.preventDefault();
        };
    })(),
    true,
);

// Show loading spinner before page has finished loading
$(window).on('load', function () {
    setTimeout(() => {
        $('#loader').hide();
        $('body').css({
            'background-color': 'var(--background-color)',
            'height': '100%',
            'overflow-y': 'auto',
        });
    }, 200);

});