/*======================================
HARGA PEMBELIAN BARANG
======================================*/



const HargaPembelian = {

/*======================================
STATE
======================================*/

data: [],

filtered: [],

supplierList: [],


/*======================================
RENDER
======================================*/

render() {

    return HargaPembelianRender.render();

},


/*======================================
INIT
======================================*/

async init() {

    this.data = [];

    this.filtered = [];

    this.supplierList = [];


    this.bindEvents();

    this.reset();


    await this.loadData();

},


/*======================================
BIND EVENTS
======================================*/

bindEvents() {

    const search =
        document.getElementById(
            "harga-pembelian-search"
        );


    const periode =
        document.getElementById(
            "harga-pembelian-periode"
        );


    const supplier =
        document.getElementById(
            "harga-pembelian-supplier"
        );


    const reset =
        document.getElementById(
            "harga-pembelian-reset"
        );


    if (search) {

        search.addEventListener(
            "input",
            () => {

                this.filter();

            }
        );

    }


    if (periode) {

        periode.addEventListener(
            "change",
            () => {

                this.filter();

            }
        );

    }


    if (supplier) {

        supplier.addEventListener(
            "change",
            () => {

                this.filter();

            }
        );

    }


    if (reset) {

        reset.addEventListener(
            "click",
            () => {

                this.reset();

            }
        );

    }

},


/*======================================
LOAD DATA
INDEXEDDB PEMBELIAN
======================================*/

async loadData() {

    try {

        /*==================================
        AMBIL DATA LOCAL
        ==================================*/

        const pembelian =
            await DB.getAll(
                "pembelian"
            );


        const detailPembelian =
            await DB.getAll(
                "detailPembelian"
            );


        


        /*==================================
        MAP DETAIL PEMBELIAN
        ==================================*/

        const detailMap =
            new Map();


        detailPembelian.forEach(
            item => {

                const id =
                    String(
                        item.id ||
                        ""
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
                    .push(
                        item
                    );

            }
        );


        /*==================================
        FLATTEN PEMBELIAN
        ==================================*/

        const result = [];


        pembelian.forEach(
            transaksi => {

                const id =
                    String(
                        transaksi.id ||
                        ""
                    ).trim();


                if (!id) {

                    return;

                }


                const items =
                    detailMap.get(
                        id
                    ) || [];


                items.forEach(
                    item => {

                        /*==========================
                        DATA DETAIL

                        Struktur IndexedDB:

                        kode
                        nama
                        satuan
                        qty
                        isi
                        harga
                        disc
                        total
                        ==========================*/

                        const kode =
                            String(
                                item.kode ||
                                ""
                            ).trim();


                        const namaBarang =
                            String(
                                item.nama ||
                                ""
                            ).trim();


                        const namaSatuan =
                            String(
                                item.satuan ||
                                ""
                            ).trim();


                        const qty =
                            Number(
                                item.qty
                            ) || 0;


                        const isi =
                            Number(
                                item.isi
                            ) || 0;


                        const harga =
                            Number(
                                item.harga
                            ) || 0;


                        const disc =
                            Number(
                                item.disc
                            ) || 0;


                        const total =
                            Number(
                                item.total
                            ) ||
                            Math.max(
                                0,
                                (
                                    qty *
                                    harga
                                ) -
                                disc
                            );


                        /*==========================
                        HARGA SATUAN DASAR

                        Harga Beli ÷ Isi

                        Qty tidak digunakan.
                        ==========================*/

                        const hargaSatuan =
                            isi > 0
                                ? Math.round(
                                    harga /
                                    isi
                                )
                                : 0;


                        /*==========================
                        PUSH RESULT
                        ==========================*/

                        result.push({

                            id:
                                id,

                            tanggal:
                                transaksi.tanggal,

                            supplier:
                                String(
                                    transaksi.supplier ||
                                    ""
                                ).trim(),

                            invoice:
                                String(
                                    transaksi.invoice ||
                                    ""
                                ).trim(),

                            status:
                                String(
                                    transaksi.status ||
                                    ""
                                ).trim(),

                            kode:
                                kode,

                            nama:
                                namaBarang,

                            satuan:
                                namaSatuan,

                            qty:
                                qty,

                            isi:
                                isi,

                            harga:
                                harga,

                            hargaSatuan:
                                hargaSatuan,

                            disc:
                                disc,

                            total:
                                total

                        });

                    }

                );

            }
        );


        /*==================================
        SIMPAN DATA
        ==================================*/

        this.data =
            result;


        this.filtered =
            [
                ...result
            ];


        


        /*==================================
        SUPPLIER
        ==================================*/

        this.buildSupplierList();

        this.renderSupplier();

        this.renderList();

    }

    catch (error) {

        console.error(
            "LOAD HARGA PEMBELIAN ERROR:",
            error
        );


        this.data = [];

        this.filtered = [];

        this.supplierList = [];


        this.renderSupplier();

        this.renderList();


        Dialog.alert(
            error.message ||
            "Gagal membaca data harga pembelian."
        );

    }

},


/*======================================
BUILD SUPPLIER LIST
======================================*/

buildSupplierList() {

    this.supplierList =
        [
            ...new Set(

                this.data
                    .map(
                        item =>
                            String(
                                item.supplier ||
                                ""
                            ).trim()
                    )
                    .filter(Boolean)

            )
        ]
        .sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "id"
                )
        );

},


