// ======================================
// STORE CONFIG LOGO
// TREEHOUSE MANAGEMENT
// ======================================

const StoreConfigLogo = {

    logoSourceChanged() {

        const source =
            document.getElementById(
                "storeConfigLogoSource"
            );

        if (!source) {
            return;
        }

        const value =
            String(source.value || "")
                .trim()
                .toLowerCase();

        const drive =
            document.getElementById(
                "storeConfigLogoDrive"
            );

        const url =
            document.getElementById(
                "storeConfigLogoUrl"
            );

        const file =
            document.getElementById(
                "storeConfigLogoFile"
            );

        this.setFieldVisibility(
            "storeConfigLogoDriveField",
            value === "drive"
        );

        this.setFieldVisibility(
            "storeConfigLogoUrlField",
            value === "url"
        );

        this.setFieldVisibility(
            "storeConfigLogoUploadField",
            value === "upload"
        );

        if (value === "none" || !value) {

            this.hideLogoPreview();
            return;

        }

        if (value === "drive") {

            this.previewLogo(
                drive?.value || ""
            );

            return;

        }

        if (value === "url") {

            this.previewLogo(
                url?.value || ""
            );

            return;

        }

        if (value === "upload") {

            if (
                file &&
                file.files &&
                file.files.length
            ) {
                return;
            }

            this.previewLogo(
                StoreConfig.logoValue || ""
            );

            return;

        }

        this.hideLogoPreview();

    },


    async logoFileChanged(event) {

        const file =
            event?.target?.files?.[0];

        if (!file) {
            return;
        }

        if (
            !file.type ||
            !file.type.startsWith("image/")
        ) {

            StoreConfig.message(
                "File logo harus berupa gambar.",
                "error"
            );

            return;

        }

        try {

            const value =
                await this.readImageFile(file);

            StoreConfig.logoValue = value;

            this.previewLogo(value);

        } catch (error) {

            console.error(
                "STORE CONFIG LOGO FILE ERROR:",
                error
            );

            StoreConfig.message(
                "Gagal membaca file logo.",
                "error"
            );

        }

    },


    readImageFile(file) {

    return new Promise((resolve, reject) => {

        if (!file) {
            reject(
                new Error("File logo tidak ditemukan.")
            );
            return;
        }

        const reader = new FileReader();

        reader.onerror = () => {
            reject(
                new Error("Gagal membaca file logo.")
            );
        };

        reader.onload = event => {

            const image = new Image();

            image.onerror = () => {
                reject(
                    new Error("Gagal memproses gambar logo.")
                );
            };

            image.onload = () => {

                try {

                    const canvas =
                        document.createElement("canvas");

                    // Batasi dimensi logo agar Base64 lebih kecil.
                    const maxWidth = 300;
                    const maxHeight = 300;

                    const scale = Math.min(
                        maxWidth / image.width,
                        maxHeight / image.height,
                        1
                    );

                    canvas.width = Math.max(
                        1,
                        Math.round(image.width * scale)
                    );

                    canvas.height = Math.max(
                        1,
                        Math.round(image.height * scale)
                    );

                    const context =
                        canvas.getContext("2d");

                    if (!context) {
                        reject(
                            new Error(
                                "Gagal memproses gambar logo."
                            )
                        );
                        return;
                    }

                    context.drawImage(
                        image,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    // JPEG umumnya lebih kecil daripada PNG.
                    // Gunakan kualitas bertahap sampai di bawah
                    // batas aman Google Sheets.
                    const maxCharacters = 45000;
                    const qualities = [
                        0.85,
                        0.70,
                        0.55,
                        0.40,
                        0.25
                    ];

                    let result = "";

                    for (const quality of qualities) {

                        result = canvas.toDataURL(
                            "image/jpeg",
                            quality
                        );

                        if (
                            result.length <= maxCharacters
                        ) {
                            break;
                        }

                    }

                    // Jika masih terlalu besar, kecilkan dimensi
                    // secara bertahap sambil mempertahankan rasio.
                    while (
                        result.length > maxCharacters &&
                        canvas.width > 64 &&
                        canvas.height > 64
                    ) {

                        canvas.width = Math.max(
                            64,
                            Math.round(canvas.width * 0.75)
                        );

                        canvas.height = Math.max(
                            64,
                            Math.round(canvas.height * 0.75)
                        );

                        context.drawImage(
                            image,
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );

                        result = canvas.toDataURL(
                            "image/jpeg",
                            0.25
                        );

                    }

                    if (
                        !result ||
                        result.length > maxCharacters
                    ) {
                        reject(
                            new Error(
                                "Ukuran logo masih terlalu besar. " +
                                "Silakan gunakan gambar yang lebih kecil."
                            )
                        );
                        return;
                    }

                    resolve(result);

                } catch (error) {

                    reject(error);

                }

            };

            image.src = event.target.result;

        };

        reader.readAsDataURL(file);

    });

},


    loadLogo() {

        const source =
            document.getElementById(
                "storeConfigLogoSource"
            );

        const drive =
            document.getElementById(
                "storeConfigLogoDrive"
            );

        const url =
            document.getElementById(
                "storeConfigLogoUrl"
            );

        const config =
            StoreConfig.config || {};

        const logoSource =
            String(
                config.LOGO_SOURCE ??
                config.logoSource ??
                ""
            )
                .trim()
                .toLowerCase();

        const logoDrive =
            String(
                config.LOGO_DRIVE ??
                config.logoDrive ??
                ""
            ).trim();

        const logoUrl =
            String(
                config.LOGO_URL ??
                config.logoUrl ??
                ""
            ).trim();

        const logoValue =
            String(
                config.LOGO ??
                config.logo ??
                ""
            ).trim();

        if (source) {

            source.value =
                logoSource || "url";

        }

        if (drive) {
            drive.value = logoDrive;
        }

        if (url) {
            url.value = logoUrl;
        }

        StoreConfig.logoValue = logoValue;

        this.logoSourceChanged();

        const selectedSource =
            String(
                source?.value || "url"
            )
                .trim()
                .toLowerCase();

        if (selectedSource === "none") {

            this.hideLogoPreview();

        } else if (selectedSource === "upload") {

            this.previewLogo(logoValue);

        } else if (selectedSource === "drive") {

            this.previewLogo(
                logoDrive || logoValue
            );

        } else if (selectedSource === "url") {

            this.previewLogo(
                logoUrl || logoValue
            );

        } else {

            this.hideLogoPreview();

        }

    },


    setFieldVisibility(id, visible) {

        const field =
            document.getElementById(id);

        if (!field) {
            return;
        }

        field.style.display =
            visible ? "" : "none";

        field.classList.toggle(
            "is-hidden",
            !visible
        );

    },


    isGoogleDriveUrl(url) {

        return /drive\.google\.com/i.test(
            String(url || "")
        );

    },


    getGoogleDriveFileId(url) {

        const value =
            String(url || "").trim();

        const patterns = [
            /\/file\/d\/([a-zA-Z0-9_-]+)/,
            /\/d\/([a-zA-Z0-9_-]+)/,
            /[?&]id=([a-zA-Z0-9_-]+)/
        ];

        for (const pattern of patterns) {

            const match =
                value.match(pattern);

            if (match && match[1]) {
                return match[1];
            }

        }

        return "";

    },


    getLogoImageUrl(value) {

        const url =
            String(value || "").trim();

        if (!url) {
            return "";
        }

        if (this.isGoogleDriveUrl(url)) {

            const fileId =
                this.getGoogleDriveFileId(url);

            if (!fileId) {
                return "";
            }

            return (
                "https://drive.google.com/uc?export=view&id=" +
                encodeURIComponent(fileId)
            );

        }

        if (/^https?:\/\//i.test(url)) {
            return url;
        }

        if (url.startsWith("data:image/")) {
            return url;
        }

        return "";

    },


    previewLogo(value) {

        const preview =
            document.getElementById(
                "storeConfigLogoPreview"
            );

        if (!preview) {
            return;
        }

        const imageUrl =
            this.getLogoImageUrl(value);

        if (!imageUrl) {

            this.hideLogoPreview();
            return;

        }

        this.setFieldVisibility(
            "storeConfigLogoPreviewField",
            true
        );

        preview.innerHTML = "";

        const image =
            document.createElement("img");

        image.src = imageUrl;
        image.alt = "Logo Toko";

        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "contain";

        preview.appendChild(image);

    },


    hideLogoPreview() {

        const preview =
            document.getElementById(
                "storeConfigLogoPreview"
            );

        if (preview) {
            preview.innerHTML = "";
        }

        this.setFieldVisibility(
            "storeConfigLogoPreviewField",
            false
        );

    }

};