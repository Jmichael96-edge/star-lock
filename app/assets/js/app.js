window.addEventListener('load', async () => {
    resizeNavHandler();

    await fetch('/api/resource/all',{
        method: 'GET'
    }).then((res) => res.json())
    .then((data) => {
        console.log(data);
    }).catch((err) => {
        console.log(err);
    });
});
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

// adding navbar effect for changing color on scroll
window.onscroll = () => {
    const nav = document.getElementById('nav');
    const scrollBtn = document.getElementById('scrollTopIcon');

    if (this.scrollY <= 300) {
        nav.style.height = '4rem';
        nav.style.boxShadow = 'none';
        scrollBtn.style.display = 'none';
    }
    else {
        nav.style.height = '3.5rem';
        nav.style.boxShadow = '0 5px 15px rgba(0,0,0,.1)';
        scrollBtn.style.display = 'block';
    };
};