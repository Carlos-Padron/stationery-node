document.addEventListener('DOMContentLoaded', () => {

    //Elements
    var logInButton = document.querySelector('#logInBtn')

    var email = document.querySelector('#email')
    var emailDiv = document.querySelector('#emailDiv')
    var emailMsg = document.querySelector('#emailMsg')

    var pw = document.querySelector('#pw')
    var pwDiv = document.querySelector('#pwDiv')
    var pwMsg = document.querySelector('#pwMsg')

    var elemToBlock = document.querySelector('.card')


    /*   blockElem(elemToBlock)
      unblockElem() */
    //Listeners
    logInButton.addEventListener('click', () => {
        resetEmail()
        resetPw()
        valdiateEmail(email)
        valdiatePw(pw)

        sendLoginCredeintials(email.value, pw.value, elemToBlock)


    })

    function valdiateEmail(email) {
        if (email.value === '') {
            emailDiv.classList.add('invalid-input')
            emailMsg.innerHTML = 'El email es requerido'
            emailMsg.classList.add('text-danger')
            return

        } if (email.value === '1') {
            emailDiv.classList.add('invalid-input')
            emailMsg.innerHTML = 'Ingrese un email válido'
            emailMsg.classList.add('text-danger')
            return
        }
    }

    function valdiatePw(pw) {
        if (pw.value === '') {
            pwDiv.classList.add('invalid-input')
            pwMsg.innerHTML = 'La contraseña es requerida'
            pwMsg.classList.add('text-danger')
            return

        }
    }

    function resetEmail() {
        emailDiv.classList.remove('invalid-input')
        emailMsg.innerHTML = ''
        emailMsg.classList.remove('text-danger')
        console.log(emailDiv);
    }

    function resetPw() {
        pwDiv.classList.remove('invalid-input')
        pwMsg.innerHTML = ''
        pwMsg.classList.remove('text-danger')
        console.log(pwDiv);
    }

    async function sendLoginCredeintials(email, pw, elemToBlock) {

        //successNotification('memis')

        let data = JSON.stringify({
            "email": email,
            "password": pw
        })

        console.log(data);
        blockElem(elemToBlock)

        try {
            let request = await fetch('/login', { method: 'POST' }, data)
            let json = await request.json()
            console.log(json);

            unblockElem()

            if (json === undefined) { return }

            if (json.error) {
                warningNotification(json.response)
            } else {
                successNotification(json.response)

                let token = json.response.token
                localStorage.setItem('authToken', token)
                //window.location = '/dashboard'
            }
        } catch (error) {
            errorNotification(error.toString())
            unblockElem()

        }

    }

})