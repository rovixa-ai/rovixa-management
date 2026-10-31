
 // ======================================
// STORE CONFIG
// TREEHOUSE MANAGEMENT
// ======================================

const StoreConfig = {

    config: {},

    logoValue: "",

    bootstrapData: null,


    // ==================================
    // INIT
    // ==================================

    async init() {

        this.event();

        const configLoad =
            this.load();

        StoreUser.init();

        await configLoad;

    },


    // ==================================
    // LOAD
    // ==================================

    async load() {

        try {

            const response =
                await API.getBootstrap();

            if (
                !response ||
                response.success !== true
            ) {
                throw new Error(
                    response?.message ||
                    "Gagal mengambil konfigurasi toko."
                );
            }

            const data =
                response.data || {};

            this.bootstrapData =
                data;

            this.config =
                data.storeConfig || {};


            // ==============================
            // IDENTITAS TOKO
            // ==============================

            this.setValue(
                "storeConfigName",
                this.getConfigValue(
                    "STORE_NAME",
                    "storeName"
                )
            );

            this.setValue(
                "storeConfigAddress",
                this.getConfigValue(
                    "STORE_ADDRESS",
                    "storeAddress"
                )
            );

            this.setValue(
                "storeConfigPhone",
                this.getConfigValue(
                    "STORE_PHONE",
                    "storePhone"
                )
            );

            this.setValue(
                "storeConfigEmail",
                this.getConfigValue(
                    "STORE_EMAIL",
                    "storeEmail"
                )
            );

            this.setValue(
                "storeConfigDescription",
                this.getConfigValue(
                    "STORE_DESCRIPTION",
                    "storeDescription"
                )
            );

            this.setValue(
                "storeConfigStatus",
                this.getConfigValue(
                    "STORE_STATUS",
                    "storeStatus"
                )
            );


            // ==============================
            // LOGO
            // ==============================

            const logoSource =
                this.getConfigValue(
                    "LOGO_SOURCE",
                    "logoSource"
                );

            const logoDrive =
                this.getConfigValue(
                    "LOGO_DRIVE",
                    "logoDrive"
                );

            const logoUrl =
                this.getConfigValue(
                    "LOGO_URL",
                    "logoUrl"
                );

            const logo =
                this.getConfigValue(
                    "LOGO",
                    "logo"
                );

            this.setValue(
                "storeConfigLogoSource",
                logoSource
            );

            this.setValue(
                "storeConfigLogoDrive",
                logoDrive
            );

            this.setValue(
                "storeConfigLogoUrl",
                logoUrl
            );

            this.logoValue =
                String(
                    logo || ""
                ).trim();

            this.loadLogo();


            // ==============================
            // CURRENCY
            // ==============================

            this.setValue(
                "storeConfigCurrency",
                this.getConfigValue(
                    "CURRENCY",
                    "currency"
                )
            );


            // ==============================
            // TAX
            // ==============================

            this.setValue(
                "storeConfigTaxEnabled",
                this.toBooleanString(
                    this.getConfigValue(
                        "TAX_ENABLED",
                        "taxEnabled"
                    )
                )
            );

            this.setValue(
                "storeConfigTaxPercent",
                this.getConfigValue(
                    "TAX_PERCENT",
                    "taxPercent"
                )
            );


            // ==============================
            // DISCOUNT
            // ==============================

            this.setValue(
                "storeConfigDiscountEnabled",
                this.toBooleanString(
                    this.getConfigValue(
                        "DISCOUNT_ENABLED",
                        "discountEnabled"
                    )
                )
            );


            // ==============================
            // PREFIX
            // ==============================

            this.setValue(
                "storeConfigProductPrefix",
                this.getConfigValue(
                    "PRODUCT_PREFIX",
                    "productPrefix"
                )
            );

            this.setValue(
                "storeConfigTransactionPrefix",
                this.getConfigValue(
                    "TRANSACTION_PREFIX",
                    "transactionPrefix"
                )
            );


            // ==============================
            // RECEIPT
            // ==============================

            this.setValue(
                "storeConfigReceiptHeader",
                this.getConfigValue(
                    "RECEIPT_HEADER",
                    "receiptHeader"
                )
            );

            this.setValue(
                "storeConfigReceiptFooter",
                this.getConfigValue(
                    "RECEIPT_FOOTER",
                    "receiptFooter"
                )
            );


            // ==============================
            // QRIS
            // ==============================

            this.setValue(
                "storeConfigQrisEnabled",
                this.toBooleanString(
                    this.getConfigValue(
                        "QRIS_ENABLED",
                        "qrisEnabled"
                    )
                )
            );

            this.setValue(
                "storeConfigQrisProvider",
                this.getConfigValue(
                    "QRIS_PROVIDER",
                    "qrisProvider"
                )
            );

            this.setValue(
                "storeConfigQrisMerchantId",
                this.getConfigValue(
                    "QRIS_MERCHANT_ID",
                    "qrisMerchantId"
                )
            );

            this.setValue(
                "storeConfigQrisApiUrl",
                this.getConfigValue(
                    "QRIS_API_URL",
                    "qrisApiUrl"
                )
            );

            this.setValue(
                "storeConfigQrisApiKey",
                this.getConfigValue(
                    "QRIS_API_KEY",
                    "qrisApiKey"
                )
            );

            this.setValue(
                "storeConfigQrisSecretKey",
                this.getConfigValue(
                    "QRIS_SECRET_KEY",
                    "qrisSecretKey"
                )
            );

            this.setValue(
                "storeConfigQrisCallbackUrl",
                this.getConfigValue(
                    "QRIS_CALLBACK_URL",
                    "qrisCallbackUrl"
                )
            );

            this.setValue(
                "storeConfigQrisStoreId",
                this.getConfigValue(
                    "QRIS_STORE_ID",
                    "qrisStoreId"
                )
            );


            // ==============================
            // TIMEZONE
            // ==============================

            this.setValue(
                "storeConfigTimezone",
                this.getConfigValue(
                    "TIMEZONE",
                    "timezone"
                )
            );

            this.setValue(
                "storeConfigStoreTimezone",
                this.getConfigValue(
                    "STORE_TIMEZONE",
                    "storeTimezone"
                )
            );


            this.message(
                "Konfigurasi toko berhasil dimuat.",
                "success"
            );

        } catch (error) {

            console.error(
                "STORE CONFIG LOAD ERROR:",
                error
            );

            this.message(
                error.message ||
                "Gagal memuat konfigurasi toko.",
                "error"
            );

        }

    },


    // ==================================
    // SAVE
    // ==================================

    async save() {

        try {

            // ==============================
            // SIAPKAN DATA LOGO
            // ==============================

            const logoSource =
                this.value(
                    "storeConfigLogoSource"
                )
                    .trim()
                    .toLowerCase();

            const logoDrive =
                this.value(
                    "storeConfigLogoDrive"
                ).trim();

            const logoUrl =
                this.value(
                    "storeConfigLogoUrl"
                ).trim();

            let activeLogo = "";

            switch (logoSource) {

                case "none":

                    activeLogo = "";

                    break;

                case "drive":

                    activeLogo = logoDrive;

                    break;

                case "url":

                    activeLogo = logoUrl;

                    break;

                case "upload":

                    activeLogo =
                        this.logoValue || "";

                    break;

                default:

                    activeLogo = "";

                    break;

            }


            // ==============================
            // DATA KONFIGURASI
            // ==============================

            const data = {

               

                STORE_NAME:
                    this.value(
                        "storeConfigName"
                    ).trim(),

                STORE_ADDRESS:
                    this.value(
                        "storeConfigAddress"
                    ).trim(),

                STORE_PHONE:
                    this.value(
                        "storeConfigPhone"
                    ).trim(),

                STORE_EMAIL:
                    this.value(
                        "storeConfigEmail"
                    ).trim(),

                STORE_DESCRIPTION:
                    this.value(
                        "storeConfigDescription"
                    ).trim(),

                STORE_STATUS:
                    this.value(
                        "storeConfigStatus"
                    ).trim(),


                // LOGO
                LOGO_SOURCE:
                    logoSource,

                LOGO_DRIVE:
                    logoDrive,

                LOGO_URL:
                    logoUrl,

                LOGO:
                    activeLogo,


                // CURRENCY
                CURRENCY:
                    this.value(
                        "storeConfigCurrency"
                    ).trim(),


                // TAX
                TAX_ENABLED:
                    this.value(
                        "storeConfigTaxEnabled"
                    ).trim(),

                TAX_PERCENT:
                    this.value(
                        "storeConfigTaxPercent"
                    ).trim(),


                // DISCOUNT
                DISCOUNT_ENABLED:
                    this.value(
                        "storeConfigDiscountEnabled"
                    ).trim(),


                // PREFIX
                PRODUCT_PREFIX:
                    this.value(
                        "storeConfigProductPrefix"
                    ).trim(),

                TRANSACTION_PREFIX:
                    this.value(
                        "storeConfigTransactionPrefix"
                    ).trim(),


                // RECEIPT
                RECEIPT_HEADER:
                    this.value(
                        "storeConfigReceiptHeader"
                    ).trim(),

                RECEIPT_FOOTER:
                    this.value(
                        "storeConfigReceiptFooter"
                    ).trim(),


                // QRIS
                QRIS_ENABLED:
                    this.value(
                        "storeConfigQrisEnabled"
                    ).trim(),

                QRIS_PROVIDER:
                    this.value(
                        "storeConfigQrisProvider"
                    ).trim(),

                QRIS_MERCHANT_ID:
                    this.value(
                        "storeConfigQrisMerchantId"
                    ).trim(),

                QRIS_API_URL:
                    this.value(
                        "storeConfigQrisApiUrl"
                    ).trim(),

                QRIS_API_KEY:
                    this.value(
                        "storeConfigQrisApiKey"
                    ).trim(),

                QRIS_SECRET_KEY:
                    this.value(
                        "storeConfigQrisSecretKey"
                    ).trim(),

                QRIS_CALLBACK_URL:
                    this.value(
                        "storeConfigQrisCallbackUrl"
                    ).trim(),

                QRIS_STORE_ID:
                    this.value(
                        "storeConfigQrisStoreId"
                    ).trim(),


                // TIMEZONE
                TIMEZONE:
                    this.value(
                        "storeConfigTimezone"
                    ).trim(),

                STORE_TIMEZONE:
                    this.value(
                        "storeConfigStoreTimezone"
                    ).trim()

            };
            


            // ==============================
            // VALIDASI
            // ==============================

            if (!data.STORE_NAME) {

                throw new Error(
                    "Nama toko wajib diisi."
                );

            }

            if (
                data.LOGO_SOURCE === "drive" &&
                !data.LOGO_DRIVE
            ) {

                throw new Error(
                    "URL Google Drive untuk logo wajib diisi."
                );

            }

            if (
                data.LOGO_SOURCE === "url" &&
                !data.LOGO_URL
            ) {

                throw new Error(
                    "URL logo wajib diisi."
                );

            }

            if (
                data.LOGO_SOURCE === "upload" &&
                !data.LOGO
            ) {

                throw new Error(
                    "Silakan pilih file logo terlebih dahulu."
                );

            }


            // ==============================
            // SIMPAN KE SERVER
            // ==============================

            const response =
                await API.saveStoreConfig(
                    data
                );


            if (
                !response ||
                response.success !== true
            ) {

                throw new Error(
                    response?.message ||
                    "Gagal menyimpan konfigurasi toko."
                );

            }


            // ==============================
            // PERBARUI KONFIGURASI LOKAL
            // ==============================

            this.config = {
                ...this.config,
                ...data
            };


            this.message(
                "Konfigurasi toko berhasil disimpan.",
                "success"
            );


        } catch (error) {

            console.error(
                "STORE CONFIG SAVE ERROR:",
                error
            );

            this.message(
                error.message ||
                "Gagal menyimpan konfigurasi toko.",
                "error"
            );

        }

    },


    // ==================================
    // EVENT
    // ==================================

    event() {

        StoreConfigEvent.event();

    },


    // ==================================
    // ACCORDION
    // ==================================

    initAccordion() {

        StoreConfigAccordion.initAccordion();

    },


    toggleAccordion(
        section,
        sections
    ) {

        StoreConfigAccordion.toggleAccordion(
            section,
            sections
        );

    },


    // ==================================
    // LOGO
    // ==================================

    logoSourceChanged() {

        StoreConfigLogo.logoSourceChanged();

    },


    logoFileChanged(event) {

        StoreConfigLogo.logoFileChanged(
            event
        );

    },


    readImageFile(file) {

        return StoreConfigLogo.readImageFile(
            file
        );

    },


    loadLogo() {

        StoreConfigLogo.loadLogo();

    },


    isGoogleDriveUrl(url) {

        return StoreConfigLogo.isGoogleDriveUrl(
            url
        );

    },


    getGoogleDriveFileId(url) {

        return StoreConfigLogo.getGoogleDriveFileId(
            url
        );

    },


    getLogoImageUrl(value) {

        return StoreConfigLogo.getLogoImageUrl(
            value
        );

    },


    previewLogo(value) {

        StoreConfigLogo.previewLogo(
            value
        );

    },


    hideLogoPreview() {

        StoreConfigLogo.hideLogoPreview();

    },


    // ==================================
    // PAGE
    // ==================================

    page() {

        return StoreConfigRender.page();

    },


    // ==================================
    // HELPER
    // ==================================

    getStoreName() {

        return this.getConfigValue(
            "STORE_NAME",
            "storeName"
        );

    },


    getConfigValue(
        primaryKey,
        fallbackKey
    ) {

        if (
            this.config &&
            this.config[primaryKey] !== undefined &&
            this.config[primaryKey] !== null
        ) {

            return this.config[primaryKey];

        }

        if (
            fallbackKey &&
            this.config &&
            this.config[fallbackKey] !== undefined &&
            this.config[fallbackKey] !== null
        ) {

            return this.config[fallbackKey];

        }

        return "";

    },


    toBooleanString(value) {

        if (
            value === true ||
            value === 1 ||
            String(value)
                .trim()
                .toLowerCase() === "true" ||
            String(value)
                .trim()
                .toLowerCase() === "aktif" ||
            String(value)
                .trim()
                .toLowerCase() === "yes"
        ) {

            return "true";

        }

        return "false";

    },


    setValue(
        id,
        value
    ) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.value =
            value ?? "";

    },


    value(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return "";
        }

        return element.value ?? "";

    },


    escapeHtml(value) {

        return String(value ?? "")
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


    message(
        text,
        type = "info"
    ) {

        const element =
            document.getElementById(
                "storeConfigMessage"
            );

        if (!element) {
            return;
        }

        element.textContent =
            text || "";

        element.className =
            "store-config-message";

        element.classList.add(
            `is-${type}`
        );

    }

};
