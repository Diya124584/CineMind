import {
    login,
    register
} from "./api.js";

// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const user = {

            email: document.getElementById("email").value,

            password: document.getElementById("password").value

        };

        try {

            const data = await login(user);

            if (data.token) {

                localStorage.setItem("token", data.token);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                alert(data.message);

                window.location.href = "index.html";

            } else {

                alert(data.message);

            }

        } catch (err) {

            console.error(err);

            alert("Login failed.");

        }

    });

}

// ================= REGISTER =================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const user = {

            username: document.getElementById("username").value,

            email: document.getElementById("email").value,

            password: document.getElementById("password").value

        };

        try {

            const data = await register(user);

            alert(data.message);

            if (data.message === "User Registered Successfully") {

                window.location.href = "login.html";

            }

        } catch (err) {

            console.error(err);

            alert("Registration failed.");

        }

    });

}