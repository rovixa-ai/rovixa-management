const LaporanProfit = {

    data: [],

    filtered: [],

    transactions: [],

    filter: {
        tanggal: "",
        kasir: ""
    },


    render() {
        return LaporanProfitRender.render();
    },


    init() {

        this.data = [];
        this.filtered = [];
        this.transactions = [];

        LaporanProfitFilter.init();

        this.load();

    },


    getLocalDateKey(value) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "";
        }

        if (
            Object.prototype.toString.call(value) ===
            "[object Date]"
        ) {

            if (
                isNaN(
                    value.getTime()
                )
            ) {
                return "";
            }

            const tahun =
                value.getFullYear();

            const bulan =
                String(
                    value.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );

            const tanggal =
                String(
                    value.getDate()
                ).padStart(
                    2,
                    "0"
                );

            return `${tahun}-${bulan}-${tanggal}`;

        }

        const text =
            String(value).trim();

        if (!text) {
            return "";
        }

        const dateOnlyMatch =
            text.match(
                /^(\d{4})-(\d{2})-(\d{2})$/
            );

        if (dateOnlyMatch) {
            return dateOnlyMatch[0];
        }

        const localDateTimeMatch =
            text.match(
                /^(\d{4})-(\d{2})-(\d{2})[T ]/
            );

        const hasTimezone =
            /(?:Z|[+-]\d{2}:?\d{2})$/i.test(
                text
            );

        if (
            localDateTimeMatch &&
            hasTimezone
        ) {

            const date =
                new Date(text);

            if (
                isNaN(
                    date.getTime()
                )
            ) {
                return "";
            }

            const tahun =
                date.getFullYear();

            const bulan =
                String(
                    date.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );

            const tanggal =
                String(
                    date.getDate()
                ).padStart(
                    2,
                    "0"
                );

            return `${tahun}-${bulan}-${tanggal}`;

        }

        if (localDateTimeMatch) {

            return (
                localDateTimeMatch[1] +
                "-" +
                localDateTimeMatch[2] +
                "-" +
                localDateTimeMatch[3]
            );

        }

        const date =
            new Date(text);

        if (
            isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        const tahun =
            date.getFullYear();

        const bulan =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const tanggal =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        return `${tahun}-${bulan}-${tanggal}`;

    },


    initFilterDate() {

        const tanggalInput =
            document.getElementById(
                "laporanProfitTanggal"
            );

        if (!tanggalInput) {
            return "";
        }

        let periode =
            String(
                tanggalInput.value || ""
            ).trim();

        if (!periode) {

            const now =
                new Date();

            const tahun =
                now.getFullYear();

            const bulan =
                String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );

            periode =
                `${tahun}-${bulan}`;

            tanggalInput.value =
                periode;

        }

        return periode;

    },


    async load() {

        const tanggalInput =
            document.getElementById(
                "laporanProfitTanggal"
            );

        const kasirInput =
            document.getElementById(
                "laporanProfitKasir"
            );

        let periode =
            tanggalInput
                ? String(
                    tanggalInput.value || ""
                ).trim()
                : "";

        if (!periode) {
            periode =
                this.initFilterDate();
        }

        const parts =
            periode.split("-");

        if (
            parts.length !== 2 ||
            !Number(parts[0]) ||
            !Number(parts[1])
        ) {

            this.data = [];
            this.filtered = [];
            this.transactions = [];

            LaporanProfitSummary.render();
            LaporanProfitTable.render();

            return;

        }

        const tahun =
            Number(parts[0]);

        const bulan =
            Number(parts[1]);

        const selectedKasir =
            kasirInput
                ? String(
                    kasirInput.value || ""
                ).trim()
                : "";

        this.filter.tanggal =
            periode;

        this.filter.kasir =
            selectedKasir;

        try {

            const [
                penjualan,
                detailPenjualan,
                pembelian,
                detailPembelian,
                expense
            ] = await Promise.all([

                DB.getAll(
                    "penjualan"
                ),

                DB.getAll(
                    "detailPenjualan"
                ),

                DB.getAll(
                    "pembelian"
                ),

                DB.getAll(
                    "detailPembelian"
                ),

                DB.getAll(
                    "expense"
                )

            ]);


            /*
            ======================================
            MAP PEMBELIAN
            ======================================
            */

            const pembelianMap =
                new Map();

            pembelian.forEach(
                row => {

                    const id =
                        String(
                            row.id || ""
                        ).trim();

                    if (!id) {
                        return;
                    }

                    pembelianMap.set(
                        id,
                        row
                    );

                }
            );


            /*
            ======================================
            HARGA PEMBELIAN TERAKHIR
            ======================================
            */

            const hargaPembelianTerakhir =
                new Map();

            detailPembelian.forEach(
                detail => {

                    const id =
                        String(
                            detail.id || ""
                        ).trim();

                    if (!id) {
                        return;
                    }

                    const pembelianRow =
                        pembelianMap.get(
                            id
                        );

                    if (!pembelianRow) {
                        return;
                    }

                    const kode =
                        String(
                            detail.kode || ""
                        ).trim();

                    if (!kode) {
                        return;
                    }

                    const tanggal =
                        pembelianRow.tanggal;

                    const dateKey =
                        this.getLocalDateKey(
                            tanggal
                        );

                    if (!dateKey) {
                        return;
                    }

                    const date =
                        new Date(
                            `${dateKey}T00:00:00`
                        );

                    if (
                        isNaN(
                            date.getTime()
                        )
                    ) {
                        return;
                    }

                    const qty =
                        Number(
                            detail.qty
                        ) || 0;

                    if (qty <= 0) {
                        return;
                    }

                    const isi =
                        Number(
                            detail.isi
                        ) > 0
                            ? Number(
                                detail.isi
                            )
                            : 1;

                    const baseQty =
                        qty * isi;

                    if (baseQty <= 0) {
                        return;
                    }

                    let total =
                        Number(
                            detail.total
                        );

                    if (
                        !Number.isFinite(
                            total
                        )
                    ) {

                        const harga =
                            Number(
                                detail.harga
                            ) || 0;

                        const disc =
                            Number(
                                detail.disc
                            ) || 0;

                        total =
                            Math.max(
                                0,
                                (qty * harga) -
                                disc
                            );

                    }

                    const hargaDasar =
                        baseQty > 0
                            ? total / baseQty
                            : 0;

                    const existing =
                        hargaPembelianTerakhir.get(
                            kode
                        );

                    if (
                        !existing ||
                        date.getTime() >
                            existing.timestamp
                    ) {

                        hargaPembelianTerakhir.set(
                            kode,
                            {
                                kode,
                                harga:
                                    hargaDasar,
                                tanggal:
                                    dateKey,
                                timestamp:
                                    date.getTime(),
                                pembelianId:
                                    id
                            }
                        );

                    }

                }
            );


            /*
            ======================================
            MAP DETAIL PENJUALAN
            ======================================
            */

            const detailPenjualanMap =
                new Map();

            detailPenjualan.forEach(
                detail => {

                    const id =
                        String(
                            detail.id || ""
                        ).trim();

                    if (!id) {
                        return;
                    }

                    if (
                        !detailPenjualanMap.has(
                            id
                        )
                    ) {

                        detailPenjualanMap.set(
                            id,
                            []
                        );

                    }

                    detailPenjualanMap
                        .get(id)
                        .push(
                            detail
                        );

                }
            );


            /*
            ======================================
            DATA PENJUALAN
            ======================================
            */

            const transactions = [];

            penjualan.forEach(
                row => {

                    const id =
                        String(
                            row.id || ""
                        ).trim();

                    if (!id) {
                        return;
                    }

                    const tanggal =
                        row.tanggal;

                    const tanggalKey =
                        this.getLocalDateKey(
                            tanggal
                        );

                    if (!tanggalKey) {
                        return;
                    }

                    const status =
                        String(
                            row.status || ""
                        )
                        .trim()
                        .toUpperCase();

                    const kasir =
                        String(
                            row.kasir || ""
                        ).trim();

                    const items =
                        detailPenjualanMap
                            .get(id) || [];

                    let hpp = 0;

                    const profitItems = [];


                    /*
                    ==================================
                    HITUNG HPP
                    ==================================
                    */

                    if (
                        status !== "RETUR"
                    ) {

                        items.forEach(
                            item => {

                                const kode =
                                    String(
                                        item.kode ||
                                        ""
                                    ).trim();

                                const namaBarang =
                                    String(
                                        item.namaBarang ||
                                        item.nama ||
                                        ""
                                    ).trim();

                                const satuan =
                                    String(
                                        item.satuan ||
                                        ""
                                    ).trim();

                                const qty =
                                    Number(
                                        item.qty
                                    ) || 0;

                                let konversi =
                                    Number(
                                        item.konversi
                                    );

                                if (
                                    !Number.isFinite(
                                        konversi
                                    ) ||
                                    konversi <= 0
                                ) {

                                    konversi = 1;

                                }

                                const hargaJual =
                                    Number(
                                        item.harga
                                    ) || 0;

                                /*
                                ==================================
                                DISCOUNT
                                ==================================
                                */

                                const disc =
                                    Number(
                                        item.disc ??
                                        item.discount ??
                                        0
                                    ) || 0;


                                let subtotal =
                                    Number(
                                        item.subtotal ??
                                        item.total
                                    );

                                if (
                                    !Number.isFinite(
                                        subtotal
                                    )
                                ) {

                                    subtotal =
                                        Math.max(
                                            0,
                                            (qty *
                                                hargaJual) -
                                            disc
                                        );

                                }

                                const qtyDasar =
                                    qty *
                                    konversi;

                                let hargaBeli =
                                    0;

                                let hppItem =
                                    0;

                                let profitItem =
                                    subtotal;

                                let marginItem =
                                    subtotal > 0
                                        ? (
                                            profitItem /
                                            subtotal
                                        ) *
                                        100
                                        : 0;

                                const hargaTerakhir =
                                    hargaPembelianTerakhir
                                        .get(
                                            kode
                                        );

                                if (
                                    hargaTerakhir &&
                                    qtyDasar > 0
                                ) {

                                    hargaBeli =
                                        Number(
                                            hargaTerakhir.harga
                                        ) || 0;

                                    hppItem =
                                        qtyDasar *
                                        hargaBeli;

                                    profitItem =
                                        subtotal -
                                        hppItem;

                                    marginItem =
                                        subtotal > 0
                                            ? (
                                                profitItem /
                                                subtotal
                                            ) *
                                            100
                                            : 0;

                                }

                                hpp +=
                                    hppItem;


                                /*
                                ==================================
                                ITEM PROFIT
                                ==================================
                                */

                                profitItems.push({

                                    kode,

                                    namaBarang,

                                    satuan,

                                    qty,

                                    konversi,

                                    qtyDasar,

                                    harga:
                                        hargaJual,

                                    /*
                                    DISCOUNT DITAMPILKAN
                                    DI DETAIL MODAL
                                    */

                                    disc,

                                    subtotal,

                                    hargaBeli,

                                    hpp:
                                        hppItem,

                                    profit:
                                        profitItem,

                                    margin:
                                        marginItem

                                });

                            }
                        );

                    }


                    /*
                    ==================================
                    RETUR
                    ==================================
                    */

                    if (
                        status === "RETUR"
                    ) {

                        items.forEach(
                            item => {

                                const kode =
                                    String(
                                        item.kode ||
                                        ""
                                    ).trim();

                                const namaBarang =
                                    String(
                                        item.namaBarang ||
                                        item.nama ||
                                        ""
                                    ).trim();

                                const satuan =
                                    String(
                                        item.satuan ||
                                        ""
                                    ).trim();

                                const qty =
                                    Number(
                                        item.qty
                                    ) || 0;

                                let konversi =
                                    Number(
                                        item.konversi
                                    );

                                if (
                                    !Number.isFinite(
                                        konversi
                                    ) ||
                                    konversi <= 0
                                ) {

                                    konversi = 1;

                                }

                                const hargaJual =
                                    Number(
                                        item.harga
                                    ) || 0;

                                const disc =
                                    Number(
                                        item.disc ??
                                        item.discount ??
                                        0
                                    ) || 0;

                                let subtotal =
                                    Number(
                                        item.subtotal ??
                                        item.total
                                    );

                                if (
                                    !Number.isFinite(
                                        subtotal
                                    )
                                ) {

                                    subtotal =
                                        Math.max(
                                            0,
                                            (qty *
                                                hargaJual) -
                                            disc
                                        );

                                }

                                profitItems.push({

                                    kode,

                                    namaBarang,

                                    satuan,

                                    qty,

                                    konversi,

                                    qtyDasar:
                                        qty *
                                        konversi,

                                    harga:
                                        hargaJual,

                                    /*
                                    DISCOUNT RETUR
                                    TETAP DISIMPAN
                                    */

                                    disc,

                                    subtotal: 0,

                                    hargaBeli: 0,

                                    hpp: 0,

                                    profit: 0,

                                    margin: 0

                                });

                            }
                        );

                    }


                    const penjualanBersih =
                        status === "RETUR"
                            ? 0
                            : Number(
                                row.total
                            ) || 0;


                    const grossProfit =
                        penjualanBersih -
                        hpp;


                    /*
                    ==================================
                    TRANSAKSI
                    ==================================
                    */

                    transactions.push({

                        id,

                        tanggal,

                        tanggalKey,

                        kasir,

                        status,

                        /*
                        DISCOUNT TRANSAKSI
                        SUMBER:
                        Penjualan.disc
                        */

                        disc:
                            Number(
                                row.disc
                            ) || 0,

                        penjualan:
                            penjualanBersih,

                        hpp,

                        grossProfit,

                        expense: 0,

                        netProfit:
                            grossProfit,

                        items:
                            profitItems

                    });

                }
            );


            /*
            ======================================
            SIMPAN TRANSAKSI UNTUK MODAL
            ======================================
            */

            this.transactions =
                transactions.filter(
                    transaction => {

                        const dateParts =
                            transaction
                                .tanggalKey
                                .split("-");

                        if (
                            dateParts.length !== 3
                        ) {
                            return false;
                        }

                        const rowYear =
                            Number(
                                dateParts[0]
                            );

                        const rowMonth =
                            Number(
                                dateParts[1]
                            );

                        if (
                            rowYear !== tahun ||
                            rowMonth !== bulan
                        ) {
                            return false;
                        }

                        if (
                            selectedKasir &&
                            transaction.kasir !==
                                selectedKasir
                        ) {
                            return false;
                        }

                        return true;

                    }
                );


            /*
            ======================================
            MAP EXPENSE
            ======================================
            */

            const expenseMap =
                new Map();

            expense.forEach(
                row => {

                    const tanggal =
                        row.tanggal;

                    const tanggalKey =
                        this.getLocalDateKey(
                            tanggal
                        );

                    if (!tanggalKey) {
                        return;
                    }

                    const status =
                        String(
                            row.status || ""
                        )
                        .trim()
                        .toLowerCase();

                    if (
                        status === "nonaktif"
                    ) {
                        return;
                    }

                    const jumlah =
                        Number(
                            row.jumlah
                        ) || 0;

                    if (
                        !expenseMap.has(
                            tanggalKey
                        )
                    ) {

                        expenseMap.set(
                            tanggalKey,
                            0
                        );

                    }

                    expenseMap.set(
                        tanggalKey,
                        expenseMap.get(
                            tanggalKey
                        ) + jumlah
                    );

                }
            );


            /*
            ======================================
            FILTER TRANSAKSI
            ======================================
            */

            const filteredTransactions =
                transactions.filter(
                    transaction => {

                        const dateParts =
                            transaction
                                .tanggalKey
                                .split("-");

                        if (
                            dateParts.length !== 3
                        ) {
                            return false;
                        }

                        const rowYear =
                            Number(
                                dateParts[0]
                            );

                        const rowMonth =
                            Number(
                                dateParts[1]
                            );

                        if (
                            rowYear !== tahun ||
                            rowMonth !== bulan
                        ) {
                            return false;
                        }

                        if (
                            selectedKasir &&
                            transaction.kasir !==
                                selectedKasir
                        ) {
                            return false;
                        }

                        return true;

                    }
                );


            /*
            ======================================
            GROUP PER TANGGAL
            ======================================
            */

            const dailyMap =
                new Map();

            filteredTransactions.forEach(
                transaction => {

                    const tanggal =
                        transaction.tanggalKey;

                    if (!tanggal) {
                        return;
                    }

                    if (
                        !dailyMap.has(
                            tanggal
                        )
                    ) {

                        dailyMap.set(
                            tanggal,
                            {
                                tanggal,
                                kasir:
                                    selectedKasir,
                                penjualan: 0,
                                hpp: 0,
                                grossProfit: 0,
                                expense: 0,
                                netProfit: 0
                            }
                        );

                    }

                    const row =
                        dailyMap.get(
                            tanggal
                        );

                    row.penjualan +=
                        Number(
                            transaction.penjualan
                        ) || 0;

                    row.hpp +=
                        Number(
                            transaction.hpp
                        ) || 0;

                    row.grossProfit =
                        row.penjualan -
                        row.hpp;

                }
            );


            /*
            ======================================
            EXPENSE PER TANGGAL
            ======================================
            */

            expenseMap.forEach(
                (jumlah, tanggal) => {

                    const dateParts =
                        tanggal.split("-");

                    if (
                        dateParts.length !== 3
                    ) {
                        return;
                    }

                    const rowYear =
                        Number(
                            dateParts[0]
                        );

                    const rowMonth =
                        Number(
                            dateParts[1]
                        );

                    if (
                        rowYear !== tahun ||
                        rowMonth !== bulan
                    ) {
                        return;
                    }

                    if (
                        !dailyMap.has(
                            tanggal
                        )
                    ) {

                        dailyMap.set(
                            tanggal,
                            {
                                tanggal,
                                kasir:
                                    selectedKasir,
                                penjualan: 0,
                                hpp: 0,
                                grossProfit: 0,
                                expense: 0,
                                netProfit: 0
                            }
                        );

                    }

                    const row =
                        dailyMap.get(
                            tanggal
                        );

                    row.expense +=
                        Number(
                            jumlah
                        ) || 0;

                }
            );


            /*
            ======================================
            NET PROFIT
            ======================================
            */

            dailyMap.forEach(
                row => {

                    row.grossProfit =
                        row.penjualan -
                        row.hpp;

                    row.netProfit =
                        row.grossProfit -
                        row.expense;

                }
            );


            /*
            ======================================
            HASIL AKHIR
            ======================================
            */

            const daily =
                Array.from(
                    dailyMap.values()
                ).sort(
                    (a, b) =>
                        a.tanggal.localeCompare(
                            b.tanggal
                        )
                );

            this.data =
                daily;

            this.filtered =
                daily;


            /*
            ======================================
            UPDATE KASIR
            ======================================
            */

            if (
                LaporanProfitFilter &&
                typeof
                    LaporanProfitFilter
                        .updateKasirOptions ===
                    "function"
            ) {

                LaporanProfitFilter
                    .updateKasirOptions(
                        transactions,
                        selectedKasir
                    );

            }


            /*
            ======================================
            RENDER
            ======================================
            */

            LaporanProfitSummary.render();

            LaporanProfitTable.render();


        } catch (error) {

            console.error(
                "LaporanProfit.load:",
                error
            );

            this.data = [];
            this.filtered = [];
            this.transactions = [];

            LaporanProfitSummary.render();

            LaporanProfitTable.render();

            Dialog.alert(
                error.message ||
                "Gagal memuat laporan profit."
            );

        }

    }

};