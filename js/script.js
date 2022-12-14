const output = document.querySelector(".output")
const searchInput = document.getElementById("searchInput")

const getAllBooks = async () => {
    document.querySelector(".filters").style.display = "flex"
    searchInput.value = ""
    const req = await fetch("http://localhost:1717/books",
        {
            headers: {
                'X-Auth': localStorage.getItem('token')
            },
        })
    const res = await req.json()
    let array = document.getElementById('filterSelect').value === "name" ? await res.sort((a, b) => a.name.localeCompare(b.name)) : await res.sort((a, b) => a.author.localeCompare(b.author))

    console.log(array)
    renderAllBooks(array)
}
getAllBooks()

document.getElementById('filterSelect').addEventListener('change', getAllBooks)
const getFavoriteBooks = async () => {
    const req = await fetch("http://localhost:1717/books",
        {
            headers: {
                'X-Auth': localStorage.getItem('token')
            },
        })
    const res = await req.json()
    let favorites = await res.filter(el => el.isFavorite === true)
    renderAllBooks(favorites)
}

document.querySelector(".favoriteLink").addEventListener('click', () => {
    searchInput.value = ""
    getFavoriteBooks()
})
document.querySelector('.logo').addEventListener('click', getAllBooks)
const renderAllBooks = (data) => {
    if (data) {
        output.innerHTML = ''
        const row = document.createElement('div')

        row.className = "row"
        data?.map(el => {
            const col = document.createElement('div')
            const box = document.createElement('div')
            const imgBox = document.createElement('div')
            const details = document.createElement('div')
            const favorites = document.createElement('p')
            const detailsName = document.createElement('h2')
            const detailsAuthor = document.createElement('h3')
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
            more.className = "more"

            imgBox.innerHTML = `<img src=${el.img ? el.img : "./images/cover-not.png"} alt="">`
            favorites.innerHTML = `&#10084`

            detailsName.textContent = el.name.lenght > 20 ? `${el.name.slice(0, 17)}...` : `${el.name}`
            detailsAuthor.textContent = el.author.lenght > 20 ? `by: ${el.author.slice(0, 17)}...` : `by: ${el.author}`
            deleteBtn.innerHTML = `<img src="../images/delete.png" alt=""> <span>Delete</span>`
            editBtn.innerHTML = `<img src="../images/editing.png" alt=""> <span>Edit</span>`
            more.textContent = "See details..."

            details.append(favorites, detailsName, detailsAuthor, more)
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

            favorites.addEventListener('click', () => {
                changeFavorites(el.id, el.isFavorite)
            })
        })
        output.append(row)
    }
}

const changeFavorites = async (id, favorite) => {
    let data = { isFavorite: !favorite }
    editBookAsync(data, id)
}


const deleteBook = async (id) => {
    const req = await fetch("http://localhost:1717/books/delete/" + id, {
        headers: {
            'X-Auth': localStorage.getItem('token')
        },
        method: 'DELETE'
    })
    const res = await req.json()
    if (res.success) {
        getAllBooks()
    }
}

const editBook = (id) => {
    let data = {}

    if (document.getElementById('edit-name').value != "") {
        data.name = document.getElementById('edit-name').value
    }
    if (document.getElementById('edit-author').value != "") {
        data.author = document.getElementById('edit-author').value
    }
    if (document.getElementById('edit-publishYear').value != "") {
        data.publishYear = document.getElementById('edit-publishYear').value
    }

    if (document.getElementById('edit-publishHouse').value != "") {
        data.publishHouse = document.getElementById('edit-publishHouse').value
    }

    if (document.getElementById('edit-pagesNumber').value != "") {
        data.pagesNumber = document.getElementById('edit-pagesNumber').value
    }

    if (document.getElementById('edit-originalLanguage').value != "") {
        data.originalLanguage = document.getElementById('edit-originalLanguage').value
    }

    if (document.getElementById('edit-genres').value != "") {
        let genres = document.getElementById('edit-genres').value.split(',')

        let genresArray = []

        genres.map(el => {
            let item = el.replaceAll(" ", "")
            genresArray.push(item)
        })
        data.genres = genresArray
    }
    if (document.getElementById('edit-img').value != "") {
        data.img = document.getElementById('edit-img').value
    }

    editBookAsync(data, id)
    toggleEditModal()
    getAllBooks()

    document.getElementById('edit-name').value = ''
    document.getElementById('edit-author').value = ''
    document.getElementById('edit-publishYear').value = ''
    document.getElementById('edit-publishHouse').value = ''
    document.getElementById('edit-pagesNumber').value = ''
    document.getElementById('edit-originalLanguage').value = ''
    document.getElementById('edit-genres').value = ''
    document.getElementById('edit-img').value = ''

}
async function editBookAsync(data, id) {
    const req = await fetch("http://localhost:1717/books/update/" + id,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': localStorage.getItem('token')
            },
            method: 'PUT',
            body: JSON.stringify(data)
        })
    const res = await req.json()
    getAllBooks()
    console.log(res)
}
const getUserInfo = async () => {
    const req = await fetch("http://localhost:1717/me",
        {
            headers: {
                'X-Auth': localStorage.getItem('token')
            },
        })
    const res = await req.json()
    renderUserInfo(res)
}
getUserInfo()

