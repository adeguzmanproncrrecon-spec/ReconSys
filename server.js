require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const {
    pool,
    testDatabaseConnection
} = require("./database");

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.SESSION_SECRET) {
    throw new Error(
        "SESSION_SECRET is missing from the .env file."
    );
}

/*
 * Security middleware
 */
app.use(
    helmet({
        contentSecurityPolicy: false
    })
);

app.use(express.json());

app.use(
    express.urlencoded({
        extended: false
    })
);

/*
 * Login request limiter
 */
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message:
            "Too many login attempts. Please try again later."
    }
});

/*
 * Session configuration
 *
 * MemoryStore is acceptable for this local learning project.
 * Use a persistent session store before production deployment.
 */
app.use(
    session({
        name: "hospital.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 1000
        }
    })
);

/*
 * Serve files from the public folder
 */
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

/*
 * Login API
 */
app.post(
    "/api/login",
    loginLimiter,
    async function (request, response) {
        try {
            const email =
                String(request.body.email || "")
                    .trim()
                    .toLowerCase();

            const password =
                String(request.body.password || "");

            if (!email || !password) {
                return response.status(400).json({
                    message:
                        "Enter your email and password."
                });
            }

            const userResult = await pool.query(
                `
                SELECT
                    id,
                    username,
                    email,
                    password_hash,
                    role,
                    is_active
                FROM users
                WHERE email = $1
                LIMIT 1
                `,
                [email]
            );

            if (userResult.rowCount === 0) {
                return response.status(401).json({
                    message:
                        "Invalid email or password."
                });
            }

            const user = userResult.rows[0];

            if (!user.is_active) {
                return response.status(403).json({
                    message:
                        "This account has been disabled."
                });
            }

            const isPasswordValid =
                await bcrypt.compare(
                    password,
                    user.password_hash
                );

            if (!isPasswordValid) {
                return response.status(401).json({
                    message:
                        "Invalid email or password."
                });
            }

            /*
             * Regenerate the session ID after successful login.
             */
            request.session.regenerate((error) => {
                if (error) {
                    console.error(
                        "Session regeneration error:",
                        error
                    );

                    return response.status(500).json({
                        message:
                            "Unable to complete login."
                    });
                }

                request.session.user = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                };

                response.status(200).json({
                    message: "Login successful.",
                    redirectTo: "/upload.html",
                    user: {
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            });
        } catch (error) {
            console.error("Login error:", error);

            response.status(500).json({
                message:
                    "The login service is currently unavailable."
            });
        }
    }
);

/*
 * Return the current authenticated user
 */
app.get(
    "/api/session",
    function (request, response) {
        if (!request.session.user) {
            return response.status(401).json({
                authenticated: false
            });
        }

        response.json({
            authenticated: true,
            user: request.session.user
        });
    }
);

/*
 * Logout
 */
app.post(
    "/api/logout",
    function (request, response) {
        request.session.destroy((error) => {
            if (error) {
                console.error("Logout error:", error);

                return response.status(500).json({
                    message: "Unable to log out."
                });
            }

            response.clearCookie("hospital.sid");

            response.json({
                message: "Logged out successfully."
            });
        });
    }
);

/*
 * Protect the upload page.
 *
 * This route must be defined after Express session middleware
 * and before a general fallback route.
 */
app.get(
    "/protected/upload",
    requireAuthentication,
    function (request, response) {
        response.sendFile(
            path.join(
                __dirname,
                "public",
                "upload.html"
            )
        );
    }
);

function requireAuthentication(
    request,
    response,
    next
) {
    if (!request.session.user) {
        return response.status(401).json({
            message: "You must sign in first."
        });
    }

    next();
}

/*
 * Start the application only after testing PostgreSQL.
 */
async function startServer() {
    try {
        const connectedAt =
            await testDatabaseConnection();

        console.log(
            "PostgreSQL connected at:",
            connectedAt
        );

        app.listen(port, function () {
            console.log(
                `Hospital portal running at http://localhost:${port}`
            );
        });
    } catch (error) {
        console.error(
            "Could not connect to PostgreSQL:",
            error.message
        );

        process.exit(1);
    }
}

startServer();