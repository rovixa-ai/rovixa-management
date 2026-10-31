const LaporanProfitDetailModalMobileRender = {

    render(transaction) {

        if (!transaction) {
            return "";
        }


        const items =
            Array.isArray(transaction.items)
                ? transaction.items
                : [];


        const totalPenjualan =
            items.reduce(
                (total, item) => {

                    const harga =
                        Number(item.harga) || 0;

                    const qty =
                        Number(item.qty) || 0;

                    return total + (harga * qty);

                },
                0
            );


        const totalHpp =
            Number(transaction.hpp) || 0;


        const discountPenjualan =
            Number(
                transaction.disc ??
                transaction.discount ??
                0
            );


        const grossProfit =
            Number(transaction.grossProfit) ||
            (totalPenjualan - totalHpp);


        const marginProfit =
            totalPenjualan > 0
                ? (grossProfit / totalPenjualan) * 100
                : 0;


        const tanggal =
            LaporanProfitDetailModal.formatDate(
                transaction.tanggal
            );


        const jam =
            LaporanProfitDetailModal.formatTime(
                transaction.tanggal
            );


        const status =
            transaction.status || "-";


        const rows =
            items.length
                ? items.map(
                    (item, index) => {

                        const qty =
                            Number(item.qty) || 0;

                        const konversi =
                            Number(item.konversi) || 1;

                        const harga =
                            Number(item.harga) || 0;

                        const discount =
                            Number(item.disc) || 0;

                        const subtotal =
                            Math.max(
                                0,
                                (qty * harga) -
                                discount
                            );

                        const hargaBeli =
                            Number(
                                item.hargaBeli
                            ) || 0;

                        const hpp =
                            Number(item.hpp) || 0;

                        const profit =
                            subtotal - hpp;


                        return `

                            <tr>

                                <td>
                                    ${index + 1}
                                </td>

                                <td>
                                    ${LaporanProfitDetailModal.escapeHtml(
                                        item.kode || "-"
                                    )}
                                </td>

                                <td>
                                    ${LaporanProfitDetailModal.escapeHtml(
                                        item.namaBarang || "-"
                                    )}
                                </td>

                                <td>
                                    ${LaporanProfitDetailModal.escapeHtml(
                                        item.satuan || "-"
                                    )}
                                </td>

                                <td class="number">
                                    ${LaporanProfitDetailModal.formatNumber(
                                        qty
                                    )}
                                </td>

                                <td class="number">
                                    ${LaporanProfitDetailModal.formatNumber(
                                        konversi
                                    )}
                                </td>

                                <td class="currency">
                                    ${LaporanProfitDetailModal.formatCurrency(
                                        harga
                                    )}
                                </td>

                                <td class="currency">
                                    ${LaporanProfitDetailModal.formatCurrency(
                                        discount
                                    )}
                                </td>

                                <td class="currency">
                                    ${LaporanProfitDetailModal.formatCurrency(
                                        subtotal
                                    )}
                                </td>

                                <td class="currency">
                                    ${LaporanProfitDetailModal.formatCurrency(
                                        hargaBeli
                                    )}
                                </td>

                                <td class="currency">
                                    ${LaporanProfitDetailModal.formatCurrency(
                                        hpp
                                    )}
                                </td>

                                <td class="currency">
                                    ${LaporanProfitDetailModal.formatCurrency(
                                        profit
                                    )}
                                </td>

                            </tr>

                        `;

                    }
                ).join("")

                :

                `

                    <tr>

                        <td
                            colspan="12"
                            class="empty"
                        >
                            Tidak ada detail barang.
                        </td>

                    </tr>

                `;


        return `

            <div
                class="laporan-profit-detail-modal-overlay"
            >

                <div
                    class="laporan-profit-detail-modal-content"
                >


                    <div
                        class="laporan-profit-detail-modal-header"
                    >

                        <div>

                            <h2>
                                DETAIL TRANSAKSI
                            </h2>

                            <div
                                class="laporan-profit-detail-modal-id"
                            >
                                ${LaporanProfitDetailModal.escapeHtml(
                                    transaction.id || "-"
                                )}
                            </div>

                        </div>


                        <button
                            type="button"
                            class="laporan-profit-detail-modal-close"
                            id="laporanProfitDetailClose"
                        >
                            ×
                        </button>

                    </div>


                    <div
                        class="laporan-profit-detail-info"
                    >

                        <div
                            class="laporan-profit-detail-info-item"
                        >

                            <span>
                                ID Transaksi
                            </span>

                            <strong>
                                ${LaporanProfitDetailModal.escapeHtml(
                                    transaction.id || "-"
                                )}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-detail-info-item"
                        >

                            <span>
                                Tanggal
                            </span>

                            <strong>
                                ${tanggal}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-detail-info-item"
                        >

                            <span>
                                Jam
                            </span>

                            <strong>
                                ${jam}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-detail-info-item"
                        >

                            <span>
                                Kasir
                            </span>

                            <strong>
                                ${LaporanProfitDetailModal.escapeHtml(
                                    transaction.kasir || "-"
                                )}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-detail-info-item"
                        >

                            <span>
                                Status
                            </span>

                            <strong>
                                ${LaporanProfitDetailModal.escapeHtml(
                                    status
                                )}
                            </strong>

                        </div>

                    </div>


                    <div
                        class="laporan-profit-detail-summary"
                    >

                        <div
                            class="laporan-profit-detail-summary-card"
                        >

                            <span>
                                Penjualan
                            </span>

                            <strong>
                                ${LaporanProfitDetailModal.formatCurrency(
                                    totalPenjualan
                                )}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-detail-summary-card"
                        >

                            <span>
                                Discount
                            </span>

                            <strong>
                                ${LaporanProfitDetailModal.formatCurrency(
                                    discountPenjualan
                                )}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-detail-summary-card"
                        >

                            <span>
                                HPP
                            </span>

                            <strong>
                                ${LaporanProfitDetailModal.formatCurrency(
                                    totalHpp
                                )}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-detail-summary-card"
                        >

                            <span>
                                Gross Profit
                            </span>

                            <strong>
                                ${LaporanProfitDetailModal.formatCurrency(
                                    grossProfit
                                )}
                            </strong>

                        </div>


                        <div
                            class="laporan-profit-detail-summary-card"
                        >

                            <span>
                                Margin Profit
                            </span>

                            <strong>
                                ${marginProfit.toFixed(2)}%
                            </strong>

                        </div>

                    </div>


                    <div
                        class="laporan-profit-detail-table-wrapper"
                    >

                        <table
                            class="laporan-profit-detail-table"
                        >

                            <thead>

                                <tr>

                                    <th>
                                        No
                                    </th>

                                    <th>
                                        Kode
                                    </th>

                                    <th>
                                        Nama Barang
                                    </th>

                                    <th>
                                        Satuan
                                    </th>

                                    <th>
                                        Qty
                                    </th>

                                    <th>
                                        Konversi
                                    </th>

                                    <th>
                                        Harga Jual
                                    </th>

                                    <th>
                                        Discount
                                    </th>

                                    <th>
                                        Penjualan
                                    </th>

                                    <th>
                                        Harga Beli Terakhir
                                    </th>

                                    <th>
                                        HPP
                                    </th>

                                    <th>
                                        Profit
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${rows}

                            </tbody>

                        </table>

                    </div>


                    <div
                        class="laporan-profit-detail-modal-footer"
                    >

                        <button
                            type="button"
                            id="laporanProfitDetailTutup"
                            class="laporan-profit-detail-tutup"
                        >
                            Tutup
                        </button>

                    </div>


                </div>

            </div>

        `;

    }

};