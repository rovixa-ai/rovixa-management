const PembelianSave = {

    /* ======================================
       SAVE PEMBELIAN
       ====================================== */

    async save() {

        const tanggal =
            document
                .getElementById(
                    "pembelian-tanggal"
                )
                .value;


        const supplier =
            document
                .getElementById(
                    "pembelian-supplier"
                )
                .value
                .trim();


        const invoice =
            document
                .getElementById(
                    "pembelian-invoice"
                )
                .value
                .trim();


        /* ======================================
           VALIDASI HEADER
           ====================================== */

        if (!tanggal) {

            Dialog.alert(
                "Tanggal wajib diisi."
            );

            return;

        }


        if (!supplier) {

            Dialog.alert(
                "Supplier wajib diisi."
            );

            return;

        }


        /* ======================================
           VALIDASI BARANG
           ====================================== */

        if (!Pembelian.items.length) {

            Dialog.alert(
                "Belum ada barang."
            );

            return;

        }


        for (
            let i = 0;
            i < Pembelian.items.length;
            i++
        ) {

            const item =
                Pembelian.items[i];


            if (!item.barang) {

                Dialog.alert(
                    "Barang pada baris " +
                    (i + 1) +
                    " belum dipilih."
                );

                return;

            }


            if (!item.satuan) {

                Dialog.alert(
                    "Satuan pada baris " +
                    (i + 1) +
                    " belum dipilih."
                );

                return;

            }


            if (
                Number(
                    item.qty
                ) <= 0
            ) {

                Dialog.alert(
                    "Qty pada baris " +
                    (i + 1) +
                    " harus lebih dari 0."
                );

                return;

            }

        }


        /* ======================================
           TOTAL
           ====================================== */

        const total =
            PembelianItem.getTotal();


        const dibayar =
            PembelianPayment.getDibayar();


        if (
            !Pembelian.payments.length
        ) {

            Dialog.alert(
                "Tambahkan pembayaran."
            );

            return;

        }


        if (
            total !== dibayar
        ) {

            Dialog.alert(
                "Total pembayaran harus sama dengan total pembelian."
            );

            return;

        }


        /* ======================================
           DATA PEMBELIAN
           ====================================== */

        const data = {

            tanggal,

            supplier,

            invoice,


            items:
                Pembelian.items.map(
                    item => ({

                        barang:
                            item.barang,

                        namaBarang:
                            item.namaBarang || "",

                        barcode:
                            item.barcode || "",

                        satuan:
                            item.satuan,

                        qty:
                            Number(
                                item.qty
                            ),

                        harga:
                            Number(
                                item.harga
                            ),

                        disc:
                            Number(
                                item.disc
                            ),

                        total:
                            PembelianItem.itemTotal(
                                item
                            )

                    })
                ),


            payments:
                Pembelian.payments.map(
                    payment => ({

                        metode:
                            payment.metode,

                        nominal:
                            Number(
                                payment.nominal
                            )

                    })
                ),


            total,

            dibayar

        };


        /* ======================================
           SIMPAN LOCAL + SYNC QUEUE
           ====================================== */

        try {

            


            await Sync.addPembelian(
                data
            );


            


            /* ==================================
               SYNC SEKARANG
               ================================== */

            await Sync.process();


            

            /* ==================================
               RESET FORM
               ================================== */

            Pembelian.items = [];

            Pembelian.payments = [];


            /* ==================================
               NOTIFIKASI
               ================================== */

            Dialog.alert(
                "Pembelian berhasil disimpan."
            );


            /* ==================================
               KEMBALI
               ================================== */

            Router.go(
                "pembelian"
            );

        }

        catch (error) {

            console.error(
                "SAVE PEMBELIAN ERROR:",
                error
            );


           Dialog.alert(
                error.message ||
                "Gagal menyimpan pembelian."
            );

        }

    }

};