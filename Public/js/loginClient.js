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



})