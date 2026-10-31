// ======================================
// DOWNLOAD USERS
// MANAGEMENT TOKO
// ======================================

const DownloadUsers = {

    // ==================================
    // DOWNLOAD USERS DARI SERVER
    // ==================================

    async download() {

       


        try {

            const response =
                await API.getUsers();


            

            if (
                !response ||
                response.success !== true
            ) {

                throw new Error(
                    response?.message ||
                    "Gagal mengambil data kasir."
                );

            }


            const users =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : [];


            


            const normalizedUsers =
                users
                    .map(
                        user => {

                            return {

                                id:
                                    String(
                                        user.id || ""
                                    ).trim(),

                                username:
                                    String(
                                        user.username || ""
                                    ).trim(),

                                nama:
                                    String(
                                        user.nama || ""
                                    ).trim(),

                                pinHash:
                                    String(
                                        user.pinHash || ""
                                    ).trim(),

                                role:
                                    String(
                                        user.role || ""
                                    )
                                    .trim()
                                    .toUpperCase(),

                                status:
                                    String(
                                        user.status || ""
                                    )
                                    .trim()
                                    .toUpperCase(),

                                updatedAt:
                                    user.updatedAt || ""

                            };

                        }
                    )
                    .filter(
                        user =>
                            user.id &&
                            user.username
                    );


            await DB.replaceAll(
                "users",
                normalizedUsers
            );


            

            return {

                success:
                    true,

                count:
                    normalizedUsers.length,

                data:
                    normalizedUsers

            };

        }

        catch (error) {

            console.error(
                "DOWNLOAD USERS ERROR:",
                error
            );


            throw error;

        }

    },


    // ==================================
    // AMBIL USER DARI LOCAL DB
    // ==================================

    async getLocalUsers() {

        return await DB.getAll(
            "users"
        );

    },


    // ==================================
    // AMBIL USER AKTIF
    // ==================================

    async getActiveUsers() {

        const users =
            await this.getLocalUsers();


        return users.filter(
            user =>
                String(
                    user.status || ""
                )
                .trim()
                .toUpperCase()
                === "AKTIF"
        );

    }

};