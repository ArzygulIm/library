const login = document.getElementById("login")

const reg = async (e) => {
    e.preventDefault()
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let firstName = document.getElementById('firstName').value
    let age = document.getElementById('age').value
    
    let data = {
        "username": username,
        "password": password,
        "firstName": firstName,
        "age": age
    }

    try {
        const req = await fetch("http://localhost:1717/signin", {
            headers: {
                "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(data)
        })

        const res = await req.json()

        if (res.token) {
            localStorage.setItem('token', res.token)
            window.location.href = '../../index.html'
        }
    }
    catch (e) {
        alert('Wrong data')
    }
}

login.addEventListener('click',reg)