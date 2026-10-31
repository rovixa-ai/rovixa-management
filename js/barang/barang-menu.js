/*======================================
    BARANG MENU
======================================*/

Object.assign(
    Barang,
    {


        /*======================================
        MENU BARANG
        ======================================*/

        menu(barang) {

            document
                .getElementById("page")
                .innerHTML = `

                    <div class="barang-menu-page">


                        <div class="barang-menu-header">

                            <div>

                                <h2>
                                    ${this.escapeHTML(
                                        barang.nama
                                    )}
                                </h2>

                                <p>

                                    ${this.escapeHTML(
                                        barang.kode
                                    )}

                                </p>

                            </div>

                        </div>


                        <div
                            class="barang-menu-card"
                        >


                            <button
                                class="barang-menu-item"
                                id="menu-detail-barang"
                            >

                                <div>

                                    <strong>
                                        Detail Barang
                                    </strong>

                                    <span>
                                        Lihat detail informasi barang
                                    </span>

                                </div>


                                <div>
                                    →
                                </div>

                            </button>


                            <button
                                class="barang-menu-item"
                                id="menu-tambah-satuan"
                            >

                                <div>

                                    <strong>
                                        Tambah Satuan
                                    </strong>

                                    <span>
                                        Tambahkan satuan dan harga barang
                                    </span>

                                </div>


                                <div>
                                    →
                                </div>

                            </button>


                            <button
                                class="barang-menu-item"
                                id="menu-penyesuaian-stok"
                            >

                                <div>

                                    <strong>
                                        Penyesuaian Stok
                                    </strong>

                                    <span>
                                        Tambah atau kurangi stok barang
                                    </span>

                                </div>


                                <div>
                                    →
                                </div>

                            </button>


                            <button
                                class="barang-menu-item"
                                id="menu-riwayat-stok"
                            >

                                <div>

                                    <strong>
                                        Riwayat Stok
                                    </strong>

                                    <span>
                                        Lihat riwayat pergerakan stok
                                    </span>

                                </div>


                                <div>
                                    →
                                </div>

                            </button>


                            <button
                                class="barang-menu-item"
                                id="menu-edit-barang"
                            >

                                <div>

                                    <strong>
                                        Edit Barang
                                    </strong>

                                    <span>
                                        Ubah data master barang
                                    </span>

                                </div>


                                <div>
                                    →
                                </div>

                            </button>


                            <button
                                class="btn-secondary"
                                id="barang-menu-kembali"
                            >

                                Kembali

                            </button>


                        </div>


                    </div>

                `;


            /*
            ======================================
            KEMBALI
            ======================================
            */

            document
                .getElementById(
                    "barang-menu-kembali"
                )
                .addEventListener(
                    "click",
                    () => {

                        Router.go(
                            "barang"
                        );

                    }
                );


            /*======================================
                DETAIL BARANG
                ======================================
                */

                document
                    .getElementById(
                        "menu-detail-barang"
                    )
                    .addEventListener(
                        "click",
                        () => {

                            BarangDetail.open(
                                barang
                            );

                        }
                    );


            /*
            ======================================
            TAMBAH SATUAN
            ======================================
            */

            document
                .getElementById(
                    "menu-tambah-satuan"
                )
                .addEventListener(
                    "click",
                    () => {

                        this.tambahSatuan(
                            barang
                        );

                    }
                );


            /*
            ======================================
            PENYESUAIAN STOK
            ======================================
            */

            document
                .getElementById(
                    "menu-penyesuaian-stok"
                )
                .addEventListener(
                    "click",
                    () => {

                        this.penyesuaianStok(
                            barang
                        );

                    }
                );


            /*
            ======================================
            RIWAYAT STOK
            ======================================
            */

            document
                .getElementById(
                    "menu-riwayat-stok"
                )
                .addEventListener(
                    "click",
                    () => {

                        this.riwayatStok(
                            barang
                        );

                    }
                );


            /*
            ======================================
            EDIT BARANG
            ======================================
            */

            document
                .getElementById(
                    "menu-edit-barang"
                )
                .addEventListener(
                    "click",
                    () => {

                        this.edit(
                            barang
                        );

                    }
                );

        },


        /*======================================
        TAMBAH SATUAN
        ======================================*/

        tambahSatuan(
            barang
        ) {

            Satuan.form(
                barang
            );

        },


        /*======================================
        PENYESUAIAN STOK
        ======================================*/

        penyesuaianStok(
            barang
        ) {

           

           Dialog.alert(
                "Menu Penyesuaian Stok untuk " +
                barang.nama +
                " akan dibuat."
            );

        },


        /*======================================
        RIWAYAT STOK
        ======================================*/

        riwayatStok(
    barang
) {

    BarangRiwayat.open(
        barang
    );

},


        /*======================================
        EDIT BARANG
        ======================================*/

        edit(
barang
) {

BarangEdit.open(
    barang
);


}

    }
);