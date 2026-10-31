// ======================================
// STORE CONFIG ACCORDION
// TREEHOUSE MANAGEMENT
// ======================================

const StoreConfigAccordion = {

    initAccordion() {

        const sections =
            document.querySelectorAll(
                ".config-section"
            );

        sections.forEach(section => {

            const toggle =
                section.querySelector(
                    "[data-config-toggle]"
                );

            if (!toggle) {
                return;
            }

            toggle.addEventListener(
                "click",
                () => {

                    StoreConfigAccordion.toggleAccordion(
                        section,
                        sections
                    );

                }
            );

        });

    },


    toggleAccordion(section, sections) {

        const isOpen =
            section.classList.contains(
                "is-open"
            );

        sections.forEach(item => {

            item.classList.remove(
                "is-open"
            );

            const toggle =
                item.querySelector(
                    "[data-config-toggle]"
                );

            if (toggle) {
                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });


        if (!isOpen) {

            section.classList.add(
                "is-open"
            );

            const toggle =
                section.querySelector(
                    "[data-config-toggle]"
                );

            if (toggle) {
                toggle.setAttribute(
                    "aria-expanded",
                    "true"
                );
            }

        }

    }

};