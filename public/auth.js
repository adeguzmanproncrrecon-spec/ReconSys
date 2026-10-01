const loginForm =
    document.getElementById("login-form");

const loginButton =
    document.getElementById("login-button");

const loginMessage =
    document.getElementById("login-message");

loginForm.addEventListener(
    "submit",
    async function (event) {
        event.preventDefault();

        clearMessage();

        const email =
            document.getElementById("email")
                .value
                .trim();

        const password =
            document.getElementById("password")
                .value;

        if (!email || !password) {
            showMessage(
                "Enter your email and password.",
                "error"
            );

            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "same-origin",

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showMessage(
                    result.message ||
                        "Login failed.",
                    "error"
                );

                return;
            }

            showMessage(
                result.message,
                "success"
            );

            window.location.href =
                result.redirectTo ||
                "/upload.html";
        } catch (error) {
            console.error(error);

            showMessage(
                "Unable to contact the login server.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    }
);

function setLoading(isLoading) {
    loginButton.disabled = isLoading;

    loginButton.textContent =
        isLoading ? "SIGNING IN..." : "LOGIN";
}

function showMessage(message, type) {
    loginMessage.textContent = message;
    loginMessage.className =
        `login-message ${type}`;
}

function clearMessage() {
    loginMessage.textContent = "";
    loginMessage.className =
        "login-message";
}