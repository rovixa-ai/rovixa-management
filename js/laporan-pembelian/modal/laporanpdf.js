const LaporanPembelianPdfModal = {

    async open() {

        this.removeExisting();

        this.render();

        const modal =
            document.getElementById(
                "laporan-pembelian-pdf-modal"
            );

        if (!modal) return;

        modal.classList.add("show");

        await this.load();

    },


    close() {

        const modal =
            document.getElementById(
                "laporan-pembelian-pdf-modal"
            );

        if (!modal) return;

        modal.classList.remove("show");

        setTimeout(() => {

            this.removeExisting();

        }, 200);

    },


    removeExisting() {

        const existing =
            document.getElementById(
                "laporan-pembelian-pdf-modal"
            );

        if (existing) {
            existing.remove();
        }

    },


    render() {

        const modal =
            document.createElement("div");

        modal.id =
            "laporan-pembelian-pdf-modal";

        modal.className =
            "laporan-pembelian-pdf-modal";


        modal.innerHTML = `

            <div
                class="laporan-pembelian-pdf-overlay"
                data-close-modal
            ></div>


            <div
                class="laporan-pembelian-pdf-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="laporan-pembelian-pdf-title"
            >

                <div
                    class="laporan-pembelian-pdf-header"
                >

                    <div>

                        <div
                            id="laporan-pembelian-pdf-title"
                            class="laporan-pembelian-pdf-title"
                        >
                            Laporan Pembelian
                        </div>

                        <div
                            class="laporan-pembelian-pdf-subtitle"
                        >
                            Daftar file PDF laporan pembelian
                        </div>

                    </div>


                    <button
                        type="button"
                        class="laporan-pembelian-pdf-close"
                        data-close-modal
                        aria-label="Tutup"
                    >
                        &times;
                    </button>

                </div>


                <div
                    class="laporan-pembelian-pdf-body"
                >

                    <div
                        id="laporan-pembelian-pdf-loading"
                        class="laporan-pembelian-pdf-loading"
                    >
                        Membaca file PDF...
                    </div>


                    <div
                        id="laporan-pembelian-pdf-error"
                        class="laporan-pembelian-pdf-error"
                        hidden
                    ></div>


                    <div
                        id="laporan-pembelian-pdf-empty"
                        class="laporan-pembelian-pdf-empty"
                        hidden
                    >
                        Belum ada file laporan pembelian.
                    </div>


                    <div
                        id="laporan-pembelian-pdf-list"
                        class="laporan-pembelian-pdf-list"
                        hidden
                    ></div>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        modal
            .querySelectorAll("[data-close-modal]")
            .forEach(element => {

                element.addEventListener(
                    "click",
                    () => this.close()
                );

            });


        this.keydownHandler = event => {

            if (event.key === "Escape") {
                this.close();
            }

        };


        document.addEventListener(
            "keydown",
            this.keydownHandler
        );

    },


    async load() {

        const loading =
            document.getElementById(
                "laporan-pembelian-pdf-loading"
            );

        const error =
            document.getElementById(
                "laporan-pembelian-pdf-error"
            );

        const empty =
            document.getElementById(
                "laporan-pembelian-pdf-empty"
            );

        const list =
            document.getElementById(
                "laporan-pembelian-pdf-list"
            );


        if (!loading || !error || !empty || !list) {
            return;
        }


        loading.hidden = false;
        error.hidden = true;
        empty.hidden = true;
        list.hidden = true;


        /* ==========================================
           GLOBAL LOADING
           ========================================== */

        Loading.show(
            "Mengambil daftar file PDF laporan pembelian...",
            "Memuat Laporan Pembelian"
        );


        try {

            /* ==========================================
               AMBIL DAFTAR PDF
               ========================================== */

            const response =
                await API.getLaporanPembelianPdf();


            if (
                !response ||
                response.success !== true
            ) {

                throw new Error(
                    response?.message ||
                    "Gagal membaca daftar file PDF."
                );

            }


            /* ==========================================
               DATA FILE
               ========================================== */

            const files =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            /* ==========================================
               VALIDASI DATA KOSONG
               ========================================== */

            if (files.length === 0) {

                loading.hidden = true;
                empty.hidden = false;

                return;

            }


            /* ==========================================
               URUTKAN FILE TERBARU
               ========================================== */

            const sortedFiles =
                [...files].sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );


            /* ==========================================
               RENDER DAFTAR PDF
               ========================================== */

            list.innerHTML =
                sortedFiles
                    .map(
                        file =>
                            this.renderRow(file)
                    )
                    .join("");


            loading.hidden = true;
            list.hidden = false;


            /* ==========================================
               EVENT DAFTAR PDF
               ========================================== */

            this.bindRows();


        } catch (err) {

            console.error(
                "LAPORAN PEMBELIAN PDF ERROR:",
                err
            );


            loading.hidden = true;
            error.hidden = false;


            error.textContent =
                err.message ||
                "Gagal membaca file PDF.";


            Dialog.error(
                err.message ||
                "Gagal membaca daftar file PDF."
            );


        } finally {

            /* ==========================================
               TUTUP GLOBAL LOADING
               ========================================== */

            Loading.hide();

        }

    },


    renderRow(file) {

        const fileId =
            String(file.fileId || "").trim();


        const fileName =
            String(file.fileName || "Laporan Pembelian.pdf")
                .trim();


        const createdAt =
            file.createdAt
                ? this.formatDate(file.createdAt)
                : "-";


        const size =
            this.formatFileSize(file.size);


        return `

            <button
                type="button"
                class="laporan-pembelian-pdf-row"
                data-file-id="${this.escape(fileId)}"
                data-file-url="${this.escape(file.url || "")}"
            >

                <div
                    class="laporan-pembelian-pdf-icon"
                >
                    PDF
                </div>


                <div
                    class="laporan-pembelian-pdf-info"
                >

                    <div
                        class="laporan-pembelian-pdf-name"
                    >
                        ${this.escape(fileName)}
                    </div>


                    <div
                        class="laporan-pembelian-pdf-meta"
                    >

                        <span>
                            ${this.escape(createdAt)}
                        </span>

                        <span>
                            ${this.escape(size)}
                        </span>

                    </div>

                </div>


                <div
                    class="laporan-pembelian-pdf-arrow"
                >
                    ›
                </div>

            </button>

        `;

    },


    bindRows() {

        const list =
            document.getElementById(
                "laporan-pembelian-pdf-list"
            );

        if (!list) return;


        list
            .querySelectorAll(
                ".laporan-pembelian-pdf-row"
            )
            .forEach(row => {

                row.addEventListener(
                    "click",
                    () => {

                        const url =
                            row.dataset.fileUrl;


                        if (!url) {

                            const fileId =
                                row.dataset.fileId;


                            if (!fileId) {

                                Dialog.error(
                                    "File PDF tidak ditemukan."
                                );

                                return;

                            }


                            const driveUrl =
                                `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/view`;

                            window.open(
                                driveUrl,
                                "_blank"
                            );

                            return;

                        }


                        window.open(
                            url,
                            "_blank"
                        );

                    }
                );

            });

    },


    formatDate(value) {

        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return String(value);

        }


        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    },


    formatFileSize(value) {

        const size =
            Number(value);


        if (!size || size <= 0) {
            return "-";
        }


        if (size < 1024) {
            return `${size} B`;
        }


        if (size < 1024 * 1024) {

            return `${(
                size / 1024
            ).toFixed(1)} KB`;

        }


        return `${(
            size /
            (1024 * 1024)
        ).toFixed(1)} MB`;

    },


    escape(value) {

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

    }

};