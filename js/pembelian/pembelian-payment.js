const PembelianPayment = {

    /* ======================================
       TAMBAH PAYMENT
       ====================================== */

    addPayment() {

        Pembelian.payments.push({

            metode: "Cash",

            nominal: 0

        });


        this.renderPayments();

    },


    /* ======================================
       RENDER PAYMENT
       ====================================== */

    renderPayments() {

        const tbody =
            document.getElementById(
                "pembelian-payments"
            );


        if (!tbody) {

            return;

        }


        tbody.innerHTML =
            Pembelian.payments
                .map(
                    (
                        payment,
                        index
                    ) => `

                        <tr>


                            <td>

                                <select
                                    data-payment-field="metode"
                                    data-payment-index="${index}"
                                >

                                    <option
                                        value="Cash"
                                        ${
                                            payment.metode === "Cash"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Cash
                                    </option>


                                    <option
                                        value="Transfer"
                                        ${
                                            payment.metode === "Transfer"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Transfer
                                    </option>


                                    <option
                                        value="QRIS"
                                        ${
                                            payment.metode === "QRIS"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        QRIS
                                    </option>


                                    <option
                                        value="Kartu"
                                        ${
                                            payment.metode === "Kartu"
                                                ? "selected"
                                                : ""
                                        }
                                    >
                                        Kartu
                                    </option>

                                </select>

                            </td>


                            <td>

                                <input
                                    type="number"
                                    min="0"
                                    value="${payment.nominal}"
                                    data-payment-field="nominal"
                                    data-payment-index="${index}"
                                >

                            </td>


                            <td>

                                <button
                                    type="button"
                                    class="pembelian-payment-remove"
                                    data-payment-remove="${index}"
                                >
                                    ×
                                </button>

                            </td>


                        </tr>

                    `
                )
                .join("");


        this.bindPayments();


        this.updatePaymentSummary();

    },


    /* ======================================
       EVENT PAYMENT
       ====================================== */

    bindPayments() {

        document
            .querySelectorAll(
                "[data-payment-field]"
            )
            .forEach(
                input => {


                    /* ==========================
                       INPUT
                       ========================== */

                    input.addEventListener(
                        "input",
                        event => {

                            const index =
                                Number(
                                    event.target
                                        .dataset
                                        .paymentIndex
                                );


                            const field =
                                event.target
                                    .dataset
                                    .paymentField;


                            let value =
                                event.target.value;


                            if (
                                field === "nominal"
                            ) {

                                value =
                                    Number(
                                        value
                                    ) || 0;

                            }


                            Pembelian.payments[index][field] =
                                value;


                            this.updatePaymentSummary();

                        }
                    );


                    /* ==========================
                       CHANGE
                       ========================== */

                    input.addEventListener(
                        "change",
                        event => {

                            const index =
                                Number(
                                    event.target
                                        .dataset
                                        .paymentIndex
                                );


                            const field =
                                event.target
                                    .dataset
                                    .paymentField;


                            let value =
                                event.target.value;


                            if (
                                field === "nominal"
                            ) {

                                value =
                                    Number(
                                        value
                                    ) || 0;

                            }


                            Pembelian.payments[index][field] =
                                value;


                            this.updatePaymentSummary();

                        }
                    );

                }
            );


        /* ==================================
           HAPUS PAYMENT
           ================================== */

        document
            .querySelectorAll(
                "[data-payment-remove]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const index =
                                Number(
                                    button.dataset
                                        .paymentRemove
                                );


                            Pembelian.payments.splice(
                                index,
                                1
                            );


                            this.renderPayments();

                        }
                    );

                }
            );

    },


    /* ======================================
       TOTAL DIBAYAR
       ====================================== */

    getDibayar() {

        return Pembelian.payments.reduce(
            (
                sum,
                payment
            ) => {

                return sum +
                    Number(
                        payment.nominal || 0
                    );

            },
            0
        );

    },


    /* ======================================
       PAYMENT SUMMARY
       ====================================== */

    updatePaymentSummary() {

        const total =
            typeof PembelianItem !== "undefined"
                ? PembelianItem.getTotal()
                : 0;


        const dibayar =
            this.getDibayar();


        const sisa =
            total -
            dibayar;


        const totalElement =
            document.getElementById(
                "pembayaran-total"
            );


        const dibayarElement =
            document.getElementById(
                "pembayaran-dibayar"
            );


        const sisaElement =
            document.getElementById(
                "pembayaran-sisa"
            );


        if (totalElement) {

            totalElement.textContent =
                Pembelian.formatRupiah(
                    total
                );

        }


        if (dibayarElement) {

            dibayarElement.textContent =
                Pembelian.formatRupiah(
                    dibayar
                );

        }


        if (sisaElement) {

            sisaElement.textContent =
                Pembelian.formatRupiah(
                    sisa
                );

        }

    }

};