const renderUserInfo = (data) => {
    const avatar = document.querySelector(".avatar")
    const dropdown = document.querySelector(".user__dropdown")
    const exit = document.createElement('button')
    const addBtn = document.createElement('button')
    addBtn.textContent = "Add Book"

    avatar.addEventListener('click', () => {
        dropdown.classList.toggle('show-dropdown')
        document.querySelector('.user__info__backdrop').classList.toggle("backdropActive")
    })

    document.querySelector('.user__info__backdrop').addEventListener('click', () => {
        dropdown.classList.toggle('show-dropdown')
        document.querySelector('.user__info__backdrop').classList.toggle("backdropActive")
    })

    avatar.textContent = data.firstName.charAt(0).toUpperCase()
    exit.textContent = "Log out"

    dropdown.innerHTML = `
    <h6>Username: ${data.username}</h6>
    <h6>First Name: ${data.firstName}</h6>
    <h6>Age: ${data.age}</h6>
    `
    dropdown.append(addBtn, exit)

    addBtn.addEventListener('click', toggleModal)

    exit.addEventListener('click', () => {
        localStorage.removeItem('token')
        window.location.href = "./pages/auth/auth.html"
    })
}

async function addBook(data) {
    const req = await fetch("http://localhost:1717/books/create",
        {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth': localStorage.getItem('token')
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
    console.log(req)
    const res = await req.json()
    getAllBooks()
}

const addBtn = document.getElementById('add-book')

addBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (document.getElementById('add-name').value != "" && document.getElementById('add-author').value != "") {
        const name = document.getElementById('add-name').value
        const author = document.getElementById('add-author').value
        const isFavorite = false
        let data = {}

        data.name = name
        data.author = author
        if (document.getElementById('add-publishYear').value != "") {
            data.publishYear = +document.getElementById('add-publishYear').value
        }

        if (document.getElementById('add-publishHouse').value != "") {
            data.publishHouse = document.getElementById('add-publishHouse').value
        }

        if (document.getElementById('add-pagesNumber').value != "") {
            data.pagesNumber = +document.getElementById('add-pagesNumber').value
        }

        if (document.getElementById('add-originalLanguage').value != "") {
            data.originalLanguage = document.getElementById('add-originalLanguage').value
        }

        if (document.getElementById('add-genres').value != "") {
            let genres = document.getElementById('add-genres').value.split(',')

            let genresArray = []

            genres.map(el => {
                let item = el.replaceAll(" ", "")
                genresArray.push(item)
            })
            data.genres = genresArray
        }

        if (document.getElementById('add-img').value != "") {
            data.img = document.getElementById('add-img').value
        }

        addBook(data)
        toggleModal()
        getAllBooks()
        document.querySelector(".user__dropdown").classList.remove('show-dropdown')
        document.querySelector('.user__info__backdrop').classList.remove("backdropActive")

        document.getElementById('add-name').value = ''
        document.getElementById('add-author').value = ''
        document.getElementById('add-publishYear').value = ''
        document.getElementById('add-publishHouse').value = ''
        document.getElementById('add-pagesNumber').value = ''
        document.getElementById('add-originalLanguage').value = ''
        document.getElementById('add-genres').value = ''
        document.getElementById('add-img').value = ''
    }
})

