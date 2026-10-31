const Auth = {

    SESSION_KEY: "TREEHOUSE_MANAGEMENT_SESSION",

    async login(username, pin) {
        try {
            const inputUsername = String(username || "").trim();
            const inputPin = String(pin || "").trim();

            if (!inputUsername) {
                throw new Error("Username belum diisi.");
            }

            if (!inputPin) {
                throw new Error("PIN belum diisi.");
            }

            const users = await DB.getAll("users");

            if (!Array.isArray(users) || !users.length) {
                throw new Error("Data user belum tersedia di perangkat.");
            }

            const user = users.find(item =>
                String(item?.username || "").trim().toLowerCase() ===
                inputUsername.toLowerCase()
            );

            if (!user) {
                throw new Error("Username atau PIN tidak valid.");
            }

            if (String(user.status || "").trim().toUpperCase() !== "AKTIF") {
                throw new Error("User tidak aktif.");
            }

            if (String(user.role || "").trim().toUpperCase() !== "ADMIN") {
                throw new Error("Akses ditolak. Hanya user dengan role ADMIN yang dapat membuka App Management.");
            }

            const pinHash = String(user.pinHash || "").trim();

            if (!pinHash) {
                throw new Error("PIN user belum dikonfigurasi.");
            }

            const inputHash = await this.hashPIN(inputPin);

            if (inputHash !== pinHash) {
                throw new Error("Username atau PIN tidak valid.");
            }

            const session = {
                id: String(user.id || "").trim(),
                username: String(user.username || "").trim(),
                nama: String(user.nama || "").trim(),
                role: String(user.role || "").trim().toUpperCase(),
                loginAt: new Date().toISOString()
            };

            if (!session.id) {
                throw new Error("ID pengguna tidak valid.");
            }

            localStorage.setItem(
                this.SESSION_KEY,
                JSON.stringify(session)
            );

            return {
                success: true,
                user: session
            };

        } catch (error) {
            return {
                success: false,
                message: error.message || "Login gagal."
            };
        }
    },

    async hashPIN(pin) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error("Web Crypto API tidak tersedia. Gunakan HTTPS atau localhost.");
        }

        const encoder = new TextEncoder();
        const data = encoder.encode(String(pin || ""));
        const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);

        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");
    },

    getSession() {
        try {
            const value = localStorage.getItem(this.SESSION_KEY);

            if (!value) return null;

            const session = JSON.parse(value);

            if (!session || !session.id) return null;

            return session;

        } catch {
            return null;
        }
    },

    isLoggedIn() {
        const session = this.getSession();

        return !!session &&
            String(session.role || "").trim().toUpperCase() === "ADMIN";
    },

    getCurrentUser() {
        const session = this.getSession();

        if (
            !session ||
            String(session.role || "").trim().toUpperCase() !== "ADMIN"
        ) {
            return null;
        }

        return session;
    },

    async validateSession() {
        const session = this.getSession();

        if (!session) {
            return {
                success: false,
                loggedIn: false
            };
        }

        try {
            const user = await DB.get("users", session.id);

            if (!user) {
                this.logout();

                return {
                    success: false,
                    loggedIn: false,
                    message: "User tidak ditemukan."
                };
            }

            if (String(user.status || "").trim().toUpperCase() !== "AKTIF") {
                this.logout();

                return {
                    success: false,
                    loggedIn: false,
                    message: "User sudah tidak aktif."
                };
            }

            if (String(user.role || "").trim().toUpperCase() !== "ADMIN") {
                this.logout();

                return {
                    success: false,
                    loggedIn: false,
                    message: "Akses ditolak. Hanya user dengan role ADMIN yang dapat membuka App Management."
                };
            }

            const validatedUser = {
                id: String(user.id || "").trim(),
                username: String(user.username || "").trim(),
                nama: String(user.nama || "").trim(),
                role: String(user.role || "").trim().toUpperCase()
            };

            const updatedSession = {
                ...session,
                ...validatedUser
            };

            localStorage.setItem(
                this.SESSION_KEY,
                JSON.stringify(updatedSession)
            );

            return {
                success: true,
                loggedIn: true,
                user: validatedUser
            };

        } catch (error) {
            return {
                success: false,
                loggedIn: false,
                message: error.message || "Gagal memvalidasi sesi."
            };
        }
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
    },

    hasRole(role) {
        const session = this.getSession();

        if (!session) return false;

        const sessionRole =
            String(session.role || "").trim().toUpperCase();

        const targetRole =
            String(role || "").trim().toUpperCase();

        return sessionRole === "ADMIN" &&
            targetRole === "ADMIN";
    }

};