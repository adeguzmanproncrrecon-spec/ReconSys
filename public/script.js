const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter your username and password.");
        return;
    }

    /*
     * Replace this section with your FastAPI endpoint.
     *
     * Example:
     *
     * const response = await fetch(
     *     "http://127.0.0.1:8000/api/auth/login",
     *     {
     *         method: "POST",
     *         headers: {
     *             "Content-Type": "application/json"
     *         },
     *         body: JSON.stringify({
     *             username,
     *             password
     *         })
     *     }
     * );
     */

    console.log("Username:", username);
    console.log("Password:", password);

    alert("Login submitted.");
});


document
    .getElementById("forgotPassword")
    .addEventListener("click", function (event) {

        event.preventDefault();

        alert("Password recovery page.");
    });