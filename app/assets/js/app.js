let resourceArr = [];

window.addEventListener('load', async () => {
    await fetch('/api/resource/all', {
        method: 'GET'
    }).then((res) => res.json())
        .then(async (data) => {
            if (data.status === 404) {
                return;
            }
            await renderResources(data.items);
            resourceArr = [...data.items];
        }).catch((err) => {
            console.log(err);
        });
});

// render resource function will handle importing data to the DOM
const renderResources = async (items) => {
    const renderer = document.getElementById('renderResources');
    
    if (items.length > 0) {
        renderer.innerHTML = items.map((item, i) => {
            return `
                <section class="resourceCard">
                    <main class="wrapper" style="justify-content: space-between;">
                        <a href="/resource?id=${item._id}"><h4 class="resourceTitle">${item.title}</h4></a>
                        <p class="resourceDate">
                            <i style="color: #47ff2f; margin-right: .3rem; font-size: 1rem;" class="fas fa-calendar-alt"></i>
                            ${moment(item.date).format('dddd MMMM D, Y')}
                        </p>
                    </main>
                    <div class="divider"></div>
                    <main class="wrapper">
                    ${renderImages(item.screenShots)}
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

// render images in the resources accordingly
const renderImages = (images) => {
    if (!images || images.length <= 0) {
        return ``;
    }
    return images.map((img) => {
        return `<img src="${img.url}" class="screenShots" />`;
    }).join('');
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

