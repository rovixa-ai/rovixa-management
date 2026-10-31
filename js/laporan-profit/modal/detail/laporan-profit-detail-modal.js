const LaporanProfitDetailModal = {

    currentTransaction: null,

    open(id) {

        const transaction =
            LaporanProfit.transactions.find(
                row => String(row.id) === String(id)
            );

        if (!transaction) {
            return;
        }

        this.currentTransaction = transaction;

        this.render();
        this.bindEvents();
    },

    close() {

        const modal =
            document.getElementById(
                "laporan-profit-detail-modal"
            );

        if (modal) {
            modal.remove();
        }

        if (this.handleEscape) {

            document.removeEventListener(
                "keydown",
                this.handleEscape
            );

            this.handleEscape = null;
        }

        this.currentTransaction = null;
    },

    render() {

        const transaction =
            this.currentTransaction;

        if (!transaction) {
            return;
        }

        const oldModal =
            document.getElementById(
                "laporan-profit-detail-modal"
            );

        if (oldModal) {
            oldModal.remove();
        }

        const modal =
            document.createElement("div");

        modal.id =
            "laporan-profit-detail-modal";

        modal.className =
            "laporan-profit-detail-modal";

        modal.innerHTML =
            LaporanProfitDetailModalRender.render(
                transaction
            );

        document.body.appendChild(modal);
    },

    bindEvents() {

        const modal =
            document.getElementById(
                "laporan-profit-detail-modal"
            );

        if (!modal) {
            return;
        }

        const closeButton =
            document.getElementById(
                "laporanProfitDetailClose"
            );

        const tutupButton =
            document.getElementById(
                "laporanProfitDetailTutup"
            );

        if (closeButton) {

            closeButton.onclick =
                () => this.close();

        }

        if (tutupButton) {

            tutupButton.onclick =
                () => this.close();

        }

        const overlay =
            modal.querySelector(
                ".laporan-profit-detail-modal-overlay"
            );

        if (overlay) {

            overlay.onclick =
                event => {

                    if (
                        event.target === overlay
                    ) {

                        this.close();

                    }

                };

        }

        this.handleEscape =
            event => {

                if (
                    event.key === "Escape"
                ) {

                    this.close();

                }

            };

        document.addEventListener(
            "keydown",
            this.handleEscape
        );
    },

    /* ======================================
       FORMAT DATE
       ISO UTC -> LOCAL DATE
    ====================================== */

    formatDate(value) {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );
    },

    /* ======================================
       FORMAT TIME
       ISO UTC -> LOCAL TIME
    ====================================== */

    formatTime(value) {

        if (!value) {
            return "-";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "-";
        }

        return date.toLocaleTimeString(
            "id-ID",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        );
    },

    formatNumber(value) {

        return Number(
            value || 0
        ).toLocaleString(
            "id-ID",
            {
                maximumFractionDigits: 2
            }
        );
    },

    formatCurrency(value) {

        return Number(
            value || 0
        ).toLocaleString(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        );
    },

    escapeHtml(value) {

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