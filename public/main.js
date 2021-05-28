function deleteBook(delete_isbn) {
    fetch("/browse", {
        method: "delete",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ISBN: delete_isbn })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(() => {
            window.location.reload()
        })
}

function updateBook(update_isbn) {
    console.log("update book button clicked")
    fetch("/update", {
        method: "get",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ISBN: update_isbn })
    })
}