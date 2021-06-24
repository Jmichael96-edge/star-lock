const resourceContainer = document.getElementById('resourceContainer');
let isEditing = false;
let baseResource = {};

window.addEventListener('load', async () => {
    // get param id
    let url = new URL(window.location.href);
    let id = url.searchParams.get('id');
    if (id) {
        await fetchResource(id);
    }
});

// fetch resource function
const fetchResource = async (id) => {
    await fetch(`/api/resource/fetch_resource/${id}`, {
        method: 'GET'
    }).then((res) => res.json())
        .then(async (data) => {
            if (data.status === 404) {
                await renderAlert(data.serverMsg, true);
                return;
            } else if (data.status === 200) {
                baseResource = data.resource;
                await renderResource(data.resource);
            }
        }).catch((err) => {
            return;
        })
};

// render the resource
const renderResource = async (item) => {
    resourceContainer.innerHTML = `
    <section class="resourceCard">
    <main class="wrapper" style="justify-content: space-between;">
        <h4 class="resourceTitle">${item.title}</h4>
        <p class="resourceDate">
            <i style="color: #47ff2f; margin-right: .3rem; font-size: 1rem;" class="fas fa-calendar-alt"></i>
            ${moment(item.date).format('dddd MMMM D, Y')}
        </p>
    </main>
    <div class="divider"></div>
    <p class="resourceDesc">
        <zero-md><template><link rel="stylesheet" href="../assets/css/markdown.css" /></template><script type="text/markdown">${item.description}</script></zero-md>
    </p>
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


// on click action for when a user clicks the edit nav link
document.getElementById('editBtn').onclick = () => {
    isEditing = !isEditing;
    changeEditBtn();
};

// when the edit button is click this will trigger and handle showing the correct data when editing or not
const changeEditBtn = async () => {
    let btn = document.getElementById('editBtn');
    if (!isEditing) {
        btn.innerHTML = 'EDIT';
        await renderResource(baseResource);
    } else if (isEditing) {
        btn.innerHTML = 'SAVE';
        await renderEditingForm(baseResource);
    }
};

// render the editing form
const renderEditingForm = async (item) => {
    resourceContainer.innerHTML = `
        <section class="resourceCard">
            <input class="editInput" id="editTitleInput" name="title" type="text" />
            <select id="editCategoryInput" name="category" class="editInput">
                <option value="" selected>Select a category</option>
                <option value="Resource">Resource</option>
                <option value="Docs">Docs</option>
                <option value="Best Practices">Best Practices</option>
                <option value="Style Guide">Style Guide</option>
                <option value="General">General</option>
            </select>
            <textarea id="editDescInput" class="editInput"></textarea>
            <input id="editGhLinkInput" class="editInput" type="text" />
        </section>
    `;
    // setup the default values 
    $('#editTitleInput').val(item.title);
    $('#category').val(item.category);
    $('#editDescInput').val(item.description);
    $('#editGhLinkInput').val(item.ghLink);
};

const renderAlert = async (msg, isErr) => {
    const alert = document.getElementById('formAlert');
    const iconWrap = document.getElementById('alertIconWrap');
    // message section to display whats inside the alert
    const message = document.getElementById('alertText');
    alert.style.display = 'block';
    message.innerHTML = msg;

    // if there is no error and is for a successful message 
    if (!isErr) {
        iconWrap.innerHTML = '<i class="fa fa-check"></i>';
    } else if (isErr) {
        // if the alert is for errors
        iconWrap.innerHTML = '<i class="fas fa-times"></i>';
    }

    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
};