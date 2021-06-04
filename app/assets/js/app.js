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
                    <main class="wrapper" style="justify-content: space-between;">
                        <h4 class="resourceTitle">${item.title}</h4>
                        <p class="resourceDate">
                            <i style="color: #47ff2f; margin-right: .3rem; font-size: 1rem;" class="fas fa-calendar-alt"></i>
                            ${moment(item.date).format('dddd MMMM D, Y')}
                        </p>
                    </main>
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

document.querySelectorAll('.filterInput').forEach((el) => {
    el.addEventListener('input', function (e) {
        document.getElementById('noResources').style.display = 'none';
        document.getElementById('renderResources').style.display = 'flex';
        let input = $('#searchInput').val();
        let select = $('#filterCategoryInput').val();

        if (!input && !select) {
            renderResources(resourceArr);
            return;
        }

        let copyArr = [];
        for (let obj in resourceArr) {
            let strArr = JSON.stringify(resourceArr[obj]);
            // if there is not a category selected
            // if category is not selected then just look for the index of the input value
            if (!select || select.length === 0 || select === null) {
                if (strArr.toLocaleLowerCase().indexOf(input) > -1 || strArr.indexOf(input) > -1) {
                    copyArr.push(resourceArr[obj]);
                }
            } else if (!input || input.length === 0 || input === null) {
                if (resourceArr[obj].category === select) {
                    copyArr.push(resourceArr[obj]);
                }
            } else if (input && select) {
                if (resourceArr[obj].category === select && strArr.toLocaleLowerCase().indexOf(input) > -1 || strArr.indexOf(input) > -1) {
                    copyArr.push(resourceArr[obj]);
                }
            }
        }
        if (copyArr.length > 0) {
            renderResources(copyArr);
        } else {
            document.getElementById('noResources').style.display = 'flex';
            document.getElementById('renderResources').style.display = 'none';
        }
    });
});