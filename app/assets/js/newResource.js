let fileArr = [];

document.querySelector('input[type="file"]').addEventListener('change', function (e) {
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

$('#createForm').on('submit', async function (e) {
    e.preventDefault();

    let category = $('#category').val()
    let title = $('#title').val();
    let desc = $('#desc').val();
    let ghLink = $('#ghLink').val().trim();

    const data = new FormData();

    if (fileArr.length > 0) {
        fileArr.forEach((img) => {
            data.append('image', img)
        })
    }
    data.append('category', category);
    data.append('title', title);
    data.append('desc', desc);
    data.append('ghLink', ghLink);

    await fetch('/api/resource/create', {
        method: 'POST',
        body: data
    })
        .then((res) => res.json())
        .then(async (data) => {
            await clearForm();
            window.location.href = '/';
        }).catch((err) => {
            console.log(err);
            alert('There was an error');
        });
});

// clear form data
const clearForm = async () => {
    $('#category').val('')
    $('#title').val('');
    $('#desc').val('');
    $('#ghLink').val('');
};  