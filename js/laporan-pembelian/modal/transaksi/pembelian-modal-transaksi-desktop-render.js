const PembelianTransaksiModalDesktopRender = {

    render(
        tanggal,
        transactions
    ) {

       
const data =
    Array.isArray(transactions)
        ? [...transactions].sort(
            (a, b) =>
                String(b.id || "").localeCompare(
                    String(a.id || "")
                )
        )
        : [];



        const modal =
            PembelianTransaksiModal;


        return `

            <div
                class="pembelian-transaksi-modal-overlay"
                data-action="close"
            >

                <div
                    class="pembelian-transaksi-modal-container"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pembelianTransaksiModalTitle"
                >

                    <div
                        class="pembelian-transaksi-modal-header"
                    >

                        <div>

                           

                            <h3
                                id="pembelianTransaksiModalTitle"
                            >
                                Transaksi Pembelian
                            </h3>

                            <p>
                                ${modal.date(
                                    tanggal
                                )}
                            </p>

                        </div>


                        <button
                            type="button"
                            class="pembelian-transaksi-modal-close"
                            data-action="close"
                            aria-label="Tutup"
                        >
                            ×
                        </button>

                    </div>


                    <div
                        class="pembelian-transaksi-modal-info"
                    >

                        <div>

                            <span>
                                Jumlah Transaksi
                            </span>

                            <strong>
                                ${modal.number(
                                    data.length
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Subtotal Pembelian
                            </span>

                            <strong>
                                ${modal.money(
                                    data.reduce(
                                        (
                                            total,
                                            transaction
                                        ) => {

                                            return total +
                                                (
                                                    Number(
                                                        transaction.subtotal
                                                    ) || 0
                                                );

                                        },
                                        0
                                    )
                                )}
                            </strong>

                        </div>

                    </div>


                    <div
                        class="pembelian-transaksi-modal-section"
                    >

                        <div
                            class="pembelian-transaksi-modal-section-header"
                        >

                            <div>

                                <div
                                    class="pembelian-transaksi-modal-section-title"
                                >
                                    Daftar Transaksi
                                </div>

                                <div
                                    class="pembelian-transaksi-modal-section-subtitle"
                                >
                                    Transaksi pembelian pada tanggal yang dipilih
                                </div>

                            </div>


                            <div
                                class="pembelian-transaksi-modal-count"
                            >
                                ${modal.number(
                                    data.length
                                )}
                                Transaksi
                            </div>

                        </div>


                        <div
                            class="pembelian-transaksi-modal-table-wrapper"
                        >

                            <table
                                class="pembelian-transaksi-modal-table"
                            >

                                <thead>

                                    <tr>

                                        <th>
                                            No
                                        </th>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Supplier
                                        </th>

                                        <th>
                                            Invoice
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

                                    </tr>

                                </thead>


                                <tbody>

                                    ${
                                        data.length

                                            ?

                                            data
                                                .map(
                                                    (
                                                        transaction,
                                                        index
                                                    ) => `

                                                        <tr
                                                            class="pembelian-transaksi-row"
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
                                                                    transaction.supplier ||
                                                                    "-"
                                                                )}
                                                            </td>


                                                            <td>
                                                                ${modal.escape(
                                                                    transaction.invoice ||
                                                                    "-"
                                                                )}
                                                            </td>


                                                            <td
                                                                class="pembelian-transaksi-modal-money"
                                                            >
                                                                ${modal.money(
                                                                    transaction.subtotal
                                                                )}
                                                            </td>


                                                            <td
                                                                class="pembelian-transaksi-modal-money"
                                                            >
                                                                ${modal.money(
                                                                    transaction.disc ??
                                                                    transaction.discount ??
                                                                    0
                                                                )}
                                                            </td>


                                                            <td
                                                                class="pembelian-transaksi-modal-money pembelian-transaksi-modal-total"
                                                            >

                                                                <strong>
                                                                    ${modal.money(
                                                                        transaction.total
                                                                    )}
                                                                </strong>

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
                                                        class="pembelian-transaksi-modal-empty"
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


                    <div
                        class="pembelian-transaksi-modal-footer"
                    >

                        <div
                            class="pembelian-transaksi-modal-footer-total"
                        >

                            <span>
                                Total Pembelian
                            </span>

                            <strong>
                                ${modal.money(
                                    data.reduce(
                                        (
                                            total,
                                            transaction
                                        ) => {

                                            return total +
                                                (
                                                    Number(
                                                        transaction.total
                                                    ) || 0
                                                );

                                        },
                                        0
                                    )
                                )}
                            </strong>

                        </div>


                        <button
                            type="button"
                            class="pembelian-transaksi-modal-footer-button"
                            data-action="close"
                        >
                            Tutup
                        </button>

                    </div>

                </div>

            </div>

        `;

    }

};