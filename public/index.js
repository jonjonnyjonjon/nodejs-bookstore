function deleteBook(delete_isbn) {
    console.log("deleteBook onclick triggered")
    console.log(delete_isbn)
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