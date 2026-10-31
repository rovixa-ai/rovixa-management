/*======================================
SATUAN RENDER
======================================*/

const SatuanRender = {


    /*======================================
    PAGE RENDER
    ======================================*/

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof SatuanMobileRender !==
                "undefined"
            ) {

                return SatuanMobileRender.render();

            }

            return "";

        }


        if (
            typeof SatuanDesktopRender !==
            "undefined"
        ) {

            return SatuanDesktopRender.render();

        }


        return "";

    },


    /*======================================
    RENDER LIST
    ======================================*/

    renderList(
        keyword = ""
    ) {

        const list =
            Array.isArray(
                Satuan.satuanList
            )
                ? Satuan.satuanList
                : [];


        const barangList =
            Array.isArray(Satuan.barangList)
                ? Satuan.barangList
                : [];

        const getNamaBarang = kode => {
            const barang = barangList.find(
                row =>
                    String(row.kode).trim() ===
                    String(kode).trim()
            );

            return barang?.nama || barang?.namaBarang || "-";
        };


        const search =
            String(
                keyword || ""
            )
                .trim()
                .toLowerCase();


        const filtered =
            search
                ? list.filter(
                    item => {

                        const barang =
                            barangList.find(
                                row =>
                                    String(
                                        row.kode
                                    ) ===
                                    String(
                                        item.kode
                                    )
                            );


                        return [

                            item.kode,

                            item.satuan,

                            item.barcodeSatuan,

                            barang
                                ? barang.namaBarang
                                : ""

                        ]
                            .some(
                                value =>
                                    String(
                                        value || ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            search
                                        )
                            );

                    }
                )
                : list;


        const container =
            document.getElementById(
                "satuan-list"
            );


        if (!container) {
            return;
        }


        if (!filtered.length) {

            container.innerHTML = `
                <tr>

                    <td
                        colspan="6"
                        class="satuan-empty"
                    >
                        Tidak ada data satuan.
                    </td>

                </tr>
            `;

            return;

        }


        container.innerHTML =
            filtered
                .map(
                    item => {

                        const barang =
                            barangList.find(
                                row =>
                                    String(
                                        row.kode
                                    ) ===
                                    String(
                                        item.kode
                                    )
                            );


                        const namaBarang =
                            barang
                                ? barang.namaBarang
                                : "-";


                        const konversi =
                            item.isi ??
                            item.konversi ??
                            1;


                        const discount =
                            item.discount ??
                            item.disc ??
                            0;


                        return `

                            <tr
                                class="satuan-row"
                                data-kode="${this.escape(
                                    item.kode || ""
                                )}"
                                data-satuan="${this.escape(
                                    item.satuan || ""
                                )}"
                            >

                                <td>

                                    ${this.escape(
                                        item.kode || "-"
                                    )}

                                </td>


                               <td>
                                    ${this.escape(
                                        getNamaBarang(item.kode)
                                    )}
                                </td>


                                <td>

                                    ${this.escape(
                                        item.satuan || "-"
                                    )}

                                </td>


                                <td>

                                    ${this.escape(
                                        konversi
                                    )}

                                </td>


                                <td>

                                    ${Satuan.formatRupiah(
                                        item.hargaJual
                                    )}

                                </td>


                                <td>

                                    ${Satuan.formatRupiah(
                                        discount
                                    )}

                                </td>

                            </tr>

                        `;

                    }
                )
                .join("");


        this.bindListEvents();

    },


    /*======================================
    BIND LIST EVENTS
    ======================================*/

    bindListEvents() {

        const container =
            document.getElementById(
                "satuan-list"
            );


        if (!container) {
            return;
        }


        const rows =
            container.querySelectorAll(
                ".satuan-row"
            );


        rows.forEach(
            row => {

                row.addEventListener(
                    "click",
                    () => {

                        const kode =
                            row.dataset.kode;

                        const satuan =
                            row.dataset.satuan;


                        const item =
                            Satuan.satuanList.find(
                                data =>
                                    String(
                                        data.kode
                                    ) ===
                                    String(kode) &&
                                    String(
                                        data.satuan
                                    ) ===
                                    String(satuan)
                            );


                        if (!item) {
                            return;
                        }


                        Satuan.form(
                            item,
                            {
                                edit: true
                            }
                        );

                    }
                );

            }
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