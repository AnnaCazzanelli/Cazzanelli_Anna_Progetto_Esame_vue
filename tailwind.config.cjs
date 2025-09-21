/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    darkMode: "class",
    corePlugins: {
        preflight: false, // ⟵ disattiva il reset che “sminchia”
    },
    theme: {
        extend: {
            colors: {
                surface: "rgb(var(--surface-rgb) / <alpha-value>)",
                text: "rgb(var(--text-rgb) / <alpha-value>)",
                accent: "rgb(var(--accent-rgb) / <alpha-value>)",
                hover: "rgb(var(--hover-rgb) / <alpha-value>)",
            },
            fontFamily: {
                heading: "var(--font-heading), ui-sans-serif, system-ui, sans-serif",
                body: "var(--font-body), ui-sans-serif, system-ui, sans-serif",
            },
            spacing: {
                desktop: "var(--margin-desktop)",
                mobile: "var(--margin-mobile)",
            },
            borderRadius: { none: "0px" },
            transitionTimingFunction: { soft: "cubic-bezier(.2,.8,.2,1)" },
        },
    },
    plugins: [],
}
