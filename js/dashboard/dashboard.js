const Dashboard = {

    render() {

        return DashboardRender.render();

    },


    init() {

    DashboardRender.initResponsive();

    this.event();

    this.loadTotalBarang();

    this.loadStokMenipis();

    this.loadStokLama();

    this.loadExpense();

    this.loadPenjualanBulan();

    this.loadPembelianBulan();

    this.loadTransaksiHari();

    this.loadNilaiStok();

  
         

        if (
            document.getElementById(
                "dashboard-desktop-chart-1-content"
            )
        ) {

            if (
                typeof DashboardChartDesktopRender !==
                "undefined"
            ) {

                DashboardChartDesktopRender.load();

            }

        }
        else if (
            document.getElementById(
                "dashboard-mobile-chart-1-content"
            )
        ) {

            if (
                typeof DashboardChartMobileRender !==
                "undefined"
            ) {

                DashboardChartMobileRender.load();

            }

        }

    },


    event() {

        document
            .querySelectorAll(
                "[data-dashboard-page]"
            )
            .forEach(
                button => {

                    button.onclick =
                        () => {

                            Router.go(
                                button.dataset.dashboardPage
                            );

                        };

                }
            );


        const periode =
            document.getElementById(
                "dashboard-periode"
            );


        if (periode) {

            if (!periode.value) {

                const now =
                    new Date();


                const year =
                    now.getFullYear();


                const month =
                    String(
                        now.getMonth() + 1
                    )
                    .padStart(
                        2,
                        "0"
                    );


                periode.value =
                    `${year}-${month}`;

            }


            periode.onchange =
                () => {

                    this.loadExpense();

                    this.loadPenjualanBulan();

                    this.loadPembelianBulan();


                    /*
                     * Reload hanya chart yang sedang dirender.
                     */

                    if (
                        document.getElementById(
                            "dashboard-desktop-chart-1-content"
                        )
                    ) {

                        if (
                            typeof DashboardChartDesktopRender !==
                            "undefined"
                        ) {

                            DashboardChartDesktopRender.load();

                        }

                    }
                    else if (
                        document.getElementById(
                            "dashboard-mobile-chart-1-content"
                        )
                    ) {

                        if (
                            typeof DashboardChartMobileRender !==
                            "undefined"
                        ) {

                            DashboardChartMobileRender.load();

                        }

                    }

                };

        }


        const expenseCard =
            document.querySelector(
                "[data-expense-modal]"
            );


        if (expenseCard) {

            expenseCard.onclick =
                () => {

                    if (
                        typeof LaporanExpenseModal !==
                        "undefined"
                    ) {

                        LaporanExpenseModal.open();

                    }
                    else {

                        console.error(
                            "LaporanExpenseModal tidak ditemukan."
                        );

                    }

                };

        }


        const pembelianCard =
            document.querySelector(
                "[data-pembelian-modal]"
            );


        if (pembelianCard) {

            pembelianCard.onclick =
                () => {

                    if (
                        typeof PembelianLaporanModal !==
                        "undefined"
                    ) {

                        PembelianLaporanModal.open();

                    }
                    else {

                        console.error(
                            "PembelianLaporanModal tidak ditemukan."
                        );

                    }

                };

        }


        const penjualanCard =
            document.querySelector(
                "[data-penjualan-modal]"
            );


        if (penjualanCard) {

            penjualanCard.onclick =
                () => {

                    if (
                        typeof PenjualanLaporanModal !==
                        "undefined"
                    ) {

                        PenjualanLaporanModal.open();

                    }
                    else {

                        console.error(
                            "PenjualanLaporanModal tidak ditemukan."
                        );

                    }

                };

        }


        const stokLamaCard =
            document.getElementById(
                "dashboard-stok-lama-card"
            );


        if (stokLamaCard) {

            stokLamaCard.onclick =
                () => {

                    this.showStokLama();

                };

        }

    },


    async loadTotalBarang() {

        try {

            const barang =
                await DB.getAll(
                    "barang"
                );


            const kodeBarang =
                new Set();


            barang.forEach(
                item => {

                    const kode =
                        String(
                            item.kode ||
                            ""
                        ).trim();


                    if (kode) {

                        kodeBarang.add(
                            kode
                        );

                    }

                }
            );


            const element =
                document.getElementById(
                    "dashboard-total-barang"
                );


            if (!element) {
                return;
            }


            element.textContent =
                kodeBarang.size
                    .toLocaleString(
                        "id-ID"
                    );

        }
        catch (error) {

            console.error(
                "DASHBOARD TOTAL BARANG ERROR:",
                error
            );

        }

    },


    async loadStokMenipis() {

        try {

            const barang =
                await DB.getAll(
                    "barang"
                );


            const count =
                barang.filter(
                    item => {

                        const status =
                            String(
                                item.status ||
                                "Aktif"
                            )
                            .trim()
                            .toLowerCase();


                        if (
                            status ===
                            "nonaktif"
                        ) {

                            return false;

                        }


                        const stok =
                            Number(
                                item.stok
                            ) || 0;


                        return stok <= 10;

                    }
                )
                .length;


            const element =
                document.getElementById(
                    "dashboard-stok-menipis"
                );


            if (!element) {
                return;
            }


            element.textContent =
                count.toLocaleString(
                    "id-ID"
                );

        }
        catch (error) {

            console.error(
                "DASHBOARD STOK MENIPIS ERROR:",
                error
            );

        }

    },


    async loadStokLama() {

        try {

            const barang =
                await DB.getAll(
                    "barang"
                );


            const count =
                barang.filter(
                    item => {

                        const status =
                            String(
                                item.status ||
                                "Aktif"
                            )
                            .trim()
                            .toLowerCase();


                        if (
                            status ===
                            "nonaktif"
                        ) {

                            return false;

                        }


                        const stok =
                            Number(
                                item.stok
                            ) || 0;


                        return stok > 0;

                    }
                )
                .length;


            const element =
                document.getElementById(
                    "dashboard-stok-lama"
                );


            if (!element) {
                return;
            }


            element.textContent =
                count.toLocaleString(
                    "id-ID"
                );

        }
        catch (error) {

            console.error(
                "DASHBOARD STOK LAMA ERROR:",
                error
            );

        }

    },


    async loadExpense() {

        try {

            const periode =
                document.getElementById(
                    "dashboard-periode"
                );


            const value =
                periode
                    ? String(
                        periode.value ||
                        ""
                    ).trim()
                    : "";


            if (!value) {
                return;
            }


            const [
                tahunText,
                bulanText
            ] =
                value.split(
                    "-"
                );


            const tahun =
                Number(
                    tahunText
                );


            const bulan =
                Number(
                    bulanText
                );


            const expense =
                await DB.getAll(
                    "expense"
                );


            const total =
                expense
                    .filter(
                        item => {

                            const date =
                                this.parseDate(
                                    item.tanggal
                                );


                            if (!date) {
                                return false;
                            }


                            return (
                                date.getFullYear() ===
                                    tahun &&
                                date.getMonth() + 1 ===
                                    bulan
                            );

                        }
                    )
                    .reduce(
                        (
                            sum,
                            item
                        ) => {

                            return sum +
                                (
                                    Number(
                                        item.jumlah
                                    ) || 0
                                );

                        },
                        0
                    );


            const element =
                document.getElementById(
                    "dashboard-expense"
                );


            if (!element) {
                return;
            }


            element.textContent =
                "Rp " +
                total.toLocaleString(
                    "id-ID"
                );

        }
        catch (error) {

            console.error(
                "DASHBOARD EXPENSE ERROR:",
                error
            );

        }

    },


    async loadPenjualanBulan() {

        try {

            const periode =
                document.getElementById(
                    "dashboard-periode"
                );


            const value =
                periode
                    ? String(
                        periode.value ||
                        ""
                    ).trim()
                    : "";


            if (!value) {
                return;
            }


            const [
                tahunText,
                bulanText
            ] =
                value.split(
                    "-"
                );


            const tahun =
                Number(
                    tahunText
                );


            const bulan =
                Number(
                    bulanText
                );


            const penjualan =
                await DB.getAll(
                    "penjualan"
                );


            const total =
                penjualan
                    .filter(
                        item => {

                            if (!item) {
                                return false;
                            }


                            const date =
                                this.parseDate(
                                    item.tanggal
                                );


                            if (!date) {
                                return false;
                            }


                            if (
                                date.getFullYear() !==
                                    tahun ||
                                date.getMonth() + 1 !==
                                    bulan
                            ) {

                                return false;

                            }


                            const status =
                                String(
                                    item.status ||
                                    ""
                                )
                                    .trim()
                                    .toUpperCase();


                            if (
                                status ===
                                "RETUR"
                            ) {

                                return false;

                            }


                            return true;

                        }
                    )
                    .reduce(
                        (
                            sum,
                            item
                        ) => {

                            return sum +
                                (
                                    Number(
                                        item.total
                                    ) || 0
                                );

                        },
                        0
                    );


            const element =
                document.getElementById(
                    "dashboard-penjualan-bulan"
                );


            if (!element) {
                return;
            }


            element.textContent =
                "Rp " +
                total.toLocaleString(
                    "id-ID"
                );

        }
        catch (error) {

            console.error(
                "DASHBOARD PENJUALAN BULAN ERROR:",
                error
            );

        }

    },


    async loadPembelianBulan() {

        try {

            const periode =
                document.getElementById(
                    "dashboard-periode"
                );


            const value =
                periode
                    ? String(
                        periode.value ||
                        ""
                    ).trim()
                    : "";


            if (!value) {
                return;
            }


            const [
                tahunText,
                bulanText
            ] =
                value.split(
                    "-"
                );


            const tahun =
                Number(
                    tahunText
                );


            const bulan =
                Number(
                    bulanText
                );


            const pembelian =
                await DB.getAll(
                    "pembelian"
                );


            const total =
                pembelian
                    .filter(
                        item => {

                            const date =
                                this.parseDate(
                                    item.tanggal
                                );


                            if (!date) {
                                return false;
                            }


                            return (
                                date.getFullYear() ===
                                    tahun &&
                                date.getMonth() + 1 ===
                                    bulan
                            );

                        }
                    )
                    .reduce(
                        (
                            sum,
                            item
                        ) => {

                            return sum +
                                (
                                    Number(
                                        item.total ||
                                        item.grandTotal ||
                                        0
                                    ) || 0
                                );

                        },
                        0
                    );


            const element =
                document.getElementById(
                    "dashboard-pembelian-bulan"
                );


            if (!element) {
                return;
            }


            element.textContent =
                "Rp " +
                total.toLocaleString(
                    "id-ID"
                );

        }
        catch (error) {

            console.error(
                "DASHBOARD PEMBELIAN BULAN ERROR:",
                error
            );

        }

    },


    async loadTransaksiHari() {

        try {

            const today =
                new Date();


            const todayKey =
                today.getFullYear() +
                "-" +
                String(
                    today.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                ) +
                "-" +
                String(
                    today.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const penjualan =
                await DB.getAll(
                    "penjualan"
                );


            const count =
                penjualan.filter(
                    item => {

                        const date =
                            this.parseDate(
                                item.tanggal
                            );


                        if (!date) {
                            return false;
                        }


                        const key =
                            date.getFullYear() +
                            "-" +
                            String(
                                date.getMonth() + 1
                            ).padStart(
                                2,
                                "0"
                            ) +
                            "-" +
                            String(
                                date.getDate()
                            ).padStart(
                                2,
                                "0"
                            );


                        return (
                            key ===
                            todayKey
                        );

                    }
                )
                .length;


            const element =
                document.getElementById(
                    "dashboard-transaksi-hari"
                );


            if (!element) {
                return;
            }


            element.textContent =
                count.toLocaleString(
                    "id-ID"
                );

        }
        catch (error) {

            console.error(
                "DASHBOARD TRANSAKSI HARI ERROR:",
                error
            );

        }

    },


    async loadChartOmsetHarian() {

        try {

            const periode =
                document.getElementById(
                    "dashboard-periode"
                );


            const value =
                periode
                    ? String(
                        periode.value || ""
                    ).trim()
                    : "";


            if (!value) {
                return [];
            }


            const [
                tahunText,
                bulanText
            ] =
                value.split(
                    "-"
                );


            const tahun =
                Number(
                    tahunText
                );


            const bulan =
                Number(
                    bulanText
                );


            if (
                !tahun ||
                !bulan ||
                bulan < 1 ||
                bulan > 12
            ) {

                return [];

            }


            const jumlahHari =
                new Date(
                    tahun,
                    bulan,
                    0
                ).getDate();


            const data =
                Array.from(
                    {
                        length:
                            jumlahHari
                    },
                    (_, index) => {

                        return {
                            tanggal:
                                index + 1,

                            omset:
                                0
                        };

                    }
                );


            const penjualan =
                await DB.getAll(
                    "penjualan"
                );


            penjualan.forEach(
                item => {

                    if (!item) {
                        return;
                    }


                    const status =
                        String(
                            item.status || ""
                        )
                            .trim()
                            .toUpperCase();


                    if (
                        status ===
                        "RETUR"
                    ) {

                        return;

                    }


                    const date =
                        this.parseDate(
                            item.tanggal
                        );


                    if (!date) {
                        return;
                    }


                    if (
                        date.getFullYear() !==
                            tahun ||
                        date.getMonth() + 1 !==
                            bulan
                    ) {

                        return;

                    }


                    const tanggal =
                        date.getDate();


                    const index =
                        tanggal - 1;


                    if (
                        !data[index]
                    ) {

                        return;

                    }


                    data[index].omset +=
                        Number(
                            item.total
                        ) || 0;

                }
            );


            return data;

        }
        catch (error) {

            console.error(
                "DASHBOARD CHART OMSET HARIAN ERROR:",
                error
            );

            return [];

        }

    },


    async loadChartTransaksiHarian() {

        try {

            const periode =
                document.getElementById(
                    "dashboard-periode"
                );


            const value =
                periode
                    ? String(
                        periode.value || ""
                    ).trim()
                    : "";


            if (!value) {
                return [];
            }


            const [
                tahunText,
                bulanText
            ] =
                value.split(
                    "-"
                );


            const tahun =
                Number(
                    tahunText
                );


            const bulan =
                Number(
                    bulanText
                );


            if (
                !tahun ||
                !bulan ||
                bulan < 1 ||
                bulan > 12
            ) {

                return [];

            }


            const jumlahHari =
                new Date(
                    tahun,
                    bulan,
                    0
                ).getDate();


            const data =
                Array.from(
                    {
                        length:
                            jumlahHari
                    },
                    (_, index) => {

                        return {
                            tanggal:
                                index + 1,

                            transaksi:
                                0
                        };

                    }
                );


            const penjualan =
                await DB.getAll(
                    "penjualan"
                );


            penjualan.forEach(
                item => {

                    if (!item) {
                        return;
                    }


                    const date =
                        this.parseDate(
                            item.tanggal
                        );


                    if (!date) {
                        return;
                    }


                    if (
                        date.getFullYear() !==
                            tahun ||
                        date.getMonth() + 1 !==
                            bulan
                    ) {

                        return;

                    }


                    const tanggal =
                        date.getDate();


                    const index =
                        tanggal - 1;


                    if (
                        !data[index]
                    ) {

                        return;

                    }


                    data[index].transaksi +=
                        1;

                }
            );


            return data;

        }
        catch (error) {

            console.error(
                "DASHBOARD CHART TRANSAKSI HARIAN ERROR:",
                error
            );

            return [];

        }

    },


    async loadNilaiStok() {

        try {

            const barang =
                await DB.getAll(
                    "barang"
                );


            const pembelian =
                await DB.getAll(
                    "pembelian"
                );


            const detailPembelian =
                await DB.getAll(
                    "detailPembelian"
                );


            const purchaseMap =
                new Map();


            pembelian.forEach(
                item => {

                    purchaseMap.set(
                        String(
                            item.id
                        ),
                        item
                    );

                }
            );


            const latestPurchase =
                new Map();


            detailPembelian.forEach(
                detail => {

                    const purchase =
                        purchaseMap.get(
                            String(
                                detail.id
                            )
                        );


                    if (!purchase) {
                        return;
                    }


                    const kode =
                        String(
                            detail.kode ||
                            ""
                        ).trim();


                    if (!kode) {
                        return;
                    }


                    const isi =
                        Number(
                            detail.isi
                        ) || 0;


                    const harga =
                        Number(
                            detail.harga
                        ) || 0;


                    const hargaSatuan =
                        isi > 0
                            ? Math.round(
                                harga / isi
                            )
                            : harga;


                    const current =
                        latestPurchase.get(
                            kode
                        );


                    const currentDate =
                        current
                            ? this.parseDate(
                                current.tanggal
                            )
                            : null;


                    const purchaseDate =
                        this.parseDate(
                            purchase.tanggal
                        );


                    if (
                        !current ||
                        (
                            purchaseDate &&
                            (
                                !currentDate ||
                                purchaseDate >
                                currentDate
                            )
                        )
                    ) {

                        latestPurchase.set(
                            kode,
                            {

                                hargaSatuan,

                                tanggal:
                                    purchase.tanggal

                            }
                        );

                    }

                }
            );


            let totalNilai =
                0;


            barang.forEach(
                item => {

                    const kode =
                        String(
                            item.kode ||
                            ""
                        ).trim();


                    if (!kode) {
                        return;
                    }


                    const stok =
                        Number(
                            item.stok
                        ) || 0;


                    const latest =
                        latestPurchase.get(
                            kode
                        );


                    if (!latest) {
                        return;
                    }


                    totalNilai +=
                        stok *
                        latest.hargaSatuan;

                }
            );


            const element =
                document.getElementById(
                    "dashboard-nilai-stok"
                );


            if (!element) {
                return;
            }


            element.textContent =
                "Rp " +
                Math.round(
                    totalNilai
                ).toLocaleString(
                    "id-ID"
                );

        }
        catch (error) {

            console.error(
                "DASHBOARD NILAI STOK ERROR:",
                error
            );

        }

    },


    showStokLama() {

        

    },


    parseDate(value) {

        if (!value) {
            return null;
        }


        const text =
            String(
                value
            ).trim();


        if (
            /^\d{4}-\d{2}-\d{2}$/.test(
                text
            )
        ) {

            const [
                year,
                month,
                day
            ] =
                text
                    .split("-")
                    .map(
                        Number
                    );


            const date =
                new Date(
                    year,
                    month - 1,
                    day
                );


            if (
                date.getFullYear() ===
                    year &&
                date.getMonth() ===
                    month - 1 &&
                date.getDate() ===
                    day
            ) {

                return date;

            }


            return null;

        }


        const date =
            new Date(
                text
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;

        }


        return date;

    }


};