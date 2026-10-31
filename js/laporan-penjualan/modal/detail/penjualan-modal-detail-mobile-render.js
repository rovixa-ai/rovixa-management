const LaporanPenjualanDetailModalMobileRender = {

    render(row, items, payments) {

        const modal =
            LaporanPenjualan;


        const dataItems =
            Array.isArray(items)
                ? items
                : [];


        const dataPayments =
            Array.isArray(payments)
                ? payments
                : [];


        return `

            <div
                class="laporan-penjualan-detail-overlay"
                data-action="close-detail"
            ></div>


            <div
                class="laporan-penjualan-detail-dialog ${
                    String(row.status || "").trim().toUpperCase() === "RETUR"
                        ? "modal-retur"
                        : ""
                }"
            >


                <!-- HEADER -->

                <div
                    class="laporan-penjualan-detail-header"
                >

                    <div>

                        <h3>
                            Detail Penjualan
                        </h3>

                        <p>
                            ${modal.escape(
                                row.id || "-"
                            )}
                        </p>

                    </div>


                    <button
                        type="button"
                        class="laporan-penjualan-detail-close"
                        data-action="close-detail"
                    >
                        ×
                    </button>

                </div>


                <!-- INFO -->

                <div
                    class="laporan-penjualan-detail-info"
                >

                    <div>

                        <span>
                            ID Penjualan
                        </span>

                        <strong>
                            ${modal.escape(
                                row.id || "-"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Tanggal
                        </span>

                        <strong>
                            ${modal.date(
                                row.tanggal
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Kasir
                        </span>

                        <strong>
                            ${modal.escape(
                                row.kasir || "-"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Status
                        </span>

                        <strong class="${
                            String(row.status || "")
                                .trim()
                                .toUpperCase() === "RETUR"
                                    ? "status-retur"
                                    : "status-normal"
                        }">
                            ${modal.escape(
                                row.status || "-"
                            )}
                        </strong>

                    </div>

                </div>


                <!-- ITEMS -->

                <div
                    class="laporan-penjualan-detail-section"
                >

                    <div
                        class="laporan-penjualan-detail-section-title"
                    >
                        Detail Barang
                    </div>


                    <div
                        class="laporan-penjualan-detail-table-wrapper"
                    >

                        <table
                            class="laporan-penjualan-detail-table"
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
                                        Subtotal
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                ${
                                    dataItems.length

                                        ? dataItems
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
                                                            ${modal.escape(
                                                                item.kode ||
                                                                "-"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${modal.escape(
                                                                item.namaBarang ||
                                                                item.nama ||
                                                                "-"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${modal.escape(
                                                                item.satuan ||
                                                                "-"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${modal.number(
                                                                item.qty
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${modal.number(
                                                                item.konversi
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${modal.money(
                                                                item.harga
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${modal.money(
                                                                item.disc ??
                                                                item.discount ??
                                                                0
                                                            )}
                                                        </td>

                                                        <td>

                                                            <strong>
                                                                ${modal.money(
                                                                    item.subtotal ??
                                                                    item.total
                                                                )}
                                                            </strong>

                                                        </td>

                                                    </tr>

                                                `
                                            )
                                            .join("")

                                        : `

                                            <tr>

                                                <td
                                                    colspan="9"
                                                    class="laporan-penjualan-detail-empty"
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


                <!-- TOTAL -->

                <div
                    class="laporan-penjualan-detail-total"
                >

                    <div>

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${modal.money(
                                row.subtotal
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Discount
                        </span>

                        <strong>
                            ${modal.money(
                                row.disc ??
                                row.discount ??
                                0
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Total
                        </span>

                        <strong>
                            ${modal.money(
                                row.total
                            )}
                        </strong>

                    </div>

                </div>


                <!-- PAYMENT -->

                <div
                    class="laporan-penjualan-detail-section"
                >

                    <div
                        class="laporan-penjualan-detail-section-title"
                    >
                        Pembayaran
                    </div>


                    <div
                        class="laporan-penjualan-detail-table-wrapper"
                    >

                        <table
                            class="laporan-penjualan-detail-table"
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
                                    dataPayments.length

                                        ? dataPayments
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
                                                            ${modal.escape(
                                                                payment.metode ||
                                                                payment.method ||
                                                                "-"
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${modal.money(
                                                                payment.nominal
                                                            )}
                                                        </td>

                                                        <td>
                                                            ${modal.money(
                                                                payment.kembalian ??
                                                                payment.change ??
                                                                0
                                                            )}
                                                        </td>

                                                    </tr>

                                                `
                                            )
                                            .join("")

                                        : `

                                            <tr>

                                                <td
                                                    colspan="4"
                                                    class="laporan-penjualan-detail-empty"
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


                <!-- FOOTER -->

                <div
                    class="laporan-penjualan-detail-footer"
                >

                    <button
                        type="button"
                        data-action="close-detail"
                    >
                        Tutup
                    </button>

                </div>


            </div>

        `;

    }

};