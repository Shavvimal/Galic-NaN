const formlogin = document.querySelector('#login');

const formregister = document.querySelector('#register');
// formlogin.addEventListener('submit', requestLogin);


formlogin.addEventListener('submit', requestLogin);
formregister.addEventListener('submit', requestRegistration);

async function requestLogin(e) {
    e.preventDefault();
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
        }
        const r = await fetch(`http://localhost:5000/auth/login`, options)
        const data = await r.json()
        if (!data.success) {
            let bottomtext = document.getElementById('bottomtext')
            let error = document.createElement('p')
            error.textContent = "Please try again..."
            error.setAttribute('class', 'text-center text-red-500 mb-10')
            error.setAttribute('id', 'errormessage')
            if(!document.getElementById('errormessage')) {bottomtext.prepend(error)}            
            throw new Error('Login is not authorised')
            ;
        }
        login(data.token);
    } catch (err) {
        console.warn(err);
    }
}

function login(token){
    const user = jwt_decode(token);
    console.log(user);
    localStorage.setItem("token", token);
    localStorage.setItem("username", user.username);
    localStorage.setItem("userid", user.id);
    window.location = "./portfolio.html";
}



async function requestRegistration(e) {
    e.preventDefault();
    try {
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
        }
        

        
        const r = await fetch("http://localhost:5000/auth/register", options)

        const data = await r.json()
        if (data.err){ throw Error(data.err) }
        requestLogin(e);
    } catch (err) {
        console.warn(err);
    }
}
