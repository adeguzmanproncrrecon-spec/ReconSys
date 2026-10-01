require("dotenv").config();

const bcrypt = require("bcrypt");
const { pool } = require("./database");

async function createUser() {
    const username = "Hospital Admin";
    const email = "admin@hospital.local";
    const plainPassword = "ChangeMe123!";

    try {
        const existingUser = await pool.query(
            `
            SELECT id
            FROM users
            WHERE email = $1
            `,
            [email.toLowerCase()]
        );

        if (existingUser.rowCount > 0) {
            console.log(
                "A user with that email already exists."
            );

            return;
        }

        const passwordHash =
            await bcrypt.hash(
                plainPassword,
                12
            );

        const result = await pool.query(
            `
            INSERT INTO users (
                username,
                email,
                password_hash,
                role
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                username,
                email,
                role,
                created_at
            `,
            [
                username,
                email.toLowerCase(),
                passwordHash,
                "admin"
            ]
        );

        console.log(
            "User created:",
            result.rows[0]
        );

        console.log(
            "Temporary login email:",
            email
        );

        console.log(
            "Temporary login password:",
            plainPassword
        );
    } catch (error) {
        console.error(
            "Unable to create user:",
            error
        );
    } finally {
        await pool.end();
    }
}

createUser();