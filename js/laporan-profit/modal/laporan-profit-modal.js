/* ======================================
   LAPORAN PROFIT
   MODAL TRANSAKSI
====================================== */

const LaporanProfitModal = {

    transactions: [],

    open(tanggal) {

        const transaksi =
            LaporanProfit.transactions
                ? LaporanProfit.transactions.filter(
                    row => row.tanggalKey === tanggal
                )
                : [];

        this.transactions = transaksi;

        this.render(tanggal);

        const modal =
            document.getElementById(
                "laporan-profit-transaksi-modal"
            );

        if (!modal) return;

        modal.classList.add("active");

        document.body.classList.add(
            "laporan-profit-modal-open"
        );
    },


    close() {

        const modal =
            document.getElementById(
                "laporan-profit-transaksi-modal"
            );

        if (!modal) return;

        modal.classList.remove("active");

        document.body.classList.remove(
            "laporan-profit-modal-open"
        );
    },


    render(tanggal) {

        let modal =
            document.getElementById(
                "laporan-profit-transaksi-modal"
            );

        if (!modal) {

            modal =
                document.createElement("div");

            modal.id =
                "laporan-profit-transaksi-modal";

            modal.className =
                "laporan-profit-transaksi-modal";

            document.body.appendChild(modal);
        }

        const transaksi =
    Array.isArray(this.transactions)
        ? [...this.transactions].sort(
            (a, b) =>
                String(b.id || "").localeCompare(
                    String(a.id || ""),
                    undefined,
                    { numeric: true }
                )
        )
        : [];

        const totalPenjualan =
            transaksi.reduce(
                (total, row) =>
                    total +
                    Number(row.penjualan || 0),
                0
            );

        const totalHpp =
            transaksi.reduce(
                (total, row) =>
                    total +
                    Number(row.hpp || 0),
                0
            );

        const totalGrossProfit =
            transaksi.reduce(
                (total, row) =>
                    total +
                    Number(row.grossProfit || 0),
                0
            );

        modal.innerHTML = `

            <div
                class="laporan-profit-transaksi-overlay"
                data-profit-modal-close="true"
            >

                <div class="laporan-profit-transaksi-dialog">

                    <div class="laporan-profit-transaksi-header">

                        <div class="laporan-profit-transaksi-title">

                            <div>
                                TRANSAKSI PROFIT
                            </div>

                            <span>
                                ${this.formatDate(tanggal)}
                            </span>

                        </div>

                        <button
                            type="button"
                            class="laporan-profit-transaksi-close"
                            id="laporanProfitTransaksiClose"
                            aria-label="Tutup modal"
                        >
                            ×
                        </button>

                    </div>

                    <div class="laporan-profit-transaksi-summary">

                        <div class="laporan-profit-transaksi-summary-item">
                            <span>Transaksi</span>
                            <strong>${transaksi.length}</strong>
                        </div>

                        <div class="laporan-profit-transaksi-summary-item">
                            <span>Penjualan</span>
                            <strong>${this.formatCurrency(totalPenjualan)}</strong>
                        </div>

                        <div class="laporan-profit-transaksi-summary-item">
                            <span>HPP</span>
                            <strong>${this.formatCurrency(totalHpp)}</strong>
                        </div>

                        <div class="laporan-profit-transaksi-summary-item">
                            <span>Gross Profit</span>
                            <strong>${this.formatCurrency(totalGrossProfit)}</strong>
                        </div>

                    </div>

                    <div class="laporan-profit-transaksi-body">

                        <div class="laporan-profit-transaksi-table-wrapper">

                            <table class="laporan-profit-transaksi-table">

                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>ID Transaksi</th>
                                        <th>Jam</th>
                                        <th>Kasir</th>
                                        <th>Penjualan</th>
                                        <th>HPP</th>
                                        <th>Gross Profit</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    ${
                                        transaksi.length
                                        ?
                                        transaksi.map(
                                            (row, index) => `
                                                <tr
                                                    data-profit-transaksi-id="${this.escapeAttribute(row.id)}"
                                                    style="cursor:pointer"
                                                >
                                                    <td>${index + 1}</td>
                                                    <td>${this.escapeHtml(row.id)}</td>
                                                    <td>${this.formatTime(row.tanggal)}</td>
                                                    <td>${this.escapeHtml(row.kasir || "-")}</td>
                                                    <td class="text-right">${this.formatCurrency(row.penjualan)}</td>
                                                    <td class="text-right">${this.formatCurrency(row.hpp)}</td>
                                                    <td class="text-right">${this.formatCurrency(row.grossProfit)}</td>
                                                </tr>
                                            `
                                        ).join("")
                                        :
                                        `
                                            <tr>
                                                <td
                                                    colspan="7"
                                                    class="laporan-profit-transaksi-empty"
                                                >
                                                    Tidak ada transaksi
                                                </td>
                                            </tr>
                                        `
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>
        `;

        this.bindEvents();
    },


    bindEvents() {

        const modal =
            document.getElementById(
                "laporan-profit-transaksi-modal"
            );

        if (!modal) return;

        const closeButton =
            modal.querySelector(
                "#laporanProfitTransaksiClose"
            );

        if (closeButton) {

            closeButton.onclick = event => {

                event.preventDefault();
                event.stopPropagation();

                this.close();

            };
        }

        const overlay =
            modal.querySelector(
                ".laporan-profit-transaksi-overlay"
            );

        if (overlay) {

            overlay.onclick = event => {

                if (
                    event.target === overlay
                ) {

                    this.close();

                }
            };
        }

        const dialog =
            modal.querySelector(
                ".laporan-profit-transaksi-dialog"
            );

        if (dialog) {

            dialog.onclick = event => {

                event.stopPropagation();

            };
        }

        const rows =
            modal.querySelectorAll(
                "[data-profit-transaksi-id]"
            );

        rows.forEach(rowElement => {

            rowElement.onclick = () => {

                const id =
                    rowElement.dataset
                        .profitTransaksiId;

                this.openDetail(id);

            };

        });

        document.removeEventListener(
            "keydown",
            this.handleEscape
        );

        document.addEventListener(
            "keydown",
            this.handleEscape
        );
    },


    openDetail(id) {

        const row =
            this.transactions.find(
                item =>
                    String(item.id) ===
                    String(id)
            );

        if (!row) return;

        if (
            typeof LaporanProfitDetailModal !==
            "undefined"
        ) {

            LaporanProfitDetailModal.open(id);

        }
    },


    handleEscape(event) {

        if (event.key === "Escape") {

            LaporanProfitModal.close();

        }
    },


    formatDate(value) {

        const text =
            String(value || "");

        const match =
            text.match(
                /^(\d{4})-(\d{2})-(\d{2})/
            );

        if (!match) return text;

        const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mei",
            "Jun",
            "Jul",
            "Agu",
            "Sep",
            "Okt",
            "Nov",
            "Des"
        ];

        const year = match[1];
        const month = Number(match[2]);
        const day = Number(match[3]);

        return `${day} ${months[month - 1]} ${year}`;
    },


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

        const number =
            Number(value || 0);

        return new Intl.NumberFormat(
            "id-ID",
            {
                maximumFractionDigits: 2
            }
        ).format(number);
    },


    formatCurrency(value) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        ).format(
            Number(value || 0)
        );
    },


    escapeHtml(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },


    escapeAttribute(value) {

        return this.escapeHtml(value);
    }

};