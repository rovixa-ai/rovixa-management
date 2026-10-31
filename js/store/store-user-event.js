const StoreUserEvent = {

    event() {

        const addButton =
            document.getElementById(
                "storeUserAdd"
            );

        if (addButton) {

            addButton.addEventListener(
                "click",
                () => {

                    StoreUser.openAddModal();

                }
            );

        }


        const cancelButton =
            document.getElementById(
                "storeUserCancel"
            );

        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                () => {

                    StoreUser.closeModal();

                }
            );

        }


        const saveButton =
            document.getElementById(
                "storeUserSave"
            );

        if (saveButton) {

            saveButton.addEventListener(
                "click",
                () => {

                    StoreUser.save();

                }
            );

        }


        const nameInput =
            document.getElementById(
                "storeUserName"
            );

        if (nameInput) {

            nameInput.addEventListener(
                "input",
                () => {

                    StoreUser.handleNameInput();

                }
            );

        }


        const usernameInput =
            document.getElementById(
                "storeUserUsername"
            );

        if (usernameInput) {

            usernameInput.addEventListener(
                "input",
                () => {

                    StoreUser.handleUsernameInput();

                }
            );

        }


        const pinInput =
            document.getElementById(
                "storeUserPin"
            );

        if (pinInput) {

            pinInput.addEventListener(
                "input",
                () => {

                    pinInput.value =
                        pinInput.value.replace(
                            /\D/g,
                            ""
                        );

                }
            );

        }


        document
            .querySelectorAll(
                "[data-store-user-close]"
            )
            .forEach(
                element => {

                    element.addEventListener(
                        "click",
                        () => {

                            StoreUser.closeModal();

                        }
                    );

                }
            );


        const deleteCancelButton =
            document.getElementById(
                "storeUserDeleteCancel"
            );

        if (deleteCancelButton) {

            deleteCancelButton.addEventListener(
                "click",
                () => {

                    StoreUser.closeDeleteModal();

                }
            );

        }


        const deleteConfirmButton =
            document.getElementById(
                "storeUserDeleteConfirm"
            );

        if (deleteConfirmButton) {

            deleteConfirmButton.addEventListener(
                "click",
                () => {

                    StoreUser.confirmDelete();

                }
            );

        }


        document
            .querySelectorAll(
                "[data-store-user-delete-close]"
            )
            .forEach(
                element => {

                    element.addEventListener(
                        "click",
                        () => {

                            StoreUser.closeDeleteModal();

                        }
                    );

                }
            );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !==
                    "Escape"
                ) {

                    return;

                }


                const modal =
                    document.getElementById(
                        "storeUserModal"
                    );

                const deleteModal =
                    document.getElementById(
                        "storeUserDeleteModal"
                    );


                if (
                    modal &&
                    modal.classList.contains(
                        "is-open"
                    )
                ) {

                    StoreUser.closeModal();

                }


                if (
                    deleteModal &&
                    deleteModal.classList.contains(
                        "is-open"
                    )
                ) {

                    StoreUser.closeDeleteModal();

                }

            }
        );

    }

};