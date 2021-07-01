window.addEventListener('load', () => {
    resizeNavHandler();
})
window.onresize = function (e) {
    e.preventDefault();
    resizeNavHandler();
}

function resizeNavHandler() {
    let desktopNav = document.getElementById('desktopNav');
    let mobileNav = document.getElementById('mobileNav');
    if (window.innerWidth >= 1025) {
        desktopNav.style.display = 'flex';
        mobileNav.style.display = 'none';
    } else if (window.innerWidth <= 1024) {
        desktopNav.style.display = 'none';
        mobileNav.style.display = 'flex';
    }
};

function openNav() {
    document.getElementById("smOpenNav").style.width = "100%";
};

function closeNav() {
    document.getElementById("smOpenNav").style.width = "0%";
};