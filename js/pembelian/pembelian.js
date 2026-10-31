const Pembelian = {

    /* ======================================
       STATE
    ====================================== */

    items: [],

    payments: [],

    barangList: [],

    pendingBarcode: "",

    preserveItems: false,


    /* ======================================
       RENDER
    ====================================== */

    render() {

        return PembelianRender.render();

    },


    /* ======================================
       INIT
    ====================================== */

    async init() {

        if (!this.preserveItems) {

                this.items = [];

                this.payments = [];

            }

            this.preserveItems = false;

            this.barangList = [];
            

        const tanggal =
            document.getElementById(
                "pembelian-tanggal"
            );


        if (tanggal) {

            tanggal.value =
                new Date()
                    .toISOString()
                    .split("T")[0];

        }


        await this.loadBarang();


        this.bindEvents();


        this.renderItems();


        this.renderPayments();
        

        if (this.pendingBarcode) {

            const barcode =
                this.pendingBarcode;

            this.pendingBarcode = "";


            await this.scanBarcode(
                barcode
            );

        }

    },



    /* ======================================
       LOAD BARANG
    ====================================== */

    async loadBarang() {

        try {

            const data =
                await DB.getAll(
                    "barang"
                );


            


            this.barangList =
                data.filter(
                    item =>
                        item.status !== "Nonaktif"
                );

        }

        catch (error) {

            console.error(
                "LOAD BARANG ERROR:",
                error
            );


            Dialog.alert(
                "Gagal membaca data barang."
            );

        }

    },


    /* ======================================
       EVENT UTAMA
    ====================================== */

    bindEvents() {

        const barcodeInput =
            document.getElementById(
                "pembelian-barcode"
            );


        const scanButton =
            document.getElementById(
                "pembelian-scan-barcode"
            );


        /* ======================================
           SCAN BARCODE
        ====================================== */

        const scanBarcode = async () => {

            const barcode =
                barcodeInput
                    ? barcodeInput.value.trim()
                    : "";


            if (!barcode) {

               Dialog.alert(
                    "Silakan scan atau masukkan barcode."
                );


                if (barcodeInput) {

                    barcodeInput.focus();

                }


                return;

            }


            


            try {

                await this.scanBarcode(
                    barcode
                );

            }

            catch (error) {

                console.error(
                    "SCAN BARCODE ERROR:",
                    error
                );

            }


            if (barcodeInput) {

                barcodeInput.value = "";

                barcodeInput.focus();

            }

        };


        if (scanButton) {

            scanButton.addEventListener(
                "click",
                scanBarcode
            );

        }


        if (barcodeInput) {

            barcodeInput.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        scanBarcode();

                    }

                }
            );

        }


        /* ======================================
           TAMBAH PAYMENT
        ====================================== */

        const tambahPayment =
            document.getElementById(
                "pembelian-tambah-payment"
            );


        if (tambahPayment) {

            tambahPayment.addEventListener(
                "click",
                () => {

                    this.addPayment();

                }
            );

        }


        /* ======================================
           BATAL
        ====================================== */

        const batal =
            document.getElementById(
                "pembelian-batal"
            );


        if (batal) {

            batal.addEventListener(
                "click",
                () => {

                    Router.go(
                        "pembelian"
                    );

                }
            );

        }


        /* ======================================
           SIMPAN
        ====================================== */

        const simpan =
            document.getElementById(
                "pembelian-simpan"
            );


        if (simpan) {

            simpan.addEventListener(
                "click",
                () => {

                    this.save();

                }
            );

        }

    },


    /* ======================================
       ITEM
    ====================================== */

    async loadSatuan() {

        return PembelianItem.loadSatuan();

    },


    async scanBarcode(
        barcode
    ) {

        return PembelianItem.scanBarcode(
            barcode
        );

    },


    async findByBarcode(
        index,
        barcode
    ) {

        return PembelianItem.findByBarcode(
            index,
            barcode
        );

    },


    async changeBarang(
        index,
        kodeBarang
    ) {

        return PembelianItem.changeBarang(
            index,
            kodeBarang
        );

    },


    changeSatuan(
        index,
        namaSatuan
    ) {

        return PembelianItem.changeSatuan(
            index,
            namaSatuan
        );

    },


    addItem() {

        return PembelianItem.addItem();

    },


    renderItems() {

        return PembelianItem.renderItems();

    },


    bindItems() {

        return PembelianItem.bindItems();

    },


    itemTotal(item) {

        return PembelianItem.itemTotal(
            item
        );

    },


    getTotal() {

        return PembelianItem.getTotal();

    },


    updateTotal() {

        return PembelianItem.updateTotal();

    },


    /* ======================================
       PAYMENT
    ====================================== */

    addPayment() {

        return PembelianPayment.addPayment();

    },


    renderPayments() {

        return PembelianPayment.renderPayments();

    },


    bindPayments() {

        return PembelianPayment.bindPayments();

    },


    getDibayar() {

        return PembelianPayment.getDibayar();

    },


    updatePaymentSummary() {

        return PembelianPayment.updatePaymentSummary();

    },


    /* ======================================
       SAVE
    ====================================== */

    async save() {

        return PembelianSave.save();

    },


    /* ======================================
       FORMAT RUPIAH
    ====================================== */

    formatRupiah(value) {

        return "Rp " +
            Number(
                value || 0
            ).toLocaleString(
                "id-ID"
            );

    }

};