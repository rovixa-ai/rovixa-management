
/* =====================================================
   LAPORAN PENJUALAN
   PRINT LAPORAN BULANAN
   ===================================================== */

Object.assign(LaporanPenjualan, {

    async laporan() {

        const bulanInput =
            document.getElementById(
                "laporanPenjualanTanggal"
            );

        const kasirInput =
            document.getElementById(
                "laporanPenjualanKasir"
            );

        const button =
            document.getElementById(
                "laporanPenjualanLaporan"
            );


        try {

            /* ======================================
               VALIDASI INPUT PERIODE
            ====================================== */

            if (!bulanInput) {

                throw new Error(
                    "Input periode laporan tidak ditemukan."
                );

            }


            const periode =
                bulanInput.value;


            if (!periode) {

                throw new Error(
                    "Periode laporan belum dipilih."
                );

            }


            const parts =
                periode.split("-");


            if (
                parts.length !== 2
            ) {

                throw new Error(
                    "Format periode tidak valid."
                );

            }


            const tahun =
                Number(
                    parts[0]
                );


            const bulan =
                Number(
                    parts[1]
                );


            if (
                !tahun ||
                !bulan ||
                tahun < 2000 ||
                bulan < 1 ||
                bulan > 12
            ) {

                throw new Error(
                    "Periode laporan tidak valid."
                );

            }


            /* ======================================
               KASIR
            ====================================== */

            const kasir =
                kasirInput
                    ? kasirInput.value || ""
                    : "";


            /* ======================================
               DATABASE PENJUALAN
            ====================================== */

            const database =
                DatabaseConfig
                    .getActiveDatabase();


            if (!database) {

                throw new Error(
                    "Database Penjualan aktif tidak ditemukan."
                );

            }


            if (
                !database.penjualan ||
                !database.detailPenjualan ||
                !database.pembayaran
            ) {

                throw new Error(
                    "Database Penjualan belum dikonfigurasi lengkap."
                );

            }


            /* ======================================
               KONFIRMASI PEMBUATAN LAPORAN DAN PDF
            ====================================== */

            const dikonfirmasi =
                await Dialog.confirm(
                    "Buat laporan penjualan bulanan beserta PDF untuk periode " +
                    parts[1] +
                    "/" +
                    parts[0] +
                    (
                        kasir
                            ? " dengan kasir " + kasir
                            : " untuk semua kasir"
                    ) +
                    "?"
                );


            if (!dikonfirmasi) {

                return;

            }


            /* ======================================
               GLOBAL LOADING
            ====================================== */

            Loading.show(
                "Membuat laporan penjualan bulanan...",
                "Mencetak Laporan Penjualan"
            );


            /* ======================================
               LOADING BUTTON
            ====================================== */

            if (button) {

                button.dataset.originalText =
                    button.innerHTML;

                button.disabled =
                    true;

                button.innerHTML = `
                    <span class="laporan-loading-spinner"></span>
                    <span>Mencetak...</span>
                `;

            }


            /* ======================================
               PRINT PDF
            ====================================== */

            const result =
                await API.printLaporanPenjualanBulanan({

                    bulan:
                        bulan,

                    tahun:
                        tahun,

                    kasir:
                        kasir,

                    database:
                        database

                });


            /* ======================================
               VALIDASI RESPONSE
            ====================================== */

            if (
                !result ||
                result.success !== true
            ) {

                throw new Error(
                    result &&
                    result.message
                        ? result.message
                        : "Gagal membuat laporan penjualan bulanan."
                );

            }


            /* ======================================
               NOTIFICATION SUCCESS
            ====================================== */

            this.showNotification(
                "Laporan penjualan berhasil dibuat.",
                "success"
            );


            /* ======================================
               OPEN PDF
            ====================================== */

            if (result.url) {

                const pdfWindow =
                    window.open(
                        result.url,
                        "_blank"
                    );

                if (!pdfWindow) {

                    this.showNotification(
                        "Laporan berhasil dibuat, tetapi browser memblokir pembukaan PDF. Silakan izinkan pop-up.",
                        "warning"
                    );

                }

            }

            else {

                this.showNotification(
                    "Laporan berhasil dibuat, tetapi URL PDF tidak tersedia.",
                    "warning"
                );

            }


        }

        catch (error) {

            console.error(
                "LAPORAN PENJUALAN BULANAN PRINT ERROR:",
                error
            );


            this.showNotification(

                error &&
                error.message
                    ? error.message
                    : "Gagal membuat laporan penjualan bulanan.",

                "error"

            );

        }


        finally {

            /* ======================================
               RESTORE BUTTON
            ====================================== */

            if (button) {

                button.disabled = false;

                button.innerHTML =
                    button.dataset.originalText ||
                    "Laporan";

                delete button.dataset.originalText;

            }


            /* ======================================
               HIDE GLOBAL LOADING
            ====================================== */

            Loading.hide();

        }

    },


    /* =================================================
       GLOBAL NOTIFICATION
       ================================================= */

    showNotification(
        message,
        type = "info"
    ) {

        let notification =
            document.getElementById(
                "appNotification"
            );


        if (!notification) {

            notification =
                document.createElement(
                    "div"
                );

            notification.id =
                "appNotification";

            document.body.appendChild(
                notification
            );

        }


        if (notification._timer) {

            clearTimeout(
                notification._timer
            );

        }


        notification.className =
            "app-notification " +
            "app-notification-" +
            type;


        let icon =
            "ℹ";


        if (
            type === "success"
        ) {

            icon =
                "✓";

        }

        else if (
            type === "error"
        ) {

            icon =
                "×";

        }

        else if (
            type === "warning"
        ) {

            icon =
                "!";

        }


        notification.innerHTML = `

            <span
                class="app-notification-icon"
            >
                ${icon}
            </span>

            <span
                class="app-notification-text"
            >
                ${this.escapeNotification(
                    message
                )}
            </span>

        `;


        requestAnimationFrame(
            () => {

                notification.classList.add(
                    "show"
                );

            }
        );


        notification._timer =
            setTimeout(
                () => {

                    notification.classList.remove(
                        "show"
                    );

                },
                3500
            );

    },


    /* =================================================
       ESCAPE NOTIFICATION
       ================================================= */

    escapeNotification(value) {

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

    }

});
