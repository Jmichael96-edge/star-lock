let resourceArr = [];
window.addEventListener('load', async () => {
    resizeNavHandler();

    await fetch('/api/resource/all', {
        method: 'GET'
    }).then((res) => res.json())
        .then(async (data) => {
            await renderResources(data);
            resourceArr = [...data];
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

// render resource function will handle importing data to the DOM
const renderResources = async (items) => {
    const renderer = document.getElementById('renderResources');
    if (items.length > 0) {
        renderer.innerHTML = items.map((item, i) => {
            return `
                <section class="resourceCard">
                    <h4 class="resourceTitle">${item.title}</h4>
                    <div class="divider"></div>
                    <p class="resourceDesc">${item.description}</p>
                    <main class="wrapper">
                        ${item.screenShots.map((img) => {
                            return `<img src="${img.url}" class="screenShots" />`;
                        }).join('')}
                    </main>
                    <main class="wrapper" style="justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            <i style="color: #47ff2f;" class="fas fa-tag"></i>
                            <p class="resourceCat">${item.category}</p>
                        </div>
                        <a rel="noreferrer" target="_blank" href="${item.ghLink}"><i class="fab fa-github"></i></a>
                    </main>
                </section>
            `;
        }).join('');
    }
};

document.getElementById('searchInput').addEventListener('keyup', async function (e) {
    let val = e.target.value;
    let copyArr = [];
    // check if the input value is empty
    if (val.length === 0 || !val) {
        renderResources(resourceArr);
    }
    // check if typed value is included in any of the objects
    for (let obj in resourceArr) {
        let str = JSON.stringify(resourceArr[obj]);
        if (str.indexOf(val) > -1) {
            copyArr.push(resourceArr[obj]);
        } 
    }

    renderResources(copyArr);
});