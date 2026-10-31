// store-user-mobile-render.js

// ======================================
// TREEHOUSE POS
// STORE USER
// MOBILE RENDER
// ======================================

const StoreUserMobileRender = {

    page() {

        return `
            <div class="config-card store-user-card">

                <div class="store-user-header">

                    <div class="config-section-title">

                        <strong>
                            Login Kasir
                        </strong>

                    </div>


                    <button
                        type="button"
                        id="storeUserAdd"
                        class="
                            config-button
                            config-button-primary
                            store-user-add-button
                        "
                    >
                        + Tambah Kasir
                    </button>

                </div>


                <div class="store-user-list-section">

                    <div class="store-user-list-title">

                        <strong>
                            Daftar Kasir
                        </strong>

                        <span id="storeUserCount">
                            0 kasir
                        </span>

                    </div>


                    <div
                        id="storeUserList"
                        class="store-user-list"
                    ></div>

                </div>

            </div>


            <!-- ==================================
                 MODAL TAMBAH / EDIT
                 ================================== -->

            <div
                id="storeUserModal"
                class="store-user-modal"
                aria-hidden="true"
            >

                <div
                    class="store-user-modal-backdrop"
                    data-store-user-close
                ></div>


                <div
                    class="store-user-modal-dialog"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="storeUserModalTitle"
                >

                    <div class="store-user-modal-header">

                        <div>

                            <h3 id="storeUserModalTitle">
                                Tambah Kasir
                            </h3>

                            <p id="storeUserModalDescription">
                                Tambahkan akun kasir baru.
                            </p>

                        </div>


                        <button
                            type="button"
                            class="store-user-modal-close"
                            data-store-user-close
                            aria-label="Tutup"
                        >
                            ×
                        </button>

                    </div>


                    <div class="store-user-modal-body">

                        <div
                            id="storeUserMessage"
                            class="config-status"
                        ></div>


                        <div class="config-field">

                            <label for="storeUserId">
                                ID Kasir
                            </label>

                            <input
                                type="text"
                                id="storeUserId"
                                class="config-input"
                                placeholder="Otomatis"
                                autocomplete="off"
                                readonly
                            />

                        </div>


                        <div class="config-field">

                            <label for="storeUserUsername">
                                Username
                            </label>

                            <input
                                type="text"
                                id="storeUserUsername"
                                class="config-input"
                                placeholder="Otomatis dari nama kasir"
                                autocomplete="off"
                            />

                            <small
                                id="storeUserUsernameHint"
                                class="store-user-field-hint"
                            >
                                Username dibuat otomatis dari nama kasir.
                            </small>

                        </div>


                        <div class="config-field">

                            <label for="storeUserName">
                                Nama Kasir
                            </label>

                            <input
                                type="text"
                                id="storeUserName"
                                class="config-input"
                                placeholder="Masukkan nama kasir"
                                autocomplete="off"
                            />

                        </div>


                        <div class="config-field">

                            <label for="storeUserPin">
                                PIN
                            </label>

                            <input
                                type="password"
                                id="storeUserPin"
                                class="config-input"
                                placeholder="Masukkan PIN"
                                inputmode="numeric"
                                autocomplete="new-password"
                            />

                            <small
                                id="storeUserPinHint"
                                class="store-user-field-hint"
                            ></small>

                        </div>


                        <div class="config-field">

                            <label for="storeUserRole">
                                Role
                            </label>

                            <select
                                id="storeUserRole"
                                class="config-input"
                            >

                                <option value="KASIR">
                                    Kasir
                                </option>

                                <option value="ADMIN">
                                    Admin
                                </option>

                            </select>

                        </div>


                        <div class="config-field">

                            <label for="storeUserStatus">
                                Status
                            </label>

                            <select
                                id="storeUserStatus"
                                class="config-input"
                            >

                                <option value="AKTIF">
                                    Aktif
                                </option>

                                <option value="NONAKTIF">
                                    Tidak Aktif
                                </option>

                            </select>

                        </div>

                    </div>


                    <div class="store-user-modal-footer">

                        <button
                            type="button"
                            id="storeUserCancel"
                            class="config-button"
                        >
                            Batal
                        </button>


                        <button
                            type="button"
                            id="storeUserSave"
                            class="
                                config-button
                                config-button-primary
                            "
                        >
                            Simpan
                        </button>

                    </div>

                </div>

            </div>


            <!-- ==================================
                 MODAL HAPUS
                 ================================== -->

            <div
                id="storeUserDeleteModal"
                class="store-user-modal"
                aria-hidden="true"
            >

                <div
                    class="store-user-modal-backdrop"
                    data-store-user-delete-close
                ></div>


                <div
                    class="
                        store-user-modal-dialog
                        store-user-delete-dialog
                    "
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="storeUserDeleteTitle"
                >

                    <div class="store-user-modal-header">

                        <div>

                            <h3 id="storeUserDeleteTitle">
                                Hapus Kasir
                            </h3>

                            <p>
                                Konfirmasi penghapusan akun kasir.
                            </p>

                        </div>


                        <button
                            type="button"
                            class="store-user-modal-close"
                            data-store-user-delete-close
                            aria-label="Tutup"
                        >
                            ×
                        </button>

                    </div>


                    <div class="store-user-delete-body">

                        <p>
                            Yakin ingin menghapus akun kasir:
                        </p>

                        <strong id="storeUserDeleteName">
                            -
                        </strong>

                        <span id="storeUserDeleteId">
                            -
                        </span>

                    </div>


                    <div class="store-user-modal-footer">

                        <button
                            type="button"
                            id="storeUserDeleteCancel"
                            class="config-button"
                        >
                            Batal
                        </button>


                        <button
                            type="button"
                            id="storeUserDeleteConfirm"
                            class="
                                config-button
                                store-user-delete-button
                            "
                        >
                            Hapus
                        </button>

                    </div>

                </div>

            </div>
        `;

    }

};