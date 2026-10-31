const StoreConfigDesktopRender = {

    page() {

        return `
            <div class="config-page">

                <div class="config-header">

                    <div>

                        <h2>
                            Config Toko
                        </h2>

                        <p>
                            Pengaturan utama toko
                        </p>

                    </div>

                </div>


                <div class="config-card">


                    <!-- ==================================
                         INFORMASI TOKO
                         ================================== -->

                    <div class="config-section">

                        <button
                            type="button"
                            class="config-section-title config-accordion-toggle"
                            data-config-toggle
                            aria-expanded="false"
                        >

                            <strong>
                                Informasi Toko
                            </strong>

                            <span>
                                Informasi identitas toko
                                yang digunakan oleh
                                seluruh aplikasi.
                            </span>

                            <span
                                class="config-accordion-icon"
                                aria-hidden="true"
                            ></span>

                        </button>


                        <div
                            class="config-section-content"
                            data-config-content
                        >


                            <div class="config-field">

                                <label>
                                    Nama Toko
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigName"
                                    class="config-input"
                                    placeholder="Masukkan nama toko"
                                    autocomplete="off"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Alamat
                                </label>

                                <textarea
                                    id="storeConfigAddress"
                                    class="config-input config-textarea"
                                    placeholder="Masukkan alamat toko"
                                ></textarea>

                            </div>


                            <div class="config-field">

                                <label>
                                    Nomor Telepon
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigPhone"
                                    class="config-input"
                                    placeholder="Masukkan nomor telepon"
                                    autocomplete="off"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="storeConfigEmail"
                                    class="config-input"
                                    placeholder="Masukkan email toko"
                                    autocomplete="off"
                                />

                            </div>


                            <!-- ==================================
                                 LOGO TOKO
                                 ================================== -->

                            <div class="config-field">

                                <label>
                                    Logo Toko
                                </label>


                                <select
                                    id="storeConfigLogoSource"
                                    class="config-input"
                                >

                                    <option value="none">
                                        Tanpa Logo
                                    </option>

                                    <option value="upload">
                                        Upload Gambar
                                    </option>

                                    <option value="drive">
                                        Google Drive
                                    </option>

                                    <option value="url">
                                        Link Internet
                                    </option>

                                </select>

                            </div>


                            <div
                                class="config-field"
                                id="storeConfigLogoUploadField"
                                style="display:none;"
                            >

                                <label>
                                    Pilih Gambar
                                </label>

                                <input
                                    type="file"
                                    id="storeConfigLogoFile"
                                    class="config-input"
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                />

                            </div>


                            <div
                                class="config-field"
                                id="storeConfigLogoDriveField"
                                style="display:none;"
                            >

                                <label>
                                    Link Google Drive
                                </label>

                                <input
                                    type="url"
                                    id="storeConfigLogoDrive"
                                    class="config-input"
                                    placeholder="https://drive.google.com/file/d/..."
                                    autocomplete="off"
                                />

                            </div>


                            <div
                                class="config-field"
                                id="storeConfigLogoUrlField"
                                style="display:none;"
                            >

                                <label>
                                    URL Gambar
                                </label>

                                <input
                                    type="url"
                                    id="storeConfigLogoUrl"
                                    class="config-input"
                                    placeholder="https://example.com/logo.png"
                                    autocomplete="off"
                                />

                            </div>


                            <div
                                class="config-field"
                                id="storeConfigLogoPreviewField"
                                style="display:none;"
                            >

                                <label>
                                    Preview Logo
                                </label>

                                <div
                                    id="storeConfigLogoPreview"
                                    style="
                                        display:flex;
                                        align-items:center;
                                        justify-content:center;
                                        width:140px;
                                        height:140px;
                                        border:1px solid #ddd;
                                        border-radius:8px;
                                        overflow:hidden;
                                        background:#f8f8f8;
                                        font-size:32px;
                                        font-weight:600;
                                    "
                                ></div>

                            </div>


                            <div class="config-field">

                                <label>
                                    Deskripsi Toko
                                </label>

                                <textarea
                                    id="storeConfigDescription"
                                    class="config-input config-textarea"
                                    placeholder="Masukkan deskripsi toko"
                                ></textarea>

                            </div>


                            <div class="config-field">

                                <label>
                                    Status Toko
                                </label>

                                <select
                                    id="storeConfigStatus"
                                    class="config-input"
                                >

                                    <option value="">
                                        Pilih Status
                                    </option>

                                    <option value="ACTIVE">
                                        Aktif
                                    </option>

                                    <option value="INACTIVE">
                                        Tidak Aktif
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>


                    <!-- ==================================
                         PENJUALAN
                         ================================== -->

                    <div class="config-section">

                        <button
                            type="button"
                            class="config-section-title config-accordion-toggle"
                            data-config-toggle
                            aria-expanded="false"
                        >

                            <strong>
                                Penjualan
                            </strong>

                            <span>
                                Pengaturan transaksi
                                penjualan.
                            </span>

                            <span
                                class="config-accordion-icon"
                                aria-hidden="true"
                            ></span>

                        </button>


                        <div
                            class="config-section-content"
                            data-config-content
                        >


                            <div class="config-field">

                                <label>
                                    Mata Uang
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigCurrency"
                                    class="config-input"
                                    placeholder="IDR"
                                    autocomplete="off"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Pajak
                                </label>

                                <select
                                    id="storeConfigTaxEnabled"
                                    class="config-input"
                                >

                                    <option value="false">
                                        Tidak
                                    </option>

                                    <option value="true">
                                        Ya
                                    </option>

                                </select>

                            </div>


                            <div class="config-field">

                                <label>
                                    Persentase Pajak
                                </label>

                                <input
                                    type="number"
                                    id="storeConfigTaxPercent"
                                    class="config-input"
                                    min="0"
                                    step="0.01"
                                    placeholder="0"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Diskon
                                </label>

                                <select
                                    id="storeConfigDiscountEnabled"
                                    class="config-input"
                                >

                                    <option value="false">
                                        Tidak
                                    </option>

                                    <option value="true">
                                        Ya
                                    </option>

                                </select>

                            </div>


                            <div class="config-field">

                                <label>
                                    Prefix Produk
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigProductPrefix"
                                    class="config-input"
                                    placeholder="BRG"
                                    autocomplete="off"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Prefix Transaksi
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigTransactionPrefix"
                                    class="config-input"
                                    placeholder="TRX"
                                    autocomplete="off"
                                />

                            </div>

                        </div>

                    </div>


                    <!-- ==================================
                         STRUK
                         ================================== -->

                    <div class="config-section">

                        <button
                            type="button"
                            class="config-section-title config-accordion-toggle"
                            data-config-toggle
                            aria-expanded="false"
                        >

                            <strong>
                                Struk
                            </strong>

                            <span>
                                Informasi yang ditampilkan
                                pada struk transaksi.
                            </span>

                            <span
                                class="config-accordion-icon"
                                aria-hidden="true"
                            ></span>

                        </button>


                        <div
                            class="config-section-content"
                            data-config-content
                        >


                            <div class="config-field">

                                <label>
                                    Header Struk
                                </label>

                                <textarea
                                    id="storeConfigReceiptHeader"
                                    class="config-input config-textarea"
                                    placeholder="Informasi bagian atas struk"
                                ></textarea>

                            </div>


                            <div class="config-field">

                                <label>
                                    Footer Struk
                                </label>

                                <textarea
                                    id="storeConfigReceiptFooter"
                                    class="config-input config-textarea"
                                    placeholder="Informasi bagian bawah struk"
                                ></textarea>

                            </div>

                        </div>

                    </div>


                    <!-- ==================================
                         QRIS
                         ================================== -->

                    <div class="config-section">

                        <button
                            type="button"
                            class="config-section-title config-accordion-toggle"
                            data-config-toggle
                            aria-expanded="false"
                        >

                            <strong>
                                QRIS
                            </strong>

                            <span>
                                Pengaturan koneksi QRIS
                                untuk transaksi pembayaran.
                            </span>

                            <span
                                class="config-accordion-icon"
                                aria-hidden="true"
                            ></span>

                        </button>


                        <div
                            class="config-section-content"
                            data-config-content
                        >


                            <div class="config-field">

                                <label>
                                    QRIS
                                </label>

                                <select
                                    id="storeConfigQrisEnabled"
                                    class="config-input"
                                >

                                    <option value="false">
                                        Tidak Aktif
                                    </option>

                                    <option value="true">
                                        Aktif
                                    </option>

                                </select>

                            </div>


                            <div class="config-field">

                                <label>
                                    Provider
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigQrisProvider"
                                    class="config-input"
                                    placeholder="Nama provider QRIS"
                                    autocomplete="off"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Merchant ID
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigQrisMerchantId"
                                    class="config-input"
                                    placeholder="Merchant ID"
                                    autocomplete="off"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    API URL
                                </label>

                                <input
                                    type="url"
                                    id="storeConfigQrisApiUrl"
                                    class="config-input"
                                    placeholder="https://..."
                                    autocomplete="off"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    API Key
                                </label>

                                <input
                                    type="password"
                                    id="storeConfigQrisApiKey"
                                    class="config-input"
                                    placeholder="API Key"
                                    autocomplete="new-password"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Secret Key
                                </label>

                                <input
                                    type="password"
                                    id="storeConfigQrisSecretKey"
                                    class="config-input"
                                    placeholder="Secret Key"
                                    autocomplete="new-password"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Callback URL
                                </label>

                                <input
                                    type="url"
                                    id="storeConfigQrisCallbackUrl"
                                    class="config-input"
                                    placeholder="https://..."
                                    autocomplete="off"
                                />

                            </div>


                            <div class="config-field">

                                <label>
                                    Store ID
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigQrisStoreId"
                                    class="config-input"
                                    placeholder="Store ID"
                                    autocomplete="off"
                                />

                            </div>

                        </div>

                    </div>


                    <!-- ==================================
                         SISTEM
                         ================================== -->

                    <div class="config-section">

                        <button
                            type="button"
                            class="config-section-title config-accordion-toggle"
                            data-config-toggle
                            aria-expanded="false"
                        >

                            <strong>
                                Sistem
                            </strong>

                            <span>
                                Pengaturan sistem toko.
                            </span>

                            <span
                                class="config-accordion-icon"
                                aria-hidden="true"
                            ></span>

                        </button>


                        <div
                            class="config-section-content"
                            data-config-content
                        >

                            <div class="config-field">

                                <label>
                                    Zona Waktu
                                </label>

                                <input
                                    type="text"
                                    id="storeConfigTimezone"
                                    class="config-input"
                                    placeholder="Asia/Jakarta"
                                    autocomplete="off"
                                />

                            </div>

                        </div>

                    </div>


                    


                    <div class="config-actions">

                        <button
                            type="button"
                            id="storeConfigSave"
                            class="config-button config-button-primary"
                        >
                            Simpan
                        </button>

                    </div>

                </div>


                <div
                    id="storeUserContainer"
                ></div>

            </div>
        `;
    }
};