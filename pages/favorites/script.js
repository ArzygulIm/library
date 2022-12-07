

const getFavoriteBooks = async () => {
    const req = await fetch("http://localhost:1717/books",
        {
            headers: {
                'X-Auth': localStorage.getItem('token')
            },
        })
    const res = await req.json()
    console.log(res);
    renderAllBooks(res)
}
getFavoriteBooks()

const renderAllBooks = (data) => {
    output.innerHTML = ''
    const row = document.createElement('div')

    row.className = "row"
    data.map(el => {
        const col = document.createElement('div')
        const box = document.createElement('div')
        const imgBox = document.createElement('div')
        const details = document.createElement('div')
        const favorites = document.createElement('p')
        const detailsText = document.createElement('h2')
        const btnWrap = document.createElement('div')
        const deleteBtn = document.createElement('button')
        const editBtn = document.createElement('button')
        const more = document.createElement('p')

        col.className = "col-3"
        box.className = "books__box"
        imgBox.className = "imgBx"
        details.className = "details"
        favorites.className = el.isFavorite == true ? "favorites favorite" : "favorites"
        btnWrap.className = "books__box-button__wrap flex flex-jc-sb"
        deleteBtn.className = "flex flex-ai-c"
        editBtn.className = "flex flex-ai-c"

        imgBox.innerHTML = `<img src=${el.img} alt="">`
        favorites.innerHTML = `&#10084`
        detailsText.innerHTML = `${el.name}<br><span>${el.author}</span>`
        deleteBtn.innerHTML = `<img src="../images/delete.png" alt=""> <span>Delete</span>`
        editBtn.innerHTML = `<img src="../images/editing.png" alt=""> <span>Edit</span>`
        more.textContent = "See details..."

        details.append(favorites, detailsText,more)
        btnWrap.append(deleteBtn, editBtn)
        box.append(imgBox, details, btnWrap)

        col.append(box)
        row.append(col)

        deleteBtn.addEventListener('click', () => {
            deleteBook(el.id)
        })

        editBtn.addEventListener('click', () => {
            toggleEditModal()
            document.getElementById('editBtn').addEventListener('click', () => editBook(el.id))
        })

        document.querySelector('.edit__backdrop').addEventListener('click', toggleEditModal)
        document.querySelector(".edit__close-btn").addEventListener('click', toggleEditModal)

        more.addEventListener('click', () => {
            toggleDetailsModal()
            getBookDetails(el.id)
        })

        favorites.addEventListener('click',()=>{
            changeFavorites(el.id, el.isFavorite)
        })
    })
    output.append(row)
}