const PembelianTransaksiModalMobileRender = {

    render() {

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
                                ${PembelianTransaksiModal.date(
                                    PembelianTransaksiModal._tanggal
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
                                ${PembelianTransaksiModal.number(
                                    PembelianTransaksiModal.data.length
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Subtotal Pembelian
                            </span>

                            <strong>
                                ${PembelianTransaksiModal.money(
                                    PembelianTransaksiModal.getSubtotal()
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
                                ${PembelianTransaksiModal.number(
                                    PembelianTransaksiModal.data.length
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
                                        PembelianTransaksiModal.data.length

                                            ?

                                            PembelianTransaksiModal.data
                                                .map(
                                                    (
                                                        transaction,
                                                        index
                                                    ) => `

                                                        <tr
                                                            class="pembelian-transaksi-row"
                                                            data-id="${PembelianTransaksiModal.escape(
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
                                                                    ${PembelianTransaksiModal.escape(
                                                                        transaction.id ||
                                                                        "-"
                                                                    )}
                                                                </strong>

                                                            </td>


                                                            <td>
                                                                ${PembelianTransaksiModal.escape(
                                                                    transaction.supplier ||
                                                                    "-"
                                                                )}
                                                            </td>


                                                            <td>
                                                                ${PembelianTransaksiModal.escape(
                                                                    transaction.invoice ||
                                                                    "-"
                                                                )}
                                                            </td>


                                                            <td
                                                                class="pembelian-transaksi-modal-money"
                                                            >
                                                                ${PembelianTransaksiModal.money(
                                                                    transaction.subtotal
                                                                )}
                                                            </td>


                                                            <td
                                                                class="pembelian-transaksi-modal-money"
                                                            >
                                                                ${PembelianTransaksiModal.money(
                                                                    transaction.disc ??
                                                                    transaction.discount ??
                                                                    0
                                                                )}
                                                            </td>


                                                            <td
                                                                class="pembelian-transaksi-modal-money pembelian-transaksi-modal-total"
                                                            >

                                                                <strong>
                                                                    ${PembelianTransaksiModal.money(
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
                                ${PembelianTransaksiModal.money(
                                    PembelianTransaksiModal.getTotal()
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