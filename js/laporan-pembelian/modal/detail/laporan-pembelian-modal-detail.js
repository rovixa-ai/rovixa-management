const PembelianDetailModal = {

data: null,
items: [],
payments: [],


/* ======================================
   OPEN
====================================== */

async open(
    id,
    transactions = []
) {

    this.close();


    const transactionList =
        Array.isArray(
            transactions
        )
            ? transactions
            : [];


    const row =
        transactionList.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    id
                )
        );


    if (!row) {

        console.error(
            "Data pembelian tidak ditemukan:",
            id
        );

        return;

    }


    this.data =
        row;


    this.items = [];


    /* ======================================
       LOAD DETAIL BARANG
    ====================================== */

    try {

        const detailPembelian =
            await DB.getAll(
                "detailPembelian"
            );


        this.items =
            detailPembelian

                .filter(
                    item =>
                        String(
                            item.id || ""
                        ).trim() ===
                        String(
                            id || ""
                        ).trim()
                )

                .map(
                    item => ({

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

                        isi:
                            Number(
                                item.isi
                            ) || 0,

                        harga:
                            Number(
                                item.harga
                            ) || 0,

                        disc:
                            Number(
                                item.disc
                            ) || 0,

                        total:
                            Number(
                                item.total
                            ) || 0

                    })
                );


    }
    catch (error) {

        console.error(
            "Gagal membaca detail pembelian:",
            error
        );


        this.items =
            Array.isArray(
                row.items
            )
                ? row.items
                : [];

    }


    this.payments =
        Array.isArray(
            row.payments
        )
            ? row.payments
            : [];


    this.render();

},


/* ======================================
   RENDER
====================================== */

render() {

    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "pembelian-detail-modal";


    modal.className =
        "pembelian-detail-modal";


    modal.innerHTML =
        PembelianDetailModalRender.render();


    document.body.appendChild(
        modal
    );


    this.bindEvents(
        modal
    );


    this.bindEscape();

},


/* ======================================
   EVENTS
====================================== */

bindEvents(
    modal
) {

    if (!modal) {
        return;
    }


    modal.addEventListener(
        "click",
        event => {

            const closeButton =
                event.target.closest(
                    '[data-action="close"]'
                );


            if (!closeButton) {
                return;
            }


            event.preventDefault();

            event.stopPropagation();


            this.close();

        }
    );

},


/* ======================================
   ESCAPE
====================================== */

bindEscape() {

    this.unbindEscape();


    this.escapeHandler =
        event => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            this.close();

        };


    document.addEventListener(
        "keydown",
        this.escapeHandler
    );

},


unbindEscape() {

    if (
        this.escapeHandler
    ) {

        document.removeEventListener(
            "keydown",
            this.escapeHandler
        );


        this.escapeHandler =
            null;

    }

},


/* ======================================
   CLOSE
====================================== */

close() {

    const modal =
        document.getElementById(
            "pembelian-detail-modal"
        );


    if (modal) {

        modal.remove();

    }


    this.unbindEscape();


    this.data =
        null;


    this.items =
        [];


    this.payments =
        [];

},


/* ======================================
   NUMBER
====================================== */

number(
    value
) {

    return (
        Number(
            value
        ) || 0
    ).toLocaleString(
        "id-ID"
    );

},


/* ======================================
   MONEY
====================================== */

money(
    value
) {

    return (
        "Rp " +
        (
            Number(
                value
            ) || 0
        ).toLocaleString(
            "id-ID"
        )
    );

},


/* ======================================
   DATE
====================================== */

date(
    value
) {

    if (!value) {
        return "-";
    }


    const text =
        String(
            value
        );


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            text
        )
    ) {

        const parts =
            text.split(
                "-"
            );


        return (
            parts[2] +
            "-" +
            parts[1] +
            "-" +
            parts[0]
        );

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

        return this.escape(
            text
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


/* ======================================
   ESCAPE
====================================== */

escape(
    value
) {

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