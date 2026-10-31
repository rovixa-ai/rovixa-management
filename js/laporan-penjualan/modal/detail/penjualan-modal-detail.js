Object.assign(LaporanPenjualan, {

    detail(id) {

        const row =
            this.filtered.find(

                item =>
                    String(
                        item.id
                    ) === String(id)

            );


        if (!row) return;


        this.showDetailModal(row);

    },


    // ==================================
    // SHOW DETAIL MODAL
    // ==================================

    showDetailModal(row) {

        this.removeDetailModal();


        const items =
            Array.isArray(row.items)
                ? row.items
                : [];


        const payments =
            Array.isArray(row.payments)
                ? row.payments
                : [];


        const modal =
            document.createElement(
                "div"
            );


        modal.id =
            "laporanPenjualanDetailModal";


        modal.className =
            "laporan-penjualan-detail-modal";


        modal.innerHTML =
    LaporanPenjualanDetailModalRender.render(
        row,
        items,
        payments
    );


        document.body.appendChild(
            modal
        );


        this.bindDetailModalEvents();

    },


    // ==================================
    // MODAL EVENTS
    // ==================================

    bindDetailModalEvents() {

        const modal =
            document.getElementById(
                "laporanPenjualanDetailModal"
            );


        if (!modal) return;


        modal.addEventListener(
            "click",
            event => {

                const action =
                    event.target.closest(
                        '[data-action="close-detail"]'
                    );


                if (!action) return;


                this.removeDetailModal();

            }
        );


        document.addEventListener(
            "keydown",
            this.detailEscapeHandler
        );

    },


    // ==================================
    // ESC KEY
    // ==================================

    detailEscapeHandler(event) {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        LaporanPenjualan
            .removeDetailModal();

    },


    // ==================================
    // REMOVE MODAL
    // ==================================

    removeDetailModal() {

        const modal =
            document.getElementById(
                "laporanPenjualanDetailModal"
            );


        if (modal) {

            modal.remove();

        }


        document.removeEventListener(
            "keydown",
            this.detailEscapeHandler
        );

    }

});