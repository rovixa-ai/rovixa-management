Object.assign(LaporanPembelian, {

    /* ======================================
       FILTER BULANAN
    ====================================== */

    async filter() {

        const bulanInput =
            document.getElementById(
                "laporanPembelianTanggal"
            );


        const supplierInput =
            document.getElementById(
                "laporanPembelianSupplier"
            );


        /* ======================================
           VALIDASI BULAN
        ====================================== */

        if (
            !bulanInput ||
            !bulanInput.value
        ) {

            Dialog.error(
                "Silakan pilih bulan."
            );

            return;

        }


        /*
         * Input:
         *
         * 2026-09
         *
         * menjadi:
         *
         * tahun = 2026
         * bulan = 9
         */

        const parts =
            bulanInput.value.split("-");


        if (
            parts.length !== 2
        ) {

            Dialog.error(
                "Bulan laporan tidak valid."
            );

            return;

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
            bulan < 1 ||
            bulan > 12
        ) {

            Dialog.error(
                "Bulan dan tahun laporan tidak valid."
            );

            return;

        }


        /* ======================================
           SUPPLIER
        ====================================== */

        const selectedSupplier =
            supplierInput
                ? supplierInput.value
                : "";


        /* ======================================
           LOADING GLOBAL
        ====================================== */

        Loading.show(
            "Mengambil dan memproses data pembelian...",
            "Memuat Laporan Pembelian"
        );


        try {

            /* ==================================
               LOAD DATA LOCAL
            ================================== */

            const pembelian =
                await DB.getAll(
                    "pembelian"
                );


            const detailPembelian =
                await DB.getAll(
                    "detailPembelian"
                );


            const pembayaranPembelian =
                await DB.getAll(
                    "pembayaranPembelian"
                );


            

            /* ==================================
               MAP DETAIL
            ================================== */

            const detailMap =
                new Map();


            detailPembelian.forEach(
                item => {

                    const id =
                        String(
                            item.id || ""
                        ).trim();


                    if (!id) {
                        return;
                    }


                    if (
                        !detailMap.has(
                            id
                        )
                    ) {

                        detailMap.set(
                            id,
                            []
                        );

                    }


                    detailMap
                        .get(id)
                        .push({

                            barcode:
                                String(
                                    item.barcode || ""
                                ),

                            kode:
                                String(
                                    item.kode || ""
                                ),

                            nama:
                                String(
                                    item.nama || ""
                                ),

                            satuan:
                                String(
                                    item.satuan || ""
                                ),

                            qty:
                                Number(
                                    item.qty
                                ) || 0,

                            harga:
                                Number(
                                    item.harga
                                ) || 0,

                            disc:
                                Number(
                                    item.disc
                                ) || 0

                        });

                }
            );


            /* ==================================
               MAP PEMBAYARAN
            ================================== */

            const pembayaranMap =
                new Map();


            pembayaranPembelian.forEach(
                payment => {

                    const id =
                        String(
                            payment.id || ""
                        ).trim();


                    if (!id) {
                        return;
                    }


                    if (
                        !pembayaranMap.has(
                            id
                        )
                    ) {

                        pembayaranMap.set(
                            id,
                            []
                        );

                    }


                    pembayaranMap
                        .get(id)
                        .push({

                            metode:
                                String(
                                    payment.metode || ""
                                ).trim(),

                            nominal:
                                Number(
                                    payment.nominal
                                ) || 0,

                            kembalian:
                                Number(
                                    payment.kembalian
                                ) || 0

                        });

                }
            );


            /* ==================================
               FILTER PEMBELIAN
            ================================== */

            const transactions =
                pembelian

                    .filter(
                        row => {

                            const tanggal =
                                String(
                                    row.tanggal || ""
                                );


                            if (!tanggal) {
                                return false;
                            }


                            /*
                             * Data dari download
                             * dapat berupa:
                             *
                             * 2026-09-15T...
                             *
                             * atau:
                             *
                             * 2026-09-15
                             */

                            const date =
                                new Date(
                                    tanggal
                                );


                            if (
                                isNaN(
                                    date.getTime()
                                )
                            ) {

                                return false;

                            }


                            const rowYear =
                                date.getFullYear();


                            const rowMonth =
                                date.getMonth() + 1;


                            if (
                                rowYear !==
                                tahun
                            ) {

                                return false;

                            }


                            if (
                                rowMonth !==
                                bulan
                            ) {

                                return false;

                            }


                            const supplier =
                                String(
                                    row.supplier || ""
                                ).trim();


                            if (
                                selectedSupplier &&
                                supplier !==
                                selectedSupplier
                            ) {

                                return false;

                            }


                            return true;

                        }
                    )

                    .map(
                        row => {

                            const id =
                                String(
                                    row.id || ""
                                ).trim();


                            const tanggal =
                                String(
                                    row.tanggal || ""
                                );


                            const date =
                                new Date(
                                    tanggal
                                );


                            return {

                                id:
                                    id,

                                tanggal:
                                    tanggal,

                                supplier:
                                    String(
                                        row.supplier || ""
                                    ).trim(),

                                invoice:
                                    String(
                                        row.invoice || ""
                                    ).trim(),

                                subtotal:
                                    Number(
                                        row.subtotal
                                    ) || 0,

                                disc:
                                    Number(
                                        row.disc
                                    ) || 0,

                                total:
                                    Number(
                                        row.total
                                    ) || 0,

                                status:
                                    String(
                                        row.status || ""
                                    ).trim(),

                                items:
                                    detailMap.get(
                                        id
                                    ) || [],

                                payments:
                                    pembayaranMap.get(
                                        id
                                    ) || [],

                                jam:
                                    isNaN(
                                        date.getTime()
                                    )
                                        ? ""
                                        : date
                                            .toTimeString()
                                            .substring(
                                                0,
                                                5
                                            )

                            };

                        }
                    );


            /* ==================================
               SUMMARY
            ================================== */

            let totalSubtotal =
                0;


            let totalDiscount =
                0;


            let totalPembelian =
                0;


            let totalItem =
                0;


            let totalCash =
                0;


            let totalTransfer =
                0;


            let totalQRIS =
                0;


            let totalKartu =
                0;


            transactions.forEach(
                transaction => {

                    totalSubtotal +=
                        transaction.subtotal;


                    totalDiscount +=
                        transaction.disc;


                    totalPembelian +=
                        transaction.total;


                    transaction.items.forEach(
                        item => {

                            totalItem +=
                                Number(
                                    item.qty
                                ) || 0;

                        }
                    );


                    transaction.payments.forEach(
                        payment => {

                            const metode =
                                String(
                                    payment.metode || ""
                                )
                                    .trim()
                                    .toLowerCase();


                            const nominal =
                                Number(
                                    payment.nominal
                                ) || 0;


                            if (
                                metode ===
                                "cash"
                            ) {

                                totalCash +=
                                    nominal;

                            }

                            else if (
                                metode ===
                                "transfer"
                            ) {

                                totalTransfer +=
                                    nominal;

                            }

                            else if (
                                metode ===
                                "qris"
                            ) {

                                totalQRIS +=
                                    nominal;

                            }

                            else if (
                                metode ===
                                "kartu"
                            ) {

                                totalKartu +=
                                    nominal;

                            }

                        }
                    );

                }
            );


            const totalPayment =
                totalCash +
                totalTransfer +
                totalQRIS +
                totalKartu;


            /* ==================================
               SUMMARY OBJECT
            ================================== */

            const summary = {

                totalTransaksi:
                    transactions.length,

                totalItem:
                    totalItem,

                subtotal:
                    totalSubtotal,

                discount:
                    totalDiscount,

                total:
                    totalPembelian,

                cash:
                    totalCash,

                transfer:
                    totalTransfer,

                qris:
                    totalQRIS,

                kartu:
                    totalKartu,

                totalPayment:
                    totalPayment

            };


            /* ==================================
               DAILY
            ================================== */

            const dailyMap =
                new Map();


            transactions.forEach(
                transaction => {

                    const date =
                        new Date(
                            transaction.tanggal
                        );


                    if (
                        isNaN(
                            date.getTime()
                        )
                    ) {

                        return;

                    }


                    const tanggal =
                        date
                            .toISOString()
                            .substring(
                                0,
                                10
                            );


                    if (
                        !dailyMap.has(
                            tanggal
                        )
                    ) {

                        dailyMap.set(
                            tanggal,
                            {

                                tanggal:
                                    tanggal,

                                totalTransaksi:
                                    0,

                                subtotal:
                                    0,

                                discount:
                                    0,

                                total:
                                    0,

                                transactions:
                                    []

                            }
                        );

                    }


                    const day =
                        dailyMap.get(
                            tanggal
                        );


                    day.totalTransaksi +=
                        1;


                    day.subtotal +=
                        transaction.subtotal;


                    day.discount +=
                        transaction.disc;


                    day.total +=
                        transaction.total;


                    day.transactions.push(
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


            /* ==================================
               REPORT
            ================================== */

            const report = {

                success:
                    true,

                filter: {

                    tahun:
                        tahun,

                    bulan:
                        bulan,

                    supplier:
                        selectedSupplier

                },

                summary:
                    summary,

                transactions:
                    transactions,

                daily:
                    daily

            };


            /* ==================================
               SIMPAN REPORT
            ================================== */

            this.report =
                report;


            this.data =
                report;


            this.filtered =
                transactions;


            /* ==================================
               SUPPLIER OPTIONS
            ================================== */

            this.updateSupplierOptions(
                transactions,
                selectedSupplier
            );


            /* ==================================
               SUMMARY
            ================================== */

            this.renderSummary(
                summary
            );


            /* ==================================
               TABLE
            ================================== */

            this.renderTable();

        }

        catch (error) {

            console.error(
                "LaporanPembelian.filter:",
                error
            );


            this.data =
                null;


            this.report =
                null;


            this.filtered =
                [];


            this.resetSummary();


            this.renderTable();


            Dialog.error(
                error.message ||
                "Gagal memuat laporan pembelian."
            );

        }

        finally {

            Loading.hide();

        }

    },


});