const BarangMobileRender = {

    render() {

        return `

            <div class="barang-page">


                <div class="barang-header">

                    <div>

                        <h2>
                            Data Barang
                        </h2>

                        <p>
                            Kelola master barang toko
                        </p>

                    </div>


                   

                </div>


                <div class="barang-toolbar">

                    <input
                        type="text"
                        class="barang-search"
                        id="barang-search"
                        placeholder="Cari kode, barcode, atau nama barang..."
                    >

                </div>


                <div class="barang-table-card">

                    <div class="barang-table-wrap">

                        <table class="barang-table">

                            <thead>

                                <tr>

                                    <th>
                                        Kode
                                    </th>

                                    <th>
                                        Barcode
                                    </th>

                                    <th>
                                        Nama Barang
                                    </th>

                                    <th>
                                        Kategori
                                    </th>

                                    <th>
                                        Satuan Dasar
                                    </th>

                                    <th>
                                        Stok
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody
                                id="barang-list"
                            >

                                <tr>

                                    <td
                                        colspan="7"
                                        class="barang-empty"
                                    >

                                        Memuat data barang...

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>


            </div>

        `;

    }

};