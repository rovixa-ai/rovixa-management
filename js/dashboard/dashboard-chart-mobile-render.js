const DashboardChartMobileRender = {

    render() {

        return `

            <div class="dashboard-chart-mobile-content">

                <div class="dashboard-chart-header">

                    <div>

                        <h3>
                            Omset Penjualan
                        </h3>

                        <p>
                            Omset penjualan per hari
                        </p>

                    </div>

                </div>


                <div
                    class="dashboard-chart-body"
                    id="dashboard-mobile-chart-1-content"
                >
                </div>

            </div>


            <div class="dashboard-chart-mobile-content">

                <div class="dashboard-chart-header">

                    <div>

                        <h3>
                            Jumlah Transaksi
                        </h3>

                        <p>
                            Jumlah transaksi per hari
                        </p>

                    </div>

                </div>


                <div
                    class="dashboard-chart-body"
                    id="dashboard-mobile-chart-2-content"
                >
                </div>

            </div>

        `;

    },


    async load() {

        const omset =
            await Dashboard.loadChartOmsetHarian();

        const transaksi =
            await Dashboard.loadChartTransaksiHarian();


        this.renderOmset(
            omset
        );

        this.renderTransaksi(
            transaksi
        );

    },


    renderOmset(data) {

        const container =
            document.getElementById(
                "dashboard-mobile-chart-1-content"
            );

        if (!container) {
            return;
        }


        if (!Array.isArray(data)) {
            return;
        }


        const maxOmset =
            Math.max(
                ...data.map(
                    item =>
                        Number(
                            item.omset
                        ) || 0
                ),
                0
            );


        const points =
            data.map(
                (item, index) => {

                    const omset =
                        Number(
                            item.omset
                        ) || 0;


                    const x =
                        data.length > 1
                            ? (
                                index /
                                (
                                    data.length - 1
                                )
                            ) * 100
                            : 50;


                    const y =
                        maxOmset > 0
                            ? 100 -
                                (
                                    omset /
                                    maxOmset
                                ) * 100
                            : 100;


                    return {
                        x,
                        y,
                        tanggal:
                            item.tanggal,
                        omset
                    };

                }
            );


        const line =
            points
                .map(
                    point =>
                        `${point.x},${point.y}`
                )
                .join(" ");


        const area =
            points.length
                ? `${line} 100,100 0,100`
                : "0,100 100,100";


        container.innerHTML = `

            <div class="dashboard-chart-mobile-line">

                <div class="dashboard-chart-mobile-y-axis">

                    <span>
                        Rp ${maxOmset.toLocaleString("id-ID")}
                    </span>

                    <span>
                        Rp ${Math.round(
                            maxOmset * 0.50
                        ).toLocaleString("id-ID")}
                    </span>

                    <span>
                        Rp 0
                    </span>

                </div>


                <div class="dashboard-chart-mobile-graph">

                    <div class="dashboard-chart-mobile-grid">

                        <span></span>
                        <span></span>
                        <span></span>

                    </div>


                    <svg
                        class="dashboard-chart-mobile-svg"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >

                        <polygon
                            class="dashboard-chart-mobile-area"
                            points="${area}"
                        />

                        <polyline
                            class="dashboard-chart-mobile-line-path"
                            points="${line}"
                        />

                    </svg>


                    <div class="dashboard-chart-mobile-points">

                        ${points.map(
                            point => `

                                <div
                                    class="dashboard-chart-mobile-point"
                                    style="
                                        left: ${point.x}%;
                                        top: ${point.y}%;
                                    "
                                    title="Tanggal ${point.tanggal}: Rp ${point.omset.toLocaleString("id-ID")}"
                                >
                                </div>

                            `
                        ).join("")}


                        <div class="dashboard-chart-mobile-dates">

                            ${data.map(
                                (item, index) => {

                                    if (
                                        index !== 0 &&
                                        index !==
                                            data.length - 1 &&
                                        index %
                                            5 !==
                                            0
                                    ) {
                                        return "";
                                    }


                                    const x =
                                        data.length > 1
                                            ? (
                                                index /
                                                (
                                                    data.length - 1
                                                )
                                            ) * 100
                                            : 50;


                                    return `

                                        <span
                                            style="left: ${x}%"
                                        >
                                            ${item.tanggal}
                                        </span>

                                    `;

                                }
                            ).join("")}

                        </div>

                    </div>

                </div>

            </div>

        `;

    },


    renderTransaksi(data) {

        const container =
            document.getElementById(
                "dashboard-mobile-chart-2-content"
            );

        if (!container) {
            return;
        }


        if (!Array.isArray(data)) {
            return;
        }


        const maxTransaksi =
            Math.max(
                ...data.map(
                    item =>
                        Number(
                            item.transaksi
                        ) || 0
                ),
                0
            );


        const barData =
            data.map(
                item => {

                    return {
                        tanggal:
                            item.tanggal,

                        transaksi:
                            Number(
                                item.transaksi
                            ) || 0

                    };

                }
            );


        const chartMax =
            maxTransaksi > 0
                ? maxTransaksi
                : 1;


        const yAxisMid =
            Math.round(
                chartMax * 0.50
            );


        container.innerHTML = `

            <div class="dashboard-chart-mobile-bars">

                <div class="dashboard-chart-mobile-bar-y-axis">

                    <span>
                        ${maxTransaksi.toLocaleString("id-ID")}
                    </span>

                    <span>
                        ${yAxisMid.toLocaleString("id-ID")}
                    </span>

                    <span>
                        0
                    </span>

                </div>


                <div class="dashboard-chart-mobile-bar-graph">

                    <div class="dashboard-chart-mobile-bar-grid">

                        <span></span>
                        <span></span>
                        <span></span>

                    </div>


                    <div class="dashboard-chart-mobile-bar-area">

                        ${barData.map(
                            item => {

                                const height =
                                    (
                                        item.transaksi /
                                        chartMax
                                    ) * 100;


                                return `

                                    <div
                                        class="dashboard-chart-mobile-bar-item"
                                        title="Tanggal ${item.tanggal}: ${item.transaksi.toLocaleString("id-ID")} transaksi"
                                    >

                                        <div
                                            class="dashboard-chart-mobile-bar"
                                            style="
                                                height: ${height}%;
                                            "
                                        >
                                        </div>


                                        <span
                                            class="dashboard-chart-mobile-bar-date"
                                        >
                                            ${item.tanggal}
                                        </span>

                                    </div>

                                `;

                            }
                        ).join("")}

                    </div>

                </div>

            </div>

        `;

    }

};