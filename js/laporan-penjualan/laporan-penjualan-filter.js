
Object.assign(LaporanPenjualan, {

    async filter() {

        const bulanInput =
            document.getElementById(
                "laporanPenjualanTanggal"
            );

        const kasirInput =
            document.getElementById(
                "laporanPenjualanKasir"
            );

        if (
            !bulanInput ||
            !bulanInput.value
        ) {

            Dialog.alert(
                "Silakan pilih bulan."
            );

            return;

        }

        const parts =
            bulanInput.value.split("-");

        if (
            parts.length !== 2
        ) {

            Dialog.alert(
                "Bulan laporan tidak valid."
            );

            return;

        }

        const tahun =
            Number(parts[0]);

        const bulan =
            Number(parts[1]);

        if (
            !tahun ||
            !bulan ||
            bulan < 1 ||
            bulan > 12
        ) {

           Dialog.alert(
                "Bulan dan tahun laporan tidak valid."
            );

            return;

        }

        const selectedKasir =
            String(
                kasirInput?.value || ""
            ).trim();

        this.setLoading(true);

        try {

            /* ======================================
               LOAD DATA LOKAL
            ====================================== */

            const penjualan =
                await DB.getAll(
                    "penjualan"
                );

            const detailPenjualan =
                await DB.getAll(
                    "detailPenjualan"
                );

            

            const pembayaranPenjualan =
                await DB.getAll(
                    "pembayaranPenjualan"
                );

            

            /* ======================================
               FILTER BULAN
            ====================================== */

            const transaksiBulanan =
                penjualan.filter(
                    row => {

                        if (!row) {
                            return false;
                        }

                        const date =
                            new Date(
                                row.tanggal
                            );

                        if (
                            Number.isNaN(
                                date.getTime()
                            )
                        ) {

                            return false;

                        }

                        return (
                            date.getFullYear() ===
                                tahun &&

                            date.getMonth() + 1 ===
                                bulan
                        );

                    }
                );

            /* ======================================
               DAFTAR KASIR
               BERDASARKAN SELURUH TRANSAKSI BULANAN
            ====================================== */

            this.updateKasirOptions(
                transaksiBulanan,
                selectedKasir
            );

            /* ======================================
               FILTER KASIR
            ====================================== */

            const kasirTerpilih =
                String(
                    kasirInput?.value || ""
                ).trim();

            const filteredPenjualan =
                transaksiBulanan.filter(
                    row => {

                        if (!kasirTerpilih) {
                            return true;
                        }

                        const namaKasir =
                            String(
                                row.kasir || ""
                            ).trim();

                        return (
                            namaKasir.toLocaleLowerCase("id") ===
                            kasirTerpilih.toLocaleLowerCase("id")
                        );

                    }
                );

            /* ======================================
               DETAIL TRANSAKSI
            ====================================== */

            

            const transactions =
                filteredPenjualan.map(
                    penjualanRow => {

                        const id =
                            String(
                                penjualanRow.id
                            );

                        const items =
                            detailPenjualan
                                .filter(
                                    detail =>
                                        String(
                                            detail.id
                                        ) === id
                                )
                                .map(
                                    detail => ({

                                        kode:
                                            String(
                                                detail.kode ||
                                                ""
                                            ),

                                        nama:
                                            String(
                                                detail.nama ||
                                                ""
                                            ),

                                        satuan:
                                            String(
                                                detail.satuan ||
                                                ""
                                            ),

                                        qty:
                                            Number(
                                                detail.qty
                                            ) || 0,

                                        konversi:
                                            Number(
                                                detail.konversi
                                            ) || 0,

                                        harga:
                                            Number(
                                                detail.harga
                                            ) || 0,

                                        discount:
                                            Number(
                                                detail.discount
                                            ) || 0,

                                        subtotal:
                                            Number(
                                                detail.subtotal
                                            ) || 0

                                    })
                                );

                        const payments =
                            pembayaranPenjualan
                                .filter(
                                    payment =>
                                        String(
                                            payment.id
                                        ) === id
                                )
                                .map(
                                    payment => ({

                                        metode:
                                            String(
                                                payment.metode ||
                                                ""
                                            ),

                                        nominal:
                                            Number(
                                                payment.nominal
                                            ) || 0,

                                        kembalian:
                                            Number(
                                                payment.kembalian
                                            ) || 0

                                    })
                                );

                        let CASH = 0;
                        let QRIS = 0;
                        let DEBIT = 0;
                        let TRANSFER = 0;
                        let change = 0;

                        payments.forEach(
                            payment => {

                                const metode =
                                    String(
                                        payment.metode ||
                                        ""
                                    )
                                        .trim()
                                        .toUpperCase();

                                const nominal =
                                    Number(
                                        payment.nominal
                                    ) || 0;

                                const kembalian =
                                    Number(
                                        payment.kembalian
                                    ) || 0;

                                if (
                                    metode === "CASH"
                                ) {

                                    CASH += nominal;

                                } else if (
                                    metode === "QRIS"
                                ) {

                                    QRIS += nominal;

                                } else if (
                                    metode === "DEBIT"
                                ) {

                                    DEBIT += nominal;

                                } else if (
                                    metode === "TRANSFER"
                                ) {

                                    TRANSFER += nominal;

                                }

                                change += kembalian;

                            }
                        );

                        /* ======================================
                           CASH = PEMBAYARAN CASH - KEMBALIAN
                        ====================================== */

                        CASH =
                            CASH -
                            change;

                        const qty =
                            items.reduce(
                                (
                                    total,
                                    item
                                ) =>
                                    total +
                                    (
                                        Number(
                                            item.qty
                                        ) || 0
                                    ),
                                0
                            );

                        const totalItem =
                            items.length;

                        const totalPayment =
                            CASH +
                            QRIS +
                            DEBIT +
                            TRANSFER;

                        return {

                            id,

                            tanggal:
                                penjualanRow.tanggal,

                            kasir:
                                String(
                                    penjualanRow.kasir ||
                                    ""
                                ),

                            subtotal:
                                Number(
                                    penjualanRow.subtotal
                                ) || 0,

                            disc:
                                Number(
                                    penjualanRow.disc
                                ) || 0,

                            total:
                                Number(
                                    penjualanRow.total
                                ) || 0,

                            status:
                                String(
                                    penjualanRow.status ||
                                    ""
                                ),

                            totalItem,

                            qty,

                            CASH,

                            QRIS,

                            DEBIT,

                            TRANSFER,

                            totalPayment,

                            change,

                            items,

                            payments

                        };

                    }
                );

            /* ======================================
               URUTKAN TRANSAKSI
            ====================================== */

            transactions.sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        a.tanggal
                    ) -
                    new Date(
                        b.tanggal
                    )
            );

            /* ======================================
               SUMMARY
            ====================================== */

            let totalTransaksi = 0;
            let totalItem = 0;
            let qty = 0;
            let subtotal = 0;
            let discount = 0;
            let total = 0;

            let cash = 0;
            let qris = 0;
            let debit = 0;
            let transfer = 0;
            let totalPayment = 0;
            let change = 0;

            transactions.forEach(
                row => {

                    /* ======================================
                       TOTAL TRANSAKSI
                       RETUR TETAP DIHITUNG
                    ====================================== */

                    totalTransaksi += 1;

                    /* ======================================
                       PAYMENT
                       RETUR TETAP DIHITUNG
                    ====================================== */

                    cash +=
                        Number(
                            row.CASH
                        ) || 0;

                    qris +=
                        Number(
                            row.QRIS
                        ) || 0;

                    debit +=
                        Number(
                            row.DEBIT
                        ) || 0;

                    transfer +=
                        Number(
                            row.TRANSFER
                        ) || 0;

                    totalPayment +=
                        Number(
                            row.totalPayment
                        ) || 0;

                    change +=
                        Number(
                            row.change
                        ) || 0;

                    /* ======================================
                       RETUR TIDAK DIHITUNG UNTUK:
                       - Total Item
                       - Qty
                       - Subtotal
                       - Discount
                       - Total Penjualan
                    ====================================== */

                    const status =
                        String(
                            row.status ||
                            ""
                        )
                            .trim()
                            .toUpperCase();

                    if (
                        status === "RETUR"
                    ) {

                        return;

                    }

                    totalItem +=
                        Number(
                            row.totalItem
                        ) || 0;

                    qty +=
                        Number(
                            row.qty
                        ) || 0;

                    subtotal +=
                        Number(
                            row.subtotal
                        ) || 0;

                    discount +=
                        Number(
                            row.disc
                        ) || 0;

                    total +=
                        Number(
                            row.total
                        ) || 0;

                }
            );

            const summary = {

                totalTransaksi,

                totalItem,

                qty,

                subtotal,

                discount,

                total,

                cash,

                qris,

                debit,

                transfer,

                totalPayment,

                change

            };

            /* ======================================
               DAILY
            ====================================== */

            const dailyMap =
                new Map();

            transactions.forEach(
                transaction => {

                    const date =
                        new Date(
                            transaction.tanggal
                        );

                    const key =
                        [
                            date.getFullYear(),

                            String(
                                date.getMonth() + 1
                            )
                                .padStart(
                                    2,
                                    "0"
                                ),

                            String(
                                date.getDate()
                            )
                                .padStart(
                                    2,
                                    "0"
                                )
                        ]
                        .join("-");

                    if (
                        !dailyMap.has(key)
                    ) {

                        dailyMap.set(
                            key,
                            {
                                tanggal: key,
                                totalTransaksi: 0,
                                subtotal: 0,
                                discount: 0,
                                transactions: []
                            }
                        );

                    }

                    const daily =
                        dailyMap.get(key);

                    /* ======================================
                       TOTAL TRANSAKSI HARIAN
                       RETUR TETAP DIHITUNG
                    ====================================== */

                    daily.totalTransaksi += 1;

                    /* ======================================
                       SUBTOTAL HARIAN
                       RETUR TIDAK DIHITUNG
                    ====================================== */

                    const status =
                        String(
                            transaction.status ||
                            ""
                        )
                            .trim()
                            .toUpperCase();

                    if (
                        status !== "RETUR"
                    ) {

                        daily.subtotal +=
                            Number(
                                transaction.subtotal
                            ) || 0;

                        daily.discount +=
                            Number(
                                transaction.disc
                            ) || 0;

                    }

                    daily.transactions.push(
                        transaction
                    );

                }
            );

            const daily =
                Array.from(
                    dailyMap.values()
                )
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            a.tanggal.localeCompare(
                                b.tanggal
                            )
                    );

            /* ======================================
               REPORT
            ====================================== */

            const report = {

                success: true,

                summary,

                daily,

                transactions

            };

            this.report =
                report;

            this.data =
                report;

            this.filtered =
                transactions;

            this.renderSummary(
                summary
            );

            this.renderTable();

        } catch (error) {

            console.error(
                "LaporanPenjualan.filter:",
                error
            );

            this.data = null;

            this.report = null;

            this.filtered = [];

            this.resetSummary();

            this.renderTable();

            Dialog.alert(
                error.message ||
                "Gagal memuat laporan penjualan."
            );

        } finally {

            this.setLoading(false);

        }

    },

    async reset() {

        await this.init();

    },

});
