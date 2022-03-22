document.querySelectorAll('.delete-button').forEach((el) => {
    el.addEventListener('click', () => {
        let id = el.getAttribute('data-id');
        fetch("http://localhost:3002/" + id, {
            method: 'DELETE'
        })
            .then(response => window.location.reload());
    })
});
document.querySelectorAll('.edit-button').forEach((el) => {
    el.addEventListener('click', () => {
        // let id = el.getAttribute('data-id');
        // fetch("http://localhost:3002/" + id, {
        //     method: 'DELETE'
        // })
        //     .then(response => window.location.reload());
    })
})


