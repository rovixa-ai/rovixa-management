/*======================================
SATUAN MOBILE RENDER
======================================*/

const SatuanMobileRender = {


    /*======================================
    PAGE RENDER
    ======================================*/

    render() {

        return `

            <div class="satuan-page">


                <div class="satuan-header">

                    <div>

                        <h2>
                            Satuan & Harga Jual
                        </h2>

                        <p>
                            Kelola satuan dan harga barang
                        </p>

                    </div>

                   


                </div>


                <div class="satuan-toolbar">

                    <input
                        class="satuan-search"
                        id="satuan-search"
                        placeholder="Cari barang..."
                    >


                    

                </div>


                <div class="satuan-table-card">

                    <div class="satuan-table-wrap">

                        <table class="satuan-table">

                            <thead>

                                <tr>

                                    <th>
                                        Kode
                                    </th>

                                    <th>
                                        Barang
                                    </th>

                                    <th>
                                        Satuan
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

                                </tr>

                            </thead>


                            <tbody
                                id="satuan-list"
                            >

                                <tr>

                                    <td
                                        colspan="6"
                                        class="satuan-empty"
                                    >

                                        Belum ada data satuan.

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