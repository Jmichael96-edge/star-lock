let fileArr = [];

document.querySelector('input[type="file"]').addEventListener('change', function (e) {
    if (this.files) {
        fileArr = [...e.target.files];
    }
});

$('#createForm').on('submit', async function (e) {
    e.preventDefault();

    let title = $('#title').val();
    let desc = $('#desc').val();
    let ghLink = $('#ghLink').val().trim();

    const data = new FormData();

    // if (fileArr.length > 0) {
        
    // }
    for (let i = 0; i < fileArr.length; i++) {
        data.append('image', fileArr[i]);
    }
    data.append('title', title);
    data.append('desc', desc);
    data.append('ghLink', ghLink);

    // let data = {
    //     title,
    //     desc,
    //     ghLink,
    //     fileArr
    // };

    await fetch('/api/resource/create', {
        method: 'POST',
        body: data
    })
        .then((res) => res.json())
        .then((data) => {
            alert('success!')
            console.log(data);
        }).catch((err) => {
            console.log(err);
            alert('There was an error');
        });
});