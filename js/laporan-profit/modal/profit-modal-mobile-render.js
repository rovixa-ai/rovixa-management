const LaporanProfitModalMobileRender = {

    render(tanggal, transactions) {

        const transaksi =
            Array.isArray(transactions)
                ? transactions
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


        const formatDate =
            LaporanProfitModal.formatDate.bind(
                LaporanProfitModal
            );

        const formatTime =
            LaporanProfitModal.formatTime.bind(
                LaporanProfitModal
            );

        const formatCurrency =
            LaporanProfitModal.formatCurrency.bind(
                LaporanProfitModal
            );

        const escapeHtml =
            LaporanProfitModal.escapeHtml.bind(
                LaporanProfitModal
            );

        const escapeAttribute =
            LaporanProfitModal.escapeAttribute.bind(
                LaporanProfitModal
            );


        return `

            <div
                class="laporan-profit-transaksi-overlay"
                data-profit-modal-close="true"
            >

                <div
                    class="laporan-profit-transaksi-dialog"
                >


                    <div
                        class="laporan-profit-transaksi-header"
                    >

                        <div
                            class="laporan-profit-transaksi-title"
                        >

                            <div>
                                TRANSAKSI PROFIT
                            </div>

                            <span>
                                ${formatDate(tanggal)}
                            </span>

                        </div>


                        <button
                            type="button"
                            class="laporan-profit-transaksi-close"
                            id="laporanProfitTransaksiClose"
                        >
                            ×
                        </button>

                    </div>


                    <div
                        class="laporan-profit-transaksi-summary"
                    >


                        <div
                            class="laporan-profit-transaksi-summary-item"
                        >

                            <span>
                                Transaksi
                            </span>

                            <strong>
                                ${transaksi.length}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-transaksi-summary-item"
                        >

                            <span>
                                Penjualan
                            </span>

                            <strong>
                                ${formatCurrency(
                                    totalPenjualan
                                )}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-transaksi-summary-item"
                        >

                            <span>
                                HPP
                            </span>

                            <strong>
                                ${formatCurrency(
                                    totalHpp
                                )}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-transaksi-summary-item"
                        >

                            <span>
                                Gross Profit
                            </span>

                            <strong>
                                ${formatCurrency(
                                    totalGrossProfit
                                )}
                            </strong>

                        </div>


                    </div>


                    <div
                        class="laporan-profit-transaksi-body"
                    >

                        <div
                            class="laporan-profit-transaksi-table-wrapper"
                        >

                            <table
                                class="laporan-profit-transaksi-table"
                            >

                                <thead>

                                    <tr>

                                        <th>
                                            No
                                        </th>

                                        <th>
                                            ID Transaksi
                                        </th>

                                        <th>
                                            Jam
                                        </th>

                                        <th>
                                            Kasir
                                        </th>

                                        <th>
                                            Penjualan
                                        </th>

                                        <th>
                                            HPP
                                        </th>

                                        <th>
                                            Gross Profit
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    ${
                                        transaksi.length
                                        ?
                                        transaksi
                                            .map(
                                                (
                                                    row,
                                                    index
                                                ) =>
                                                    `

                                                    <tr
                                                        data-profit-transaksi-id="${escapeAttribute(
                                                            row.id
                                                        )}"
                                                        style="cursor:pointer"
                                                    >

                                                        <td>
                                                            ${
                                                                index + 1
                                                            }
                                                        </td>

                                                        <td>
                                                            ${escapeHtml(
                                                                row.id
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${formatTime(
                                                                row.tanggal
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${escapeHtml(
                                                                row.kasir ||
                                                                "-"
                                                            )}
                                                        </td>

                                                        <td class="text-right">
                                                            ${formatCurrency(
                                                                row.penjualan
                                                            )}
                                                        </td>

                                                        <td class="text-right">
                                                            ${formatCurrency(
                                                                row.hpp
                                                            )}
                                                        </td>

                                                        <td class="text-right">
                                                            ${formatCurrency(
                                                                row.grossProfit
                                                            )}
                                                        </td>

                                                    </tr>

                                                    `
                                            )
                                            .join("")

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

    }

};