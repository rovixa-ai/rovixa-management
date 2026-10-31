// store-user-render.js

// ======================================
// TREEHOUSE POS
// STORE USER
// RENDER
// ======================================

const StoreUserRender = {

    render() {

        const container =
            document.getElementById(
                "storeUserContainer"
            );


        if (!container) {

            console.warn(
                "STORE USER: container tidak ditemukan."
            );

            return;

        }


        container.innerHTML =
            this.page();


        StoreUser.event();

        StoreUser.loadUsers();

    },


    page() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof StoreUserMobileRender !==
                "undefined"
            ) {

                return StoreUserMobileRender.page();

            }

            return "";

        }


        if (
            typeof StoreUserDesktopRender !==
            "undefined"
        ) {

            return StoreUserDesktopRender.page();

        }


        return "";

    },


    renderUsers(
        message = ""
    ) {

        const list =
            document.getElementById(
                "storeUserList"
            );


        const count =
            document.getElementById(
                "storeUserCount"
            );


        if (!list) {

            return;

        }


        if (count) {

            count.textContent =
                StoreUser.users.length +
                " kasir";

        }


        if (message) {

            this.showListMessage(
                message
            );

            return;

        }


        if (
            !StoreUser.users.length
        ) {

            list.innerHTML = `
                <div class="store-user-empty">

                    <div>
                        Belum ada data kasir.
                    </div>

                </div>
            `;

            return;

        }


        list.innerHTML =
            StoreUser.users
                .map(
                    user => {

                        const id =
                            String(
                                user?.id ||
                                "-"
                            );


                        const username =
                            String(
                                user?.username ||
                                "-"
                            );


                        const nama =
                            String(
                                user?.nama ||
                                "-"
                            );


                        const role =
                            String(
                                user?.role ||
                                "-"
                            )
                                .toUpperCase();


                        const status =
                            String(
                                user?.status ||
                                "-"
                            )
                                .toUpperCase();


                        const statusClass =
                            status ===
                            "AKTIF"
                                ? "is-active"
                                : "is-inactive";


                        return `
                            <div
                                class="store-user-row"
                                data-user-id="${this.escapeAttribute(
                                    id
                                )}"
                            >

                                <div class="store-user-info">

                                    <div class="store-user-main">

                                        <strong>
                                            ${this.escapeHtml(
                                                nama
                                            )}
                                        </strong>

                                        <span>
                                            ${this.escapeHtml(
                                                id
                                            )}
                                        </span>

                                    </div>


                                    <div class="store-user-detail">

                                        ${this.escapeHtml(
                                            username
                                        )}

                                    </div>


                                    <div class="store-user-meta">

                                        <span
                                            class="store-user-role"
                                        >
                                            ${this.escapeHtml(
                                                role
                                            )}
                                        </span>


                                        <span
                                            class="
                                                store-user-status
                                                ${statusClass}
                                            "
                                        >
                                            ${this.escapeHtml(
                                                status
                                            )}
                                        </span>

                                    </div>

                                </div>


                                <div class="store-user-actions">

                                    <button
                                        type="button"
                                        class="
                                            config-button
                                            store-user-edit-button
                                        "
                                        data-edit-user="${this.escapeAttribute(
                                            id
                                        )}"
                                    >
                                        Edit
                                    </button>


                                    <button
                                        type="button"
                                        class="
                                            config-button
                                            store-user-remove-button
                                        "
                                        data-delete-user="${this.escapeAttribute(
                                            id
                                        )}"
                                    >
                                        Hapus
                                    </button>

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");


        this.bindUserActions();

    },


    bindUserActions() {

        document
            .querySelectorAll(
                "[data-edit-user]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                button.getAttribute(
                                    "data-edit-user"
                                );


                            StoreUser.openEditModal(
                                id
                            );

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                "[data-delete-user]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                button.getAttribute(
                                    "data-delete-user"
                                );


                            StoreUser.openDeleteModal(
                                id
                            );

                        }
                    );

                }
            );

    },


    showListMessage(text) {

        const list =
            document.getElementById(
                "storeUserList"
            );


        if (!list) {

            return;

        }


        list.innerHTML = `
            <div class="store-user-empty">

                ${this.escapeHtml(
                    text
                )}

            </div>
        `;

    },


    // ==================================
    // ESCAPE HTML
    // ==================================

    escapeHtml(
        value
    ) {

        return String(
            value ?? ""
        )
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    },


    // ==================================
    // ESCAPE ATTRIBUTE
    // ==================================

    escapeAttribute(
        value
    ) {

        return this.escapeHtml(
            value
        );

    }

};