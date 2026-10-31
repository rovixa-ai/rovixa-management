/*======================================
HARGA PEMBELIAN BARANG
MOBILE RENDER
======================================*/

const HargaPembelianMobileRender = {

    render() {

        return `

            <div class="harga-pembelian-page">

                <div class="harga-pembelian-header">

                    <div>

                        <h2>
                            Harga Pembelian Barang
                        </h2>

                        <p>
                            Riwayat harga pembelian barang
                        </p>

                    </div>

                </div>


                <div class="harga-pembelian-toolbar">

                    <div class="harga-pembelian-filter-group">

                        <input
                            type="text"
                            id="harga-pembelian-search"
                            class="harga-pembelian-search"
                            placeholder="Cari barang..."
                            autocomplete="off"
                        >

                    </div>

                </div>


                <div class="harga-pembelian-table-wrapper">

                    <table class="harga-pembelian-table">

                        <thead>

                            <tr>

                                <th>
                                    Tanggal
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
                                    Harga
                                </th>

                                <th>
                                    Harga / Satuan
                                </th>

                                <th>
                                    Supplier
                                </th>

                                <th>
                                    Invoice
                                </th>

                            </tr>

                        </thead>

                        <tbody id="harga-pembelian-list">

                        </tbody>

                    </table>

                </div>

            </div>

        `;

    }

};