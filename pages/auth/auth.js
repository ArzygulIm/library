const login = document.getElementById("login")

const auth = async (e) => {
    e.preventDefault()

    let username = document.getElementById('username').value
    let password = document.getElementById('password').value

    let data = {
        username: username,
        password: password
    }

    try {
        const req = await fetch("http://localhost:1717/login", {
            headers:{
                "Content-Type":"application/json"
            },
            method: 'POST',
            body: JSON.stringify(data)
        })

        const res = await req.json()
        console.log(req)
        console.log(res)
        if (res.token) {
            localStorage.setItem('token', res.token)
            window.location.href = '../../index.html'
        }
    }
    catch (e) {
        alert('Wrong data')
    }
}

login.addEventListener('click', auth)