const PembelianDetailModalMobileRender = {

    render() {

        return `

            <div
                class="pembelian-detail-modal-overlay"
                data-action="close"
            ></div>


            <div
                class="pembelian-detail-modal-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="pembelianDetailModalTitle"
            >

                <div
                    class="pembelian-detail-modal-header"
                >

                    <div>

                        

                        <h3
                            id="pembelianDetailModalTitle"
                        >
                            Detail Pembelian
                        </h3>

                        <p>
                            ${PembelianDetailModal.escape(
                                PembelianDetailModal.data.id || "-"
                            )}
                        </p>

                    </div>


                    <button
                        type="button"
                        class="pembelian-detail-modal-close"
                        data-action="close"
                        aria-label="Tutup"
                    >
                        ×
                    </button>

                </div>


                <div
                    class="pembelian-detail-modal-info"
                >

                    <div>

                        <span>
                            ID Pembelian
                        </span>

                        <strong>
                            ${PembelianDetailModal.escape(
                                PembelianDetailModal.data.id || "-"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Tanggal
                        </span>

                        <strong>
                            ${PembelianDetailModal.date(
                                PembelianDetailModal.data.tanggal
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Supplier
                        </span>

                        <strong>
                            ${PembelianDetailModal.escape(
                                PembelianDetailModal.data.supplier || "-"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Invoice
                        </span>

                        <strong>
                            ${PembelianDetailModal.escape(
                                PembelianDetailModal.data.invoice || "-"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Status
                        </span>

                        <strong>
                            ${PembelianDetailModal.escape(
                                PembelianDetailModal.data.status || "-"
                            )}
                        </strong>

                    </div>

                </div>


                <div
                    class="pembelian-detail-modal-section"
                >

                    <div
                        class="pembelian-detail-modal-section-header"
                    >

                        <div>

                            <div
                                class="pembelian-detail-modal-section-title"
                            >
                                Detail Barang
                            </div>

                            <div
                                class="pembelian-detail-modal-section-subtitle"
                            >
                                Daftar barang dalam transaksi
                            </div>

                        </div>


                        <div
                            class="pembelian-detail-modal-item-count"
                        >
                            ${PembelianDetailModal.number(
                                PembelianDetailModal.items.length
                            )}
                            Item
                        </div>

                    </div>


                    <div
                        class="pembelian-detail-modal-table-wrapper"
                    >

                        <table
                            class="pembelian-detail-modal-table"
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
                                        Harga
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
                                    PembelianDetailModal.items.length

                                        ?

                                        PembelianDetailModal.items
                                            .map(
                                                (
                                                    item,
                                                    index
                                                ) => `

                                                    <tr>

                                                        <td>
                                                            ${
                                                                index +
                                                                1
                                                            }
                                                        </td>


                                                        <td>
                                                            ${PembelianDetailModal.escape(
                                                                item.kode ||
                                                                "-"
                                                            )}
                                                        </td>


                                                        <td>

                                                            <span
                                                                class="
                                                                    pembelian-detail-modal-item-name
                                                                "
                                                            >
                                                                ${PembelianDetailModal.escape(
                                                                    item.nama ||
                                                                    "-"
                                                                )}
                                                            </span>

                                                        </td>


                                                        <td>
                                                            ${PembelianDetailModal.escape(
                                                                item.satuan ||
                                                                "-"
                                                            )}
                                                        </td>


                                                        <td
                                                            class="
                                                                pembelian-detail-modal-number
                                                            "
                                                        >
                                                            ${PembelianDetailModal.number(
                                                                item.qty
                                                            )}
                                                        </td>


                                                        <td
                                                            class="
                                                                pembelian-detail-modal-number
                                                            "
                                                        >
                                                            ${PembelianDetailModal.number(
                                                                item.isi
                                                            )}
                                                        </td>


                                                        <td
                                                            class="
                                                                pembelian-detail-modal-money
                                                            "
                                                        >
                                                            ${PembelianDetailModal.money(
                                                                item.harga
                                                            )}
                                                        </td>


                                                        <td
                                                            class="
                                                                pembelian-detail-modal-money
                                                            "
                                                        >
                                                            ${PembelianDetailModal.money(
                                                                item.disc
                                                            )}
                                                        </td>


                                                        <td
                                                            class="
                                                                pembelian-detail-modal-money
                                                            "
                                                        >

                                                            <strong>
                                                                ${PembelianDetailModal.money(
                                                                    item.total
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
                                                    colspan="9"
                                                    class="
                                                        pembelian-detail-modal-empty
                                                    "
                                                >
                                                    Tidak ada detail barang.
                                                </td>

                                            </tr>

                                        `
                                }

                            </tbody>

                        </table>

                    </div>

                </div>


                <div
                    class="pembelian-detail-modal-total"
                >

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${PembelianDetailModal.money(
                                PembelianDetailModal.data.subtotal
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Discount
                        </span>

                        <strong>
                            ${PembelianDetailModal.money(
                                PembelianDetailModal.data.disc ??
                                PembelianDetailModal.data.discount ??
                                0
                            )}
                        </strong>

                    </div>


                    <div
                        class="
                            pembelian-detail-modal-total-main
                        "
                    >

                        <span>
                            Total Pembelian
                        </span>

                        <strong>
                            ${PembelianDetailModal.money(
                                PembelianDetailModal.data.total
                            )}
                        </strong>

                    </div>

                </div>


                <div
                    class="
                        pembelian-detail-modal-section
                        pembelian-detail-modal-payment-section
                    "
                >

                    <div
                        class="pembelian-detail-modal-section-header"
                    >

                        <div>

                            <div
                                class="pembelian-detail-modal-section-title"
                            >
                                Pembayaran
                            </div>

                            <div
                                class="pembelian-detail-modal-section-subtitle"
                            >
                                Riwayat pembayaran transaksi
                            </div>

                        </div>


                        <div
                            class="pembelian-detail-modal-payment-count"
                        >
                            ${PembelianDetailModal.number(
                                PembelianDetailModal.payments.length
                            )}
                            Pembayaran
                        </div>

                    </div>


                    <div
                        class="pembelian-detail-modal-table-wrapper"
                    >

                        <table
                            class="pembelian-detail-modal-table"
                        >

                            <thead>

                                <tr>

                                    <th>
                                        No
                                    </th>

                                    <th>
                                        Metode
                                    </th>

                                    <th>
                                        Nominal
                                    </th>

                                    <th>
                                        Kembalian
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${
                                    PembelianDetailModal.payments.length

                                        ?

                                        PembelianDetailModal.payments
                                            .map(
                                                (
                                                    payment,
                                                    index
                                                ) => `

                                                    <tr>

                                                        <td>
                                                            ${
                                                                index +
                                                                1
                                                            }
                                                        </td>


                                                        <td>
                                                            ${PembelianDetailModal.escape(
                                                                payment.metode ||
                                                                "-"
                                                            )}
                                                        </td>


                                                        <td
                                                            class="
                                                                pembelian-detail-modal-money
                                                            "
                                                        >
                                                            ${PembelianDetailModal.money(
                                                                payment.nominal
                                                            )}
                                                        </td>


                                                        <td
                                                            class="
                                                                pembelian-detail-modal-money
                                                            "
                                                        >
                                                            ${PembelianDetailModal.money(
                                                                payment.kembalian
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
                                                    colspan="4"
                                                    class="
                                                        pembelian-detail-modal-empty
                                                    "
                                                >
                                                    Tidak ada pembayaran.
                                                </td>

                                            </tr>

                                        `
                                }

                            </tbody>

                        </table>

                    </div>

                </div>


                <div
                    class="pembelian-detail-modal-footer"
                >

                    <div
                        class="pembelian-detail-modal-footer-total"
                    >

                        <span>
                            Total Pembelian
                        </span>

                        <strong>
                            ${PembelianDetailModal.money(
                                PembelianDetailModal.data.total
                            )}
                        </strong>

                    </div>


                    <button
                        type="button"
                        class="pembelian-detail-modal-footer-button"
                        data-action="close"
                    >
                        Tutup
                    </button>

                </div>

            </div>

        `;

    }

};