const toggleModal = () => {
    const modal = document.querySelector('.add-modal')
    const backdrop = document.querySelector('.add__backdrop')

    modal.classList.toggle('modalActive')
    backdrop.classList.toggle('backdropActive')
    document.body.classList.toggle('hidden')
}

document.querySelector('.add__backdrop').addEventListener('click', toggleModal)
document.querySelector(".add__close-btn").addEventListener('click', toggleModal)

const toggleEditModal = () => {
    const modal = document.querySelector('.edit-modal')
    const backdrop = document.querySelector('.edit__backdrop')

    modal.classList.toggle('modalActive')
    backdrop.classList.toggle('backdropActive')
    document.body.classList.toggle('hidden')
}

const toggleDetailsModal = () => {
    const modal = document.querySelector('.details-modal')
    const backdrop = document.querySelector('.details__backdrop')

    modal.classList.toggle('modalActive')
    backdrop.classList.toggle('backdropActive')
    document.body.classList.toggle('hidden')
}
document.querySelector('.details__backdrop').addEventListener('click', toggleDetailsModal)
document.querySelector('.details__close-btn').addEventListener('click', toggleDetailsModal)
const getBookDetails = async (id) => {
    const req = await fetch("http://localhost:1717/books/" + id,
        {
            headers: {
                'X-Auth': localStorage.getItem('token')
            },
        })
    const res = await req.json()
    console.log(res)
    renderBookDetails(res)
}

const renderBookDetails = (data) => {
    document.querySelector(".details__box-img").src = data.img
    document.querySelector(".details__box-name").innerHTML = `<span>Name:</span> ${data.name}`
    document.querySelector(".details__box-author").innerHTML = `<span>Author:</span> ${data.author}`
    document.querySelector(".details__box-originalLanguage").innerHTML = `<span>Original language:</span> ${data.originalLanguage}`
    document.querySelector(".details__box-publishHouse").innerHTML = `<span>Publish house:</span> ${data.publishHouse}`
    document.querySelector(".details__box-publishYear").innerHTML = `<span>Publish year:</span> ${data.publishYear}`
    document.querySelector(".details__box-pagesNumber").innerHTML = `<span>Pages number:</span> ${data.pagesNumber}`

    const genresWrap = document.querySelector('.genres__wrap')
    data.genres.length > 0 ? genresWrap.append(document.createElement('span').textContent = "Genres: ") : null
    data.genres.forEach((el, index) => {
        const genre = document.createElement('span')
        genre.textContent = index !== data.genres.length - 1 ? el + ", " : el
        genresWrap.append(genre)
    })
}

searchInput.addEventListener('input', () => {
    searchBooks(searchInput.value)
})
const searchBooks = async (value) => {
    if (value.length > 0) {
        document.querySelector(".filters").style.display = "none"
        let array = []
        let request = await fetch("http://localhost:1717/books",
            {
                headers: {
                    'X-Auth': localStorage.getItem('token')
                },
            })
        let response = await request.json()
        response?.map(el => {
            el?.name?.toLowerCase().includes(value.toLowerCase()) === true ? array.push(el) : null
        })
        response?.map(el => {
            el?.author?.toLowerCase().includes(value.toLowerCase()) === true ? array.push(el) : null
        })
        output.innerHTML = ""
        if (array.length > 0) {
            renderAllBooks(array)
        }
        else {
            const notFoundPage = document.createElement("div")
            const img = document.createElement("img")
            const textWrap = document.createElement("div")
            const text1 = document.createElement("p")
            const addBtn = document.createElement("button")
            const text2 = document.createElement("p")

            notFoundPage.className = "not__found flex flex-jc-c flex-ai-c flex-fd-c"

            img.src = "../images/spongebob.gif"
            text1.textContent = "The whole team was looking for this book, but not found"
            textWrap.textContent = "If you know the name and author, you can add this book"
            addBtn.textContent = "Add book"
            text2.textContent = "or try to search another book"
            textWrap.append(addBtn)

            notFoundPage.append(img, text1, textWrap, text2)
            output.append(notFoundPage)

            addBtn.addEventListener('click', toggleModal)
        }
    }
    else {
        getAllBooks()
    }
}

const redirect = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.href = "../pages/auth/auth.html"
    }
}
redirect()