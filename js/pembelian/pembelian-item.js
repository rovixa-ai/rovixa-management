const PembelianItem = {

    /* ======================================
       LOAD SATUAN
    ====================================== */

    async loadSatuan() {

        const data =
            await DB.getAll(
                "satuan"
            );


        


        return data;

    },


    /* ======================================
       SCAN BARCODE UTAMA
    ====================================== */

    async scanBarcode(barcode) {

        const value =
            String(
                barcode || ""
            ).trim();


        if (!value) {

           Dialog.alert(
                "Silakan scan barcode atau masukkan nama barang."
            );

            return;

        }


        try {

            const data =
                await this.loadSatuan();


            /* ==================================
               1. CARI BERDASARKAN BARCODE
            ================================== */

            let selected =
                data.find(
                    item =>
                        String(
                            item.barcodeSatuan || ""
                        ).trim() === value
                );


            /* ==================================
               2. JIKA BUKAN BARCODE
                  CARI BERDASARKAN NAMA
            ================================== */

            if (!selected) {

                const search =
                    value.toLowerCase();


                const barangMatches =
                    Pembelian.barangList.filter(
                        item => {

                            const nama =
                                String(
                                    item.nama || ""
                                )
                                .trim()
                                .toLowerCase();


                            const kode =
                                String(
                                    item.kode || ""
                                )
                                .trim()
                                .toLowerCase();


                            return (
                                nama.includes(search) ||
                                kode.includes(search)
                            );

                        }
                    );


                /* ==============================
                   TIDAK ADA BARANG
                ============================== */

                if (
                    barangMatches.length === 0
                ) {

                    Pembelian.pendingBarcode =
                        value;


                    const lanjut =
                        confirm(
                            "Barcode atau nama barang tidak ditemukan.\n\n" +
                            "Apakah ingin menambahkan barang baru?"
                        );


                    if (!lanjut) {

                        Pembelian.pendingBarcode =
                            "";

                        return;

                    }


                    await PembelianBarangForm.open({
                        barcode: value,
                        returnTo: "pembelian"
                    });


                    return;

                }


                /* ==============================
                   LEBIH DARI SATU BARANG
                ============================== */

                if (
                    barangMatches.length > 1
                ) {

                    let pilihan =
                        "Ditemukan beberapa barang:\n\n";


                    barangMatches.forEach(
                        (
                            barang,
                            index
                        ) => {

                            pilihan +=
                                (index + 1) +
                                ". " +
                                barang.kode +
                                " - " +
                                barang.nama +
                                "\n";

                        }
                    );


                    pilihan +=
                        "\nMasukkan nomor barang:";


                    const nomor =
                        prompt(
                            pilihan
                        );


                    if (
                        nomor === null
                    ) {

                        return;

                    }


                    const index =
                        Number(
                            nomor
                        ) - 1;


                    if (
                        !Number.isInteger(index) ||
                        index < 0 ||
                        index >=
                            barangMatches.length
                    ) {

                        Dialog.alert(
                            "Pilihan barang tidak valid."
                        );

                        return;

                    }


                    const barangTerpilih =
                        barangMatches[index];


                    /* ==============================
                       CARI SATUAN BARANG TERPILIH
                    ============================== */

                    const satuanBarang =
                        data.filter(
                            item =>
                                String(
                                    item.kode
                                ) ===
                                String(
                                    barangTerpilih.kode
                                )
                        );


                    if (
                        satuanBarang.length === 0
                    ) {

                        Dialog.alert(
                            "Barang belum memiliki satuan."
                        );

                        return;

                    }


                    /* ==============================
                       JIKA HANYA SATU SATUAN
                    ============================== */

                    if (
                        satuanBarang.length === 1
                    ) {

                        selected =
                            satuanBarang[0];

                    }

                    else {

                        /* ==========================
                           LEBIH DARI SATU SATUAN
                        ========================== */

                        let pilihanSatuan =
                            "Pilih satuan untuk:\n\n" +
                            barangTerpilih.nama +
                            "\n\n";


                        satuanBarang.forEach(
                            (
                                satuan,
                                satuanIndex
                            ) => {

                                pilihanSatuan +=
                                    (satuanIndex + 1) +
                                    ". " +
                                    satuan.satuan +
                                    " - " +
                                    Pembelian.formatRupiah(
                                        satuan.hargaBeli
                                    ) +
                                    "\n";

                            }
                        );


                        pilihanSatuan +=
                            "\nMasukkan nomor satuan:";


                        const nomorSatuan =
                            prompt(
                                pilihanSatuan
                            );


                        if (
                            nomorSatuan === null
                        ) {

                            return;

                        }


                        const satuanIndex =
                            Number(
                                nomorSatuan
                            ) - 1;


                        if (
                            !Number.isInteger(
                                satuanIndex
                            ) ||
                            satuanIndex < 0 ||
                            satuanIndex >=
                                satuanBarang.length
                        ) {

                            Dialog.alert(
                                "Pilihan satuan tidak valid."
                            );

                            return;

                        }


                        selected =
                            satuanBarang[
                                satuanIndex
                            ];

                    }

                }

                else {

                    /* ==============================
                       HANYA SATU BARANG
                    ============================== */

                    const barangTerpilih =
                        barangMatches[0];


                    const satuanBarang =
                        data.filter(
                            item =>
                                String(
                                    item.kode
                                ) ===
                                String(
                                    barangTerpilih.kode
                                )
                        );


                    if (
                        satuanBarang.length === 0
                    ) {

                        Dialog.alert(
                            "Barang belum memiliki satuan."
                        );

                        return;

                    }


                    /* ==============================
                       SATU SATUAN
                    ============================== */

                    if (
                        satuanBarang.length === 1
                    ) {

                        selected =
                            satuanBarang[0];

                    }

                    else {

                        /* ==========================
                           PILIH SATUAN
                        ========================== */

                        let pilihanSatuan =
                            "Pilih satuan untuk:\n\n" +
                            barangTerpilih.nama +
                            "\n\n";


                        satuanBarang.forEach(
                            (
                                satuan,
                                satuanIndex
                            ) => {

                                pilihanSatuan +=
                                    (satuanIndex + 1) +
                                    ". " +
                                    satuan.satuan +
                                    " - " +
                                    Pembelian.formatRupiah(
                                        satuan.hargaBeli
                                    ) +
                                    "\n";

                            }
                        );


                        pilihanSatuan +=
                            "\nMasukkan nomor satuan:";


                        const nomorSatuan =
                            prompt(
                                pilihanSatuan
                            );


                        if (
                            nomorSatuan === null
                        ) {

                            return;

                        }


                        const satuanIndex =
                            Number(
                                nomorSatuan
                            ) - 1;


                        if (
                            !Number.isInteger(
                                satuanIndex
                            ) ||
                            satuanIndex < 0 ||
                            satuanIndex >=
                                satuanBarang.length
                        ) {

                            Dialog.alert(
                                "Pilihan satuan tidak valid."
                            );

                            return;

                        }


                        selected =
                            satuanBarang[
                                satuanIndex
                            ];

                    }

                }

            }


            /* ==================================
               3. CARI BARANG
            ================================== */

            const barang =
                Pembelian.barangList.find(
                    item =>
                        String(
                            item.kode
                        ) ===
                        String(
                            selected.kode
                        )
                );


            if (!barang) {

                Dialog.alert(
                    "Barang untuk data tersebut tidak ditemukan."
                );

                return;

            }


            /* ==================================
               4. CEK ITEM YANG SAMA
            ================================== */

            const existingIndex =
                Pembelian.items.findIndex(
                    item =>
                        String(
                            item.barang || ""
                        ) ===
                        String(
                            selected.kode
                        ) &&
                        String(
                            item.satuan || ""
                        ) ===
                        String(
                            selected.satuan
                        )
                );


            if (
                existingIndex !== -1
            ) {

                Pembelian.items[
                    existingIndex
                ].qty =
                    Number(
                        Pembelian.items[
                            existingIndex
                        ].qty || 0
                    ) + 1;


                this.renderItems();


               


                return;

            }


            /* ==================================
               5. SEMUA SATUAN BARANG
            ================================== */

            const satuanList =
                data.filter(
                    item =>
                        String(
                            item.kode
                        ) ===
                        String(
                            selected.kode
                        )
                );


            /* ==================================
               6. TAMBAH ITEM BARU
            ================================== */

            Pembelian.items.push({

                barcode:
                    selected.barcodeSatuan ||
                    "",

                barang:
                    selected.kode,

                namaBarang:
                    barang.nama,

                satuan:
                    selected.satuan,

                satuanList:
                    satuanList,

                qty:
                    1,

                harga:
                    Number(
                        selected.hargaBeli
                    ) || 0,

                disc:
                    0

            });


            


            this.renderItems();

        }

        catch (error) {

            console.error(
                "SCAN BARCODE ERROR:",
                error
            );


           Dialog.alert(
                "Gagal mencari barcode atau nama barang."
            );

        }

    },


    /* ======================================
       CARI BARCODE PADA BARIS ITEM
    ====================================== */

    async findByBarcode(
        index,
        barcode
    ) {

        const value =
            String(
                barcode || ""
            ).trim();


        if (!value) {

            Pembelian.items[index].barcode =
                "";

            Pembelian.items[index].barang =
                "";

            Pembelian.items[index].namaBarang =
                "";

            Pembelian.items[index].satuan =
                "";

            Pembelian.items[index].satuanList =
                [];

            Pembelian.items[index].harga =
                0;


            this.renderItems();

            return;

        }


        try {

            const data =
                await this.loadSatuan();


            const selected =
                data.find(
                    item =>
                        String(
                            item.barcodeSatuan || ""
                        ).trim() === value
                );


            if (!selected) {

                Dialog.alert(
                    "Barcode tidak ditemukan."
                );


                Pembelian.items[index].barcode =
                    value;


                return;

            }


            /* ==================================
               BARCODE DITEMUKAN
            ================================== */

            const barang =
                Pembelian.barangList.find(
                    item =>
                        String(
                            item.kode
                        ) ===
                        String(
                            selected.kode
                        )
                );


            Pembelian.items[index].barcode =
                selected.barcodeSatuan ||
                value;


            Pembelian.items[index].barang =
                selected.kode;


            Pembelian.items[index].namaBarang =
                barang
                    ? barang.nama
                    : "";


            Pembelian.items[index].satuan =
                selected.satuan;


            Pembelian.items[index].harga =
                Number(
                    selected.hargaBeli
                ) || 0;


            /* ==================================
               LOAD SEMUA SATUAN BARANG
            ================================== */

            Pembelian.items[index].satuanList =
                data.filter(
                    item =>
                        String(
                            item.kode
                        ) ===
                        String(
                            selected.kode
                        )
                );


            


            this.renderItems();

        }

        catch (error) {

            console.error(
                "BARCODE ERROR:",
                error
            );


            Dialog.alert(
                "Gagal mencari barcode."
            );

        }

    },


    /* ======================================
       GANTI BARANG
    ====================================== */

    async changeBarang(
        index,
        kodeBarang
    ) {

        Pembelian.items[index].barang =
            kodeBarang;


        const barang =
            Pembelian.barangList.find(
                item =>
                    String(
                        item.kode
                    ) ===
                    String(
                        kodeBarang
                    )
            );


        Pembelian.items[index].namaBarang =
            barang
                ? barang.nama
                : "";


        Pembelian.items[index].barcode =
            "";


        Pembelian.items[index].satuan =
            "";


        Pembelian.items[index].harga =
            0;


        Pembelian.items[index].satuanList =
            [];


        if (!kodeBarang) {

            Pembelian.items[index].namaBarang =
                "";

            this.renderItems();

            return;

        }


        try {

            const data =
                await this.loadSatuan();


            const satuanList =
                data.filter(
                    item =>
                        String(
                            item.kode
                        ) ===
                        String(
                            kodeBarang
                        )
                );


            Pembelian.items[index].satuanList =
                satuanList;


            this.renderItems();

        }

        catch (error) {

            console.error(
                "LOAD SATUAN ERROR:",
                error
            );


            Dialog.alert(
                "Gagal membaca satuan barang."
            );

        }

    },


    /* ======================================
       GANTI SATUAN
    ====================================== */

    changeSatuan(
        index,
        namaSatuan
    ) {

        Pembelian.items[index].satuan =
            namaSatuan;


        const satuanList =
            Pembelian.items[index]
                .satuanList || [];


        const selected =
            satuanList.find(
                item =>
                    String(
                        item.satuan
                    ) ===
                    String(
                        namaSatuan
                    )
            );


        if (!selected) {

            Pembelian.items[index].barcode =
                "";

            Pembelian.items[index].harga =
                0;


            this.updateTotal();

            return;

        }


        Pembelian.items[index].barcode =
            selected.barcodeSatuan ||
            "";


        Pembelian.items[index].harga =
            Number(
                selected.hargaBeli
            ) || 0;


        this.renderItems();

    },


    /* ======================================
       TAMBAH ITEM
    ====================================== */

    addItem() {

        Pembelian.items.push({

            barcode: "",

            barang: "",

            namaBarang: "",

            satuan: "",

            satuanList: [],

            qty: 1,

            harga: 0,

            disc: 0

        });


        this.renderItems();

    },


    /* ======================================
       RENDER ITEM
    ====================================== */

    renderItems() {

        const tbody =
            document.getElementById(
                "pembelian-items"
            );


        if (!tbody) {

            return;

        }


        tbody.innerHTML =
            Pembelian.items
                .map(
                    (item, index) => `

                        <tr>

                            <td>

                                <input
                                    type="text"
                                    value="${item.barcode || ""}"
                                    data-field="barcode"
                                    data-index="${index}"
                                    placeholder="Barcode"
                                    autocomplete="off"
                                >

                            </td>


                            <td>

                                <select
                                    data-field="barang"
                                    data-index="${index}"
                                >

                                    <option value="">
                                        Pilih barang
                                    </option>


                                    ${Pembelian.barangList
                                        .map(
                                            barang => `

                                                <option
                                                    value="${barang.kode}"
                                                    ${
                                                        String(
                                                            item.barang
                                                        ) ===
                                                        String(
                                                            barang.kode
                                                        )
                                                            ? "selected"
                                                            : ""
                                                    }
                                                >

                                                    ${barang.kode}
                                                    -
                                                    ${barang.nama}

                                                </option>

                                            `
                                        )
                                        .join("")
                                    }

                                </select>

                            </td>


                            <td>

                                <select
                                    data-field="satuan"
                                    data-index="${index}"
                                >

                                    <option value="">
                                        Pilih satuan
                                    </option>


                                    ${(item.satuanList || [])
                                        .map(
                                            satuan => `

                                                <option
                                                    value="${satuan.satuan}"
                                                    ${
                                                        String(
                                                            item.satuan
                                                        ) ===
                                                        String(
                                                            satuan.satuan
                                                        )
                                                            ? "selected"
                                                            : ""
                                                    }
                                                >

                                                    ${satuan.satuan}

                                                </option>

                                            `
                                        )
                                        .join("")
                                    }

                                </select>

                            </td>


                            <td>

                                <input
                                    type="number"
                                    min="1"
                                    value="${item.qty}"
                                    data-field="qty"
                                    data-index="${index}"
                                >

                            </td>


                            <td>

                                <input
                                    type="number"
                                    min="0"
                                    value="${item.harga}"
                                    data-field="harga"
                                    data-index="${index}"
                                >

                            </td>


                            <td>

                                <input
                                    type="number"
                                    min="0"
                                    value="${item.disc}"
                                    data-field="disc"
                                    data-index="${index}"
                                >

                            </td>


                            <td class="pembelian-total">

                                ${Pembelian.formatRupiah(
                                    this.itemTotal(item)
                                )}

                            </td>


                            <td>

                                <button
                                    class="pembelian-remove"
                                    data-remove="${index}"
                                    type="button"
                                >
                                    ×
                                </button>

                            </td>

                        </tr>

                    `
                )
                .join("");


        this.bindItems();


        this.updateTotal();

    },


    /* ======================================
       EVENT ITEM
    ====================================== */

    bindItems() {

        document
            .querySelectorAll(
                "[data-field]"
            )
            .forEach(
                input => {


                    /* ==========================
                       INPUT
                    ========================== */

                    input.addEventListener(
                        "input",
                        event => {

                            const index =
                                Number(
                                    event.target
                                        .dataset
                                        .index
                                );


                            const field =
                                event.target
                                    .dataset
                                    .field;


                            if (
                                field !== "qty" &&
                                field !== "harga" &&
                                field !== "disc"
                            ) {

                                return;

                            }


                            Pembelian.items[index][field] =
                                Number(
                                    event.target.value
                                ) || 0;


                            this.updateTotal();

                        }
                    );


                    /* ==========================
                       CHANGE
                    ========================== */

                    input.addEventListener(
                        "change",
                        async event => {

                            const index =
                                Number(
                                    event.target
                                        .dataset
                                        .index
                                );


                            const field =
                                event.target
                                    .dataset
                                    .field;


                            const value =
                                event.target.value;


                            if (
                                field === "barcode"
                            ) {

                                await this.findByBarcode(
                                    index,
                                    value
                                );


                                return;

                            }


                            if (
                                field === "barang"
                            ) {

                                await this.changeBarang(
                                    index,
                                    value
                                );


                                return;

                            }


                            if (
                                field === "satuan"
                            ) {

                                this.changeSatuan(
                                    index,
                                    value
                                );


                                return;

                            }


                            if (
                                field === "qty" ||
                                field === "harga" ||
                                field === "disc"
                            ) {

                                Pembelian.items[index][field] =
                                    Number(
                                        value
                                    ) || 0;


                                this.updateTotal();

                            }

                        }
                    );


                    /* ==========================
                       ENTER BARCODE ITEM
                    ========================== */

                    if (
                        input.dataset.field ===
                        "barcode"
                    ) {

                        input.addEventListener(
                            "keydown",
                            async event => {

                                if (
                                    event.key !==
                                    "Enter"
                                ) {

                                    return;

                                }


                                event.preventDefault();


                                const index =
                                    Number(
                                        event.target
                                            .dataset
                                            .index
                                    );


                                await this.findByBarcode(
                                    index,
                                    event.target.value
                                );

                            }
                        );

                    }

                }
            );


        /* ==================================
           HAPUS ITEM
        ================================== */

        document
            .querySelectorAll(
                "[data-remove]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const index =
                                Number(
                                    button.dataset
                                        .remove
                                );


                            Pembelian.items.splice(
                                index,
                                1
                            );


                            this.renderItems();

                        }
                    );

                }
            );

    },


    /* ======================================
       TOTAL ITEM
    ====================================== */

    itemTotal(item) {

        const subtotal =
            Number(
                item.qty || 0
            ) *
            Number(
                item.harga || 0
            );


        const discount =
            Number(
                item.disc || 0
            );


        return Math.max(
            0,
            subtotal - discount
        );

    },


    /* ======================================
       TOTAL PEMBELIAN
    ====================================== */

    getTotal() {

        return Pembelian.items.reduce(
            (
                sum,
                item
            ) => {

                return sum +
                    this.itemTotal(
                        item
                    );

            },
            0
        );

    },


    /* ======================================
       UPDATE TOTAL
    ====================================== */

    updateTotal() {

        const total =
            this.getTotal();


        const element =
            document.getElementById(
                "pembelian-grand-total"
            );


        if (element) {

            element.textContent =
                Pembelian.formatRupiah(
                    total
                );

        }


        document
            .querySelectorAll(
                ".pembelian-total"
            )
            .forEach(
                (
                    element,
                    index
                ) => {

                    const item =
                        Pembelian.items[index];


                    if (item) {

                        element.textContent =
                            Pembelian.formatRupiah(
                                this.itemTotal(
                                    item
                                )
                            );

                    }

                }
            );


        if (
            typeof Pembelian.updatePaymentSummary ===
            "function"
        ) {

            Pembelian.updatePaymentSummary();

        }

    }

};