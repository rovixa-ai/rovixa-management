/*======================================
HARGA PEMBELIAN BARANG
RENDER
======================================*/

const HargaPembelianRender = {

    /*======================================
    RENDER PAGE
    ======================================*/

    render() {

        const isMobile =
            window.innerWidth <= 768;


        if (isMobile) {

            if (
                typeof HargaPembelianMobileRender !==
                "undefined"
            ) {

                return HargaPembelianMobileRender.render();

            }

            return "";

        }


        if (
            typeof HargaPembelianDesktopRender !==
            "undefined"
        ) {

            return HargaPembelianDesktopRender.render();

        }


        return "";

    },


    /*======================================
    RENDER LIST
    ======================================*/

    renderList(
        data = []
    ) {

        const tbody =
            document.getElementById(
                "harga-pembelian-list"
            );


        if (!tbody) {

            return;

        }


        if (
            !Array.isArray(data) ||
            !data.length
        ) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="9"
                        class="harga-pembelian-empty"
                    >
                        Tidak ada riwayat pembelian.
                    </td>

                </tr>

            `;

            return;

        }


        const sortedData =
            [...data].sort(
                (
                    a,
                    b
                ) => {

                    const dateA =
                        new Date(
                            a.tanggal
                        );


                    const dateB =
                        new Date(
                            b.tanggal
                        );


                    return (
                        dateB -
                        dateA
                    );

                }
            );


        tbody.innerHTML =
            sortedData
                .map(
                    item => `

                        <tr>

                            <td>
                                ${HargaPembelian.date(
                                    item.tanggal
                                )}
                            </td>


                            <td>
                                ${this.escape(
                                    item.kode
                                )}
                            </td>


                            <td>
                                ${this.escape(
                                    item.nama
                                )}
                            </td>


                            <td>
                                ${this.escape(
                                    item.satuan
                                )}
                            </td>


                            <td>
                                ${HargaPembelian.number(
                                    item.qty
                                )}
                            </td>


                            <td>
                                ${HargaPembelian.formatRupiah(
                                    item.harga
                                )}
                            </td>


                            <td>
                                ${
                                    Number(
                                        item.hargaSatuan
                                    ) > 0

                                        ? HargaPembelian.formatRupiah(
                                            item.hargaSatuan
                                        )

                                        : "-"
                                }
                            </td>


                            <td>
                                ${this.escape(
                                    item.supplier ||
                                    "-"
                                )}
                            </td>


                            <td>
                                ${this.escape(
                                    item.invoice ||
                                    "-"
                                )}
                            </td>

                        </tr>

                    `
                )
                .join("");

    },


    /*======================================
    ESCAPE
    ======================================*/

    escape(
        value
    ) {

        return String(
            value ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }

};