const PenjualanTransaksiModalMobileRender = {

    render(tanggal, transactions) {

        const data =
            Array.isArray(transactions)
                ? transactions
                : [];

        const modal =
            PenjualanTransaksiModal;


        // ======================================
        // SUMMARY
        // ======================================

        let totalTransaksi = 0;
        let totalItem = 0;
        let subtotal = 0;
        let discount = 0;
        let total = 0;

        let cash = 0;
        let qris = 0;
        let debit = 0;
        let transfer = 0;
        let totalPayment = 0;


        data.forEach(
            transaction => {

                totalTransaksi += 1;


                cash +=
                    Number(
                        transaction.CASH
                    ) || 0;


                qris +=
                    Number(
                        transaction.QRIS
                    ) || 0;


                debit +=
                    Number(
                        transaction.DEBIT
                    ) || 0;


                transfer +=
                    Number(
                        transaction.TRANSFER
                    ) || 0;


                totalPayment +=
                    Number(
                        transaction.totalPayment
                    ) || 0;


                const status =
                    String(
                        transaction.status ||
                        ""
                    )
                        .trim()
                        .toUpperCase();


                if (
                    status ===
                    "RETUR"
                ) {

                    return;

                }


                const items =
                    Array.isArray(
                        transaction.items
                    )
                        ? transaction.items
                        : [];


                totalItem +=
                    items.reduce(
                        (
                            itemTotal,
                            item
                        ) =>
                            itemTotal +
                            (
                                Number(
                                    item.qty
                                ) || 0
                            ),
                        0
                    );


                subtotal +=
                    Number(
                        transaction.subtotal
                    ) || 0;


                discount +=
                    Number(
                        transaction.disc ??
                        transaction.discount ??
                        0
                    ) || 0;


                total +=
                    Number(
                        transaction.total
                    ) || 0;

            }
        );


        // ======================================
        // HTML MODAL
        // ======================================

        return `

            <div
                class="penjualan-transaksi-overlay"
            >

                <div
                    class="penjualan-transaksi-dialog"
                    role="dialog"
                    aria-modal="true"
                >

                    <!-- HEADER -->

                    <div
                        class="penjualan-transaksi-header"
                    >

                        <div>

                            <h3>
                                Transaksi Penjualan
                            </h3>

                            <p>
                                ${modal.date(
                                    tanggal
                                )}
                            </p>

                        </div>


                        <button
                            type="button"
                            class="penjualan-transaksi-close"
                        >
                            ×
                        </button>

                    </div>


                    <!-- SUMMARY -->

                    <div
                        class="penjualan-transaksi-summary"
                    >

                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                Jumlah Transaksi
                            </span>

                            <strong>
                                ${modal.number(
                                    totalTransaksi
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                Total Item
                            </span>

                            <strong>
                                ${modal.number(
                                    totalItem
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${modal.money(
                                    subtotal
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                Discount
                            </span>

                            <strong>
                                ${modal.money(
                                    discount
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                Total
                            </span>

                            <strong>
                                ${modal.money(
                                    total
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                Cash
                            </span>

                            <strong>
                                ${modal.money(
                                    cash
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                QRIS
                            </span>

                            <strong>
                                ${modal.money(
                                    qris
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                Debit
                            </span>

                            <strong>
                                ${modal.money(
                                    debit
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card"
                        >
                            <span>
                                Transfer
                            </span>

                            <strong>
                                ${modal.money(
                                    transfer
                                )}
                            </strong>
                        </div>


                        <div
                            class="penjualan-transaksi-summary-card penjualan-transaksi-summary-total"
                        >
                            <span>
                                Total Payment
                            </span>

                            <strong>
                                ${modal.money(
                                    totalPayment
                                )}
                            </strong>
                        </div>

                    </div>


                    <!-- TABLE -->

                    <div
                        class="penjualan-transaksi-section"
                    >

                        <div
                            class="penjualan-transaksi-section-title"
                        >
                            Daftar Transaksi
                        </div>


                        <div
                            class="penjualan-transaksi-table-wrapper"
                        >

                            <table>

                                <thead>

                                    <tr>

                                        <th>
                                            No
                                        </th>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Kasir
                                        </th>

                                        <th>
                                            Subtotal
                                        </th>

                                        <th>
                                            Disc
                                        </th>

                                        <th>
                                            Total
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    ${
                                        data.length

                                            ? data
                                                .map(
                                                    (
                                                        transaction,
                                                        index
                                                    ) => `

                                                        <tr
                                                            class="penjualan-transaksi-row"
                                                            data-id="${modal.escape(
                                                                transaction.id ||
                                                                ""
                                                            )}"
                                                        >

                                                            <td>
                                                                ${
                                                                    index +
                                                                    1
                                                                }
                                                            </td>


                                                            <td>

                                                                <strong>

                                                                    ${modal.escape(
                                                                        transaction.id ||
                                                                        "-"
                                                                    )}

                                                                </strong>

                                                            </td>


                                                            <td>

                                                                ${modal.escape(
                                                                    transaction.kasir ||
                                                                    "-"
                                                                )}

                                                            </td>


                                                            <td>

                                                                ${modal.money(
                                                                    transaction.subtotal
                                                                )}

                                                            </td>


                                                            <td>

                                                                ${modal.money(
                                                                    transaction.disc ??
                                                                    transaction.discount ??
                                                                    0
                                                                )}

                                                            </td>


                                                            <td>

                                                                <strong>

                                                                    ${modal.money(
                                                                        transaction.total
                                                                    )}

                                                                </strong>

                                                            </td>


                                                            <td class="${
                                                                    String(transaction.status || "")
                                                                        .trim()
                                                                        .toUpperCase() === "RETUR"
                                                                            ? "status-retur"
                                                                            : "status-normal"
                                                                }">
                                                                    ${modal.escape(
                                                                        transaction.status || "-"
                                                                    )}
                                                                </td>
                                                        </tr>

                                                    `
                                                )
                                                .join("")

                                            : `

                                                <tr>

                                                    <td
                                                        colspan="7"
                                                        class="penjualan-transaksi-empty"
                                                    >
                                                        Tidak ada transaksi.
                                                    </td>

                                                </tr>

                                            `
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>


                    <!-- FOOTER -->

                    <div
                        class="penjualan-transaksi-footer"
                    >

                        <button
                            type="button"
                            class="penjualan-transaksi-footer-button"
                        >
                            Tutup
                        </button>

                    </div>

                </div>

            </div>

        `;

    }

};