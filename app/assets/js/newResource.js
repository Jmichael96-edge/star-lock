$('#createForm').on('submit', async function (e) {
    e.preventDefault();

    let title = $('#title').val();

    let formData = {
        title
    };

    await fetch('/api/resource/create', {
        headers: {
            'Access': 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(formData)
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
        }).catch((err) => {
            console.log(err);
        });
});