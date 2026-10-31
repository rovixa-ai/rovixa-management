const StoreConfigEvent = {

logoEventsBound: false,

event() {

    const saveButton =
        document.getElementById(
            "storeConfigSave"
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            () => StoreConfig.save()
        );

    }


    const nameInput =
        document.getElementById(
            "storeConfigName"
        );


    if (nameInput) {

        nameInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    StoreConfig.save();

                }

            }
        );

    }


    // ======================================
    // LOGO EVENTS
    // Mendukung elemen yang dirender dinamis
    // ======================================

    if (!this.logoEventsBound) {

        document.addEventListener(
            "change",
            event => {

                const target =
                    event.target;


                if (
                    target.matches(
                        "#storeConfigLogoSource"
                    )
                ) {

                    StoreConfig.logoSourceChanged();

                }


                if (
                    target.matches(
                        "#storeConfigLogoFile"
                    )
                ) {

                    StoreConfig.logoFileChanged(
                        event
                    );

                }

            }
        );


        document.addEventListener(
            "input",
            event => {

                const target =
                    event.target;


                if (
                    target.matches(
                        "#storeConfigLogoDrive, #storeConfigLogoUrl"
                    )
                ) {

                    StoreConfig.logoSourceChanged();

                }

            }
        );


        this.logoEventsBound = true;

    }


    StoreConfig.initAccordion();

}

};