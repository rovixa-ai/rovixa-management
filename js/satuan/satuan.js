/*======================================
SATUAN
======================================*/

const Satuan = {

    /*======================================
    STATE
    ======================================*/

    barangList: [],

    satuanList: [],

    formOptions: {},


    /*======================================
    RENDER
    ======================================*/

    render() {

        return SatuanRender.render();

    },


    /*======================================
    INIT
    ======================================*/

    async init() {

        const button =
            document.getElementById(
                "satuan-tambah"
            );


        if (button) {

            button.addEventListener(
                "click",
                () => {

                    this.form();

                }
            );

        }


        const search =
            document.getElementById(
                "satuan-search"
            );


        if (search) {

            search.addEventListener(
                "input",
                event => {

                    this.renderList(
                        event.target.value
                    );

                }
            );

        }


        await this.loadData();

    },


    /*======================================
    LOAD DATA
    ======================================*/

    async loadData() {

        try {

            const [
                barang,
                satuan
            ] =
                await Promise.all([

                    DB.getAll(
                        "barang"
                    ),

                    DB.getAll(
                        "satuan"
                    )

                ]);


            this.barangList =
                barang.filter(
                    item =>
                        item.status !==
                        "Nonaktif"
                );


            this.satuanList =
                satuan.filter(
                    item =>
                        item.status !==
                        "Nonaktif"
                );


           


            this.renderList();

        }

        catch (error) {

            console.error(
                "LOAD SATUAN ERROR:",
                error
            );


            Dialog.alert(
                "Gagal membaca data satuan."
            );

        }

    },


    /*======================================
    RENDER LIST
    ======================================*/

    renderList(
        keyword = ""
    ) {

        return SatuanRender.renderList(
            keyword
        );

    },


    /*======================================
    FORM
    ======================================*/

    form(
        barang = null,
        options = {}
    ) {

        return SatuanForm.form(
            barang,
            options
        );

    },


    /*======================================
    LOAD BARANG SELECT
    ======================================*/

    async loadBarangSelect() {

        return SatuanForm.loadBarangSelect();

    },


    /*======================================
    LOAD BARANG
    ======================================*/

    async loadBarang(
        selectedBarang = null
    ) {

        return SatuanForm.loadBarang(
            selectedBarang
        );

    },


    /*======================================
    SAVE
    ======================================*/

    async save() {

        return SatuanForm.save();

    },


    /*======================================
    FORMAT RUPIAH
    ======================================*/

    formatRupiah(
        value
    ) {

        return "Rp " +
            Number(
                value || 0
            )
            .toLocaleString(
                "id-ID"
            );

    }

};