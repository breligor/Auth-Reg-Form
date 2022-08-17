const signInBtn = document.querySelector( '.signin-btn');
const signUpBtn = document.querySelector( '.signup-btn');
const formBox = document.querySelector( '.form-box'); //контейнер для форм
const formSignIn = document.querySelector( '.form_signin'); //форма авторизации
const formSignUp = document.querySelector( '.form_signup'); // форма регистрации
const body = document.body;
const email_in = document.querySelector('.email_in'); // email формы авторизации
const email_up = document.querySelector('.email_up');// email формы регистрации
const password = document.getElementById('password');// пароль формы авторизации
const password_up = document.getElementById('password_up'); // пароль формы регистрации
const password_up_confirm = document.getElementById('password_up_confirm');//пароль подтверждение формы регистрации

const userData = {};
const url = 'https://immense-badlands-47107.herokuapp.com';
const urlSignUp = '/auth/signUp';
const urlSignIn = '/auth/signIn';
const urlVerifyToken = '/auth/verifyToken';

//переключение форм регистрации-авторизации
signUpBtn.addEventListener('click', function () {
    formBox.classList.add('active');
    body.classList.add ('active');
});

signInBtn.addEventListener('click', function () {
    formBox.classList.remove('active');
    body.classList.remove('active');
});

//вывод ошибки заполнения форм
function showError(input, message) {
    input.style.border = '1px solid red';
    const parentContainer = input.parentElement;
    const small = parentContainer.querySelector('small');
    small.innerText = message;
    small.style.visibility = 'visible';
   }

// подсветка зеленым при правильном заполнении поля формы
function showSuccess(input) {
    input.style.border = '1px solid green';
}

//валидация поля email
function checkEmail(input) {
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regExp.test(input.value.trim())) {
        showSuccess(input);
    } else {
        showError(input, 'Email is not valid');
    }
}

//валидации пустых полей форм
function checkRequired(inputArr) {
    inputArr.forEach(function(input) {
        if (input.value === '') {
            showError(input, `${getFieldName(input)} is required`);
        } else {
            showSuccess(input);
        }
    });
}

// получить имя инпута
function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

// проверка длины пароля
function checkLength(input, min, max) {
    if (input.value.length < min) {
        showError(
            input,
            `${getFieldName(input)} must be at least ${min} characters`
        );
    } else if (input.value.length > max) {
        showError(
            input,
            `${getFieldName(input)} must be less than ${max} characters`
        );
    } else {
        showSuccess(input);
    }
}

//проверка пароля и подтверждения пароля
function checkPasswordsMatch(input1, input2) {
    if (input1.value !== input2.value) {
        showError(input2, 'Passwords do not match');
    }
}

// регистрация
function signUp () {
    fetch(url+urlSignUp, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(userData),
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.log(error));
}

// авторизация
function signIn () {
    fetch(url+urlSignIn, {
        method:'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(userData),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                return fetch (url+urlVerifyToken, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json;charset=utf-8',
                        Authorization: data.token,
                    },
                })
                    .then((response) => response.json())
                    .then((data) => console.log(data))
                    .catch((error) => console.log(error));
            }
            console.log(data);
        })
        .catch((error) => console.log(error));
}

// слушатель на кнопку отправки формы регистрации
formSignUp.addEventListener('submit', function(e) {
    e.preventDefault();

    checkRequired([email_up, password_up, password_up_confirm]);
    checkEmail(email_up);
    checkLength(password_up, 6, 25);
    checkLength(password_up_confirm, 6, 25);
    checkPasswordsMatch(password_up, password_up_confirm);

    userData.login = email_up.value;
    userData.createPassword = password_up.value;
    userData.confirmPassword = password_up_confirm.value;

    signUp ();
    });

// слушатель на кнопку отправки формы авторизации
formSignIn.addEventListener('submit', function(e) {
    e.preventDefault();

    checkRequired([email_in, password]);
    checkEmail(email_in);
    checkLength(password, 6, 25);

    userData.login = email_in.value;
    userData.createPassword = password.value;
    signIn();
});