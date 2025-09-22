/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}"
    ],

    /* Dark mode attivata via classe */
    darkMode: "class",

    /* Disattiviamo Preflight (reset CSS) per non confliggere con gli stili custom */
    corePlugins: {
        preflight: false,
    },

    theme: {
        extend: {
            /* Colori legati alle variabili CSS */
            colors: {
                surface: "rgb(var(--surface-rgb) / <alpha-value>)",
                text: "rgb(var(--text-rgb) / <alpha-value>)",
                accent: "rgb(var(--accent-rgb) / <alpha-value>)",
                hover: "rgb(var(--hover-rgb) / <alpha-value>)",
            },

            /* Famiglie di font */
            fontFamily: {
                heading: "var(--font-heading), ui-sans-serif, system-ui, sans-serif",
                body: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
            },

            /* Spaziatura personalizzata */
            spacing: {
                desktop: "var(--margin-desktop)",
                mobile: "var(--margin-mobile)",
            },

            /* Bordo senza arrotondamenti */
            borderRadius: {
                none: "0px",
            },

            /* Curva di transizione più morbida */
            transitionTimingFunction: {
                soft: "cubic-bezier(.2,.8,.2,1)",
            },
        },
    },

    plugins: [],
}
