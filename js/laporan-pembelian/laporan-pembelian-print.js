
/* =====================================================
   LAPORAN PEMBELIAN
   PRINT LAPORAN BULANAN
   ===================================================== */

Object.assign(LaporanPembelian, {

    async laporan() {

        const bulanInput =
            document.getElementById(
                "laporanPembelianTanggal"
            );


        const supplierInput =
            document.getElementById(
                "laporanPembelianSupplier"
            );


        const button =
            document.getElementById(
                "laporanPembelianLaporan"
            );


        try {

            /* ==========================================
               VALIDASI PERIODE
               ========================================== */

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


            if (parts.length !== 2) {

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


            /* ==========================================
               SUPPLIER
               ========================================== */

            const supplier =
                supplierInput
                    ? supplierInput.value || ""
                    : "";


            /* ==========================================
               DATABASE PEMBELIAN AKTIF
               ========================================== */

            const database =
                PembelianDatabaseConfig
                    .getActiveDatabase();


            if (!database) {

                throw new Error(
                    "Database Pembelian aktif tidak ditemukan."
                );

            }


            if (
                !database.pembelian ||
                !database.detailPembelian ||
                !database.pembayaran
            ) {

                throw new Error(
                    "Database Pembelian belum dikonfigurasi lengkap."
                );

            }


            /* ==========================================
               KONFIRMASI PEMBUATAN LAPORAN DAN PDF
               ========================================== */

            const dikonfirmasi =
                await Dialog.confirm(
                    "Buat laporan pembelian bulanan beserta PDF untuk periode " +
                    parts[1] +
                    "/" +
                    parts[0] +
                    (supplier
                        ? " dengan supplier " + supplier
                        : " untuk semua supplier") +
                    "?"
                );


            if (!dikonfirmasi) {

                return;

            }


            /* ==========================================
               GLOBAL LOADING
               ========================================== */

            Loading.show(
                "Membuat laporan pembelian bulanan...",
                "Mencetak Laporan Pembelian"
            );


            /* ==========================================
               LOADING BUTTON
               ========================================== */

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


            /* ==========================================
               PRINT LAPORAN BULANAN
               ========================================== */

            const result =
                await API.printLaporanPembelianBulanan({

                    bulan:
                        bulan,

                    tahun:
                        tahun,

                    supplier:
                        supplier,

                    database:
                        database

                });


            /* ==========================================
               VALIDASI RESPONSE
               ========================================== */

            if (
                !result ||
                result.success !== true
            ) {

                throw new Error(

                    result &&
                    result.message

                        ? result.message

                        : "Gagal membuat laporan pembelian bulanan."

                );

            }


            /* ==========================================
               NOTIFIKASI SUKSES
               ========================================== */

            Dialog.success(
                "Laporan pembelian berhasil dibuat."
            );


            /* ==========================================
               BUKA PDF
               ========================================== */

            if (result.url) {

                const pdfWindow =
                    window.open(
                        result.url,
                        "_blank"
                    );

                if (!pdfWindow) {

                    Dialog.warning(
                        "Laporan berhasil dibuat, tetapi browser memblokir pembukaan PDF. Silakan izinkan pop-up."
                    );

                }

            }

            else {

                Dialog.warning(
                    "Laporan berhasil dibuat, tetapi URL PDF tidak tersedia."
                );

            }

        }

        catch (error) {

            console.error(
                "LAPORAN PEMBELIAN BULANAN PRINT ERROR:",
                error
            );


            Dialog.error(

                error &&
                error.message

                    ? error.message

                    : "Gagal membuat laporan pembelian bulanan."

            );

        }

        finally {

            /* ==========================================
               RESTORE BUTTON
               ========================================== */

            if (button) {

                button.disabled =
                    false;


                button.innerHTML =
                    button.dataset.originalText ||
                    "Laporan";


                delete button.dataset.originalText;

            }


            /* ==========================================
               HIDE GLOBAL LOADING
               ========================================== */

            Loading.hide();

        }

    },


    /* ==========================================
       GLOBAL NOTIFICATION
       DIPERTAHANKAN UNTUK KOMPATIBILITAS
       ========================================== */

    showNotification(
        message,
        type = "info"
    ) {

        let notification =
            document.getElementById(
                "appNotification"
            );


        /* ==========================================
           BUAT ELEMENT JIKA BELUM ADA
           ========================================== */

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


        /* ==========================================
           RESET TIMER
           ========================================== */

        if (
            notification._timer
        ) {

            clearTimeout(
                notification._timer
            );

        }


        /* ==========================================
           CLASS GLOBAL
           ========================================== */

        notification.className =
            "app-notification " +
            "app-notification-" +
            type;


        /* ==========================================
           ICON
           ========================================== */

        let icon =
            "ℹ";


        if (type === "success") {

            icon =
                "✓";

        }

        else if (type === "error") {

            icon =
                "×";

        }

        else if (type === "warning") {

            icon =
                "!";

        }


        /* ==========================================
           CONTENT
           ========================================== */

        notification.innerHTML = `

            <span class="app-notification-icon">
                ${icon}
            </span>

            <span class="app-notification-text">
                ${this.escapeNotification(
                    message
                )}
            </span>

        `;


        /* ==========================================
           SHOW
           ========================================== */

        requestAnimationFrame(
            () => {

                notification.classList.add(
                    "show"
                );

            }
        );


        /* ==========================================
           HIDE
           ========================================== */

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


    /* ==========================================
       ESCAPE NOTIFICATION
       ========================================== */

    escapeNotification(
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

    }

});
