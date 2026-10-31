const StoreUserSave = {

    // ======================================
    // SAVE USER
    // ======================================

    async save() {

        const button =
            document.getElementById(
                "storeUserSave"
            );


        if (!button) {

            return;

        }


        const id =
            StoreUser.value(
                "storeUserId"
            );


        const username =
            StoreUser.value(
                "storeUserUsername"
            );


        const nama =
            StoreUser.value(
                "storeUserName"
            );


        const pin =
            StoreUser.value(
                "storeUserPin"
            );


        const role =
            StoreUser.value(
                "storeUserRole"
            )
                .toUpperCase();


        const status =
            StoreUser.value(
                "storeUserStatus"
            )
                .toUpperCase();


        if (!id) {

            StoreUser.message(
                "ID Kasir tidak tersedia.",
                "error"
            );

            return;

        }


        if (!username) {

            StoreUser.message(
                "Username wajib diisi.",
                "error"
            );

            return;

        }


        if (!nama) {

            StoreUser.message(
                "Nama kasir wajib diisi.",
                "error"
            );

            return;

        }


        if (
            StoreUser.mode ===
                "add" &&
            !pin
        ) {

            StoreUser.message(
                "PIN wajib diisi.",
                "error"
            );

            return;

        }


        if (
            pin &&
            !/^\d+$/.test(
                pin
            )
        ) {

            StoreUser.message(
                "PIN hanya boleh berisi angka.",
                "error"
            );

            return;

        }


        if (!role) {

            StoreUser.message(
                "Role wajib dipilih.",
                "error"
            );

            return;

        }


        if (!status) {

            StoreUser.message(
                "Status wajib dipilih.",
                "error"
            );

            return;

        }


        const normalizedId =
            id
                .trim()
                .toUpperCase();


        const normalizedUsername =
            username
                .trim()
                .toLowerCase();


        const currentUserId =
            String(
                StoreUser.user?.id ||
                ""
            )
                .trim()
                .toUpperCase();


        const duplicateId =
            StoreUser.users.some(
                user => {

                    const userId =
                        String(
                            user?.id ||
                            ""
                        )
                            .trim()
                            .toUpperCase();


                    return (
                        userId ===
                            normalizedId &&
                        userId !==
                            currentUserId
                    );

                }
            );


        if (
            duplicateId &&
            StoreUser.mode ===
                "add"
        ) {

            StoreUser.message(
                "ID Kasir sudah digunakan.",
                "error"
            );

            return;

        }


        const duplicateUsername =
            StoreUser.users.some(
                user => {

                    const userUsername =
                        String(
                            user?.username ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    const userId =
                        String(
                            user?.id ||
                            ""
                        )
                            .trim()
                            .toUpperCase();


                    return (
                        userUsername ===
                            normalizedUsername &&
                        userId !==
                            currentUserId
                    );

                }
            );


        if (duplicateUsername) {

            StoreUser.message(
                "Username sudah digunakan kasir lain.",
                "error"
            );

            return;

        }


        button.disabled =
            true;


        const originalText =
            button.textContent;


        button.textContent =
            "Menyimpan...";


        try {

            let pinHash =
                null;


            if (pin) {

                pinHash =
                    await StoreUser.hashPIN(
                        pin
                    );

            }


            const data = {

                id:
                    StoreUser.mode ===
                    "edit"

                        ? String(
                            StoreUser.user?.id ||
                            id
                        ).trim()

                        : normalizedId,

                username:
                    normalizedUsername,

                nama:
                    nama,

                role:
                    role,

                status:
                    status,

                updatedAt:
                    new Date().toISOString()

            };


            if (pinHash) {

                data.pinHash =
                    pinHash;

            }


            let response;


            // ======================================
            // TAMBAH
            // ======================================

            if (
                StoreUser.mode ===
                "add"
            ) {

                if (
                    typeof API ===
                        "undefined" ||
                    typeof API.saveUser !==
                        "function"
                ) {

                    throw new Error(
                        "API.saveUser belum tersedia."
                    );

                }


                response =
                    await API.saveUser(
                        data
                    );

            }


            // ======================================
            // EDIT
            // ======================================

            else {

                if (
                    typeof API ===
                        "undefined" ||
                    typeof API.updateUser !==
                        "function"
                ) {

                    throw new Error(
                        "API.updateUser belum tersedia."
                    );

                }


                response =
                    await API.updateUser(
                        data
                    );

            }


            


            if (
                !response ||
                response.success !== true
            ) {

                throw new Error(
                    response?.message ||
                    "Data kasir gagal disimpan."
                );

            }


            StoreUser.user =
                response.data ||
                data;


            StoreUser.closeModal();


            await StoreUser.refreshUsersAfterChange();

        }
        catch (error) {

            console.error(
                "STORE USER SAVE ERROR:",
                error
            );


            StoreUser.message(
                error?.message ||
                "Data kasir gagal disimpan.",
                "error"
            );

        }
        finally {

            button.disabled =
                false;

            button.textContent =
                originalText;

        }

    },


    // ======================================
    // CONFIRM DELETE
    // ======================================

    async confirmDelete() {

        const user =
            StoreUser.user;


        if (!user) {

            return;

        }


        const button =
            document.getElementById(
                "storeUserDeleteConfirm"
            );


        if (!button) {

            return;

        }


        const originalText =
            button.textContent;


        button.disabled =
            true;

        button.textContent =
            "Menghapus...";


        try {

            if (
                typeof API ===
                    "undefined" ||
                typeof API.deleteUser !==
                    "function"
            ) {

                throw new Error(
                    "API.deleteUser belum tersedia."
                );

            }


            const response =
                await API.deleteUser(
                    user.id
                );


            


            if (
                !response ||
                response.success !== true
            ) {

                throw new Error(
                    response?.message ||
                    "Data kasir gagal dinonaktifkan."
                );

            }


            StoreUser.closeDeleteModal();


            await StoreUser.refreshUsersAfterChange();

        }
        catch (error) {

            console.error(
                "STORE USER DELETE ERROR:",
                error
            );


            StoreUser.closeDeleteModal();


            StoreUser.showListMessage(
                error?.message ||
                "Data kasir gagal dinonaktifkan."
            );

        }
        finally {

            button.disabled =
                false;

            button.textContent =
                originalText;

        }

    },


    // ======================================
    // HASH PIN
    // ======================================

    async hashPIN(pin) {

        const value =
            String(
                pin ||
                ""
            );


        if (!value) {

            throw new Error(
                "PIN tidak boleh kosong."
            );

        }


        if (
            typeof crypto ===
                "undefined" ||
            !crypto.subtle
        ) {

            throw new Error(
                "Browser tidak mendukung SHA-256."
            );

        }


        const encoder =
            new TextEncoder();


        const data =
            encoder.encode(
                value
            );


        const hashBuffer =
            await crypto.subtle.digest(
                "SHA-256",
                data
            );


        const hashArray =
            Array.from(
                new Uint8Array(
                    hashBuffer
                )
            );


        return hashArray
            .map(
                byte =>
                    byte
                        .toString(16)
                        .padStart(
                            2,
                            "0"
                        )
            )
            .join("");

    }

};