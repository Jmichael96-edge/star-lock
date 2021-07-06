const resourceContainer = document.getElementById('resourceContainer');
let isEditing = false;
let baseResource = {};
let currentImgArr = []
let fileArr = [];
let id;
window.addEventListener('load', async () => {
    // get param id
    let url = new URL(window.location.href);
    id = url.searchParams.get('id');
    if (id) {
        await fetchResource(id);
    }
    let imgScreenShots = document.querySelectorAll('.screenShots');

    Array.from(imgScreenShots).forEach(function (element) {
        element.addEventListener('click', () => {
            let src = element.attributes.src.value;
            openImgViewer(src);
        })
    });
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
        });
};

// render the resource <zero-md src="../assets/ja-google-analytics.md"><template><link rel="stylesheet" href="../assets/css/markdown.css" /></template></zero-md>

const renderResource = async (item) => {
    currentImgArr = [...item.screenShots]
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
        btn.innerHTML = 'CANCEL';
        await renderEditingForm(baseResource);
        renderCurrentImgs(currentImgArr);

        // render the image previews 
        document.getElementById('editScreenShots').addEventListener('change', function (e) {
            const imgPrev = document.getElementById('uploadPrev');
            if (this.files) {
                fileArr = [...e.target.files];
            }
            if (fileArr.length > 0) {
                imgPrev.innerHTML = fileArr.map((img) => {
                    return `<img src="${URL.createObjectURL(img)}" class="prevImages" />`
                }).join('');
            }
        });

        // save function for when a user submits the edited form
        document.getElementById('editForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            let title = $('#editTitleInput').val();
            let category = $('#editCategoryInput').val();
            let desc = $('#editDescInput').val();
            let ghLink = $('#editGhLinkInput').val().trim();

            const formData = new FormData();

            if (fileArr.length > 0) {
                fileArr.forEach((img) => {
                    formData.append('image', img)
                });
            }

            formData.append('category', category);
            formData.append('title', title);
            formData.append('desc', desc);
            formData.append('ghLink', ghLink);
            formData.append('currentImgArr', JSON.stringify(currentImgArr))

            await fetch(`/api/resource/update/${id}`, {
                method: 'PUT',
                body: formData
            }).then((res) => res.json())
                .then(async (data) => {
                    await renderAlert(data.serverMsg, false);
                    setTimeout(() => {
                        window.location.href = `/resource?id=${id}`;
                    }, 2000);
                }).catch((err) => {
                    console.log(err);
                });
        });
    }
};

// render the editing form
const renderEditingForm = async (item) => {
    console.log(currentImgArr);
    resourceContainer.innerHTML = `
        <section class="resourceCard wrapper">
            <form id="editForm">
                <main class="wrapper">
                    <div class="inputContainer" style="margin: 1rem 0;">
                        <label class="editLabel">Title</label>
                        <input class="editInput" id="editTitleInput" name="title" type="text" />
                    </div>
                    <div class="inputContainer" style="margin: 1rem 0;">
                        <label class="editLabel">Category</label>
                        <select id="editCategoryInput" name="category" class="editInput">
                            <option value="" selected>Select a category</option>
                            <option ${item.category === 'Resource' ? 'selected' : null} value="Resource">Resource</option>
                            <option ${item.category === 'Docs' ? 'selected' : null} value="Docs">Docs</option>
                            <option ${item.category === 'Best Practices' ? 'selected' : null} value="Best Practices">Best Practices</option>
                            <option ${item.category === 'Style Guide' ? 'selected' : null} value="Style Guide">Style Guide</option>
                            <option ${item.category === 'General' ? 'selected' : null} value="General">General</option>
                        </select>
                    </div>
                </main>
                <div style="margin: 1rem 0; width: 100%;">
                    <label class="editLabel">Description</label>
                    <textarea rows="30" id="editDescInput" class="editTextareaInput"></textarea>
                </div>
                <div class="inputContainer" style="margin: 1rem 0;">
                    <label class="editLabel">Github Link</label>
                    <input id="editGhLinkInput" class="editInput" type="text" />
                </div>
                <div class="inputContainer" style="margin: 1rem 0;">
                    <label class="editLabel">Saved Images</label>
                    <main id="renderCurrentImgs" class="wrapper">
                    </main>
                </div>
                <div class="divider"></div>
                <div class="inputContainer" style="margin: 1rem 0;">
                    <label class="editLabel">Attach New Images</label>
                    <input multiple class="editInput" style="border: none; padding: 0;" type="file" name="screenShots" id="editScreenShots" />
                    <main id="uploadPrev" class="wrapper" style="margin: 1rem 0;"></main>
                </div>
                <div class="divider"></div>
                <button type="submit" id="editSaveBtn" class="btn">Save</button>
            </form>
        </section>
    `;
    // setup the default values 
    $('#editTitleInput').val(item.title);
    $('#editDescInput').val(item.description);
    $('#editGhLinkInput').val(item.ghLink);
};

// remove an image from the current image array when editing the resource
const removeCurrentImg = (url) => {
    let foundImg = currentImgArr.findIndex((a) => a.url === url);
    currentImgArr.splice(foundImg, 1);
    renderCurrentImgs(currentImgArr);
};

// render current images
const renderCurrentImgs = (currentImgArr) => {
    document.getElementById('renderCurrentImgs').innerHTML = currentImgArr.length > 0 ? `
        ${currentImgArr.map((img) => {
        return `
            <div style="position: relative;">
                <img alt="" class="editCurrentImg" src="${img.url}" />
                <i onclick="removeCurrentImg('${img.url}')" class="fas fa-trash removeImgIcon"></i>
            </div>`
    }).join('')}
    ` : `<h5 style="color: white; text-align: center;">All the images have been removed</h5>`;
};

// delete functionality 
document.getElementById('deleteBtn').addEventListener('click', async () => {
    openModal('Are you sure you want to delete this resource?');
});

document.getElementById('confirmDeleteBtn').addEventListener('click', async () => {
    await fetch(`/api/resource/delete/${id}`, {
        method: 'DELETE'
    }).then((res) => res.json())
        .then(async (data) => {
            closeModal();
            await renderAlert(data.serverMsg, false);
            setTimeout(() => {
                window.location.href = `/`;
            }, 2000);
        }).catch((err) => {
            console.log(err);
        });
});

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

// when the user hits the cancel button in the confirm modal
document.getElementById('cancelConfirmBtn').addEventListener('click', () => {
    closeModal();
});

// x button to close the modal
document.getElementById('close-btn').addEventListener('click', function () {
    closeModal();
});

// overlay behind the modal to tap anywhere to close
document.getElementById('overlay').addEventListener('click', function () {
    closeModal();
});

// close button for the image modal
document.getElementById('closeImgModalBtn').addEventListener('click', () => {
    closeImgViewer();
})
// open modal function
const openModal = (text) => {
    document.getElementById('overlay').classList.add('is-visible');
    document.getElementById('modal').classList.add('is-visible');
    document.getElementById('modalText').innerHTML = text;
};

// close modal function
const closeModal = () => {
    document.getElementById('overlay').classList.remove('is-visible');
    document.getElementById('modal').classList.remove('is-visible');
};

// open image viewer 
const openImgViewer = (src) => {
    console.log(src);
    document.getElementById('imgOverlay').classList.add('is-img-visible');
    document.getElementById('imgModal').classList.add('is-img-visible');
    document.getElementById('viewerImg').src = src;
};

// close image viewer
const closeImgViewer = () => {
    document.getElementById('imgOverlay').classList.remove('is-img-visible');
    document.getElementById('imgModal').classList.remove('is-img-visible');
};