/*======================================
RENDER SUPPLIER
======================================*/

renderSupplier() {

    const select =
        document.getElementById(
            "harga-pembelian-supplier"
        );


    if (!select) {

        return;

    }


    const selected =
        select.value;


    select.innerHTML = `

        <option value="">
            Semua Supplier
        </option>

        ${
            this.supplierList
                .map(
                    supplier => `

                        <option
                            value="${this.escape(
                                supplier
                            )}"
                        >
                            ${this.escape(
                                supplier
                            )}
                        </option>

                    `
                )
                .join("")
        }

    `;


    if (
        this.supplierList.includes(
            selected
        )
    ) {

        select.value =
            selected;

    }

},


/*======================================
FILTER
======================================*/

filter() {

    const searchInput =
        document.getElementById(
            "harga-pembelian-search"
        );


    const periodeInput =
        document.getElementById(
            "harga-pembelian-periode"
        );


    const supplierInput =
        document.getElementById(
            "harga-pembelian-supplier"
        );


    const keyword =
        searchInput
            ? String(
                searchInput.value || ""
            )
                .trim()
                .toLowerCase()
            : "";


    const periode =
        periodeInput
            ? periodeInput.value
            : "";


    const supplier =
        supplierInput
            ? supplierInput.value
            : "";


    this.filtered =
        this.data.filter(
            item => {

                const kode =
                    String(
                        item.kode || ""
                    )
                        .toLowerCase();


                const nama =
                    String(
                        item.nama || ""
                    )
                        .toLowerCase();


                const itemSupplier =
                    String(
                        item.supplier || ""
                    );


                const tanggal =
                    this.formatDateInput(
                        item.tanggal
                    );


                const matchSearch =
                    !keyword ||
                    kode.includes(
                        keyword
                    ) ||
                    nama.includes(
                        keyword
                    );


                const matchPeriode =
                    !periode ||
                    tanggal.startsWith(
                        periode
                    );


                const matchSupplier =
                    !supplier ||
                    itemSupplier ===
                    supplier;


                return (
                    matchSearch &&
                    matchPeriode &&
                    matchSupplier
                );

            }
        );


    this.renderList();

},


/*======================================
RESET
======================================*/

reset() {

    const search =
        document.getElementById(
            "harga-pembelian-search"
        );


    const periode =
        document.getElementById(
            "harga-pembelian-periode"
        );


    const supplier =
        document.getElementById(
            "harga-pembelian-supplier"
        );


    if (search) {

        search.value = "";

    }


    if (periode) {

        periode.value = "";

    }


    if (supplier) {

        supplier.value = "";

    }


    this.filtered =
        [
            ...this.data
        ];


    this.renderList();

},


/*======================================
RENDER LIST
======================================*/

renderList() {

    return HargaPembelianRender.renderList(
        this.filtered
    );

},


/*======================================
FORMAT DATE
======================================*/

date(value) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );

    }


    return date.toLocaleDateString(
        "id-ID",
        {
            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric"
        }
    );

},


/*======================================
FORMAT DATE INPUT
======================================*/

formatDateInput(value) {

    if (!value) {

        return "";

    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        const text =
            String(
                value
            );


        return text.length >= 7
            ? text.substring(
                0,
                7
            )
            : text;

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    return `${year}-${month}`;

},


/*======================================
FORMAT NUMBER
======================================*/

number(value) {

    return Number(
        value || 0
    )
        .toLocaleString(
            "id-ID"
        );

},


/*======================================
FORMAT RUPIAH
======================================*/

formatRupiah(value) {

    return "Rp " +
        Number(
            value || 0
        )
            .toLocaleString(
                "id-ID"
            );

},


/*======================================
ESCAPE
======================================*/

escape(value) {

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

};
