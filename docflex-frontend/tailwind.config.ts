import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',

		// Or if using `src` directory:
		'./src/**/*.{js,ts,jsx,tsx,mdx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			fontFamily: {
				roboto: ["Roboto", "sans-serif"],
				sans: ["Inter", "sans-serif"],
				inter: ["Inter-Regular", "sans-serif"],
				interSemibold: ["Inter-Semibold", "sans-serif"],
				interBold: ["Inter-Bold", "sans-serif"],
			},
			animation: {
				'fade-in': 'fadeIn 0.5s ease-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
			},
			spacing: {
				128: "32rem",
				144: "36rem",
				15.625: "15.625rem",
				"240x": "240px",
				400: "400px",
				18: "18rem",
				"100x": "100px",
			},
			borderRadius: {
				"4xl": "2rem",
				"custom": '0.65375rem',
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			screens: {
				xsm: "480px",
				sm: "640px",
				md: "768px",
				lg: "976px",
				xl: "1280px",
				xxl: "1536px"
			},
			scrollbar: {
				thin: "scrollbar-width: thin;",
				thumb: "background-color: #70bbea; border-radius: 10px;",
				track: "background-color: #ebf8ff;",
			},
			colors: {
				// background: "var(--background)",
				// foreground: "var(--foreground)",
				// border: "hsl(0, 0%, 89.8%)",
				transparent: "transparent",
				white: "#ffffff",
				black: "#000000",
				gray_bold: "#1E1E1E",
				gray_light: "#6A6A6A",
				gray_bold_light: "#6B7280",
				gray_medium: "#D9D9D9",
				gray_medium_light: "#999999",
				primary_bold: "#B91434",
				primary_medium: "#D11648",
				primary_light: "#C3375F",
				background_color: "#F7F7F7",
				black_light: "#1E1E1E",
				gray_dark: "#222222",
				grad_light: "#8D9093",
				gray_normal: "#414045",
				green_light: "#2F7131",
				blue_light: "#23A3DA",
				blue_light_10: "#DDF4FD",
				blue_light_20: "#23A3DA",
				blue_light_hover: "#A3B7FF",
				blue_dark: '#113962',
				blue_dark_2: '#0D6ACA',
				blue_dark_hover_1: '#154270',
				blue_dark_hover_2: '#0E56A0',
				scroll_blue: '#2d5ba0',
				red_bold: "#EB001B", // Custom red
				red_light: "#FF3B30", // Lighter red
				green_bold: "#34D399", // Custom green
				blue_bold: "#1E3A8A", // Custom blue
				yellow_bold: "#F59E0B", // Custom yellow
			},
			dropShadow: {
				'3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
				'4xl': [
					'0 35px 35px rgba(0, 0, 0, 0.25)',
					'0 45px 65px rgba(0, 0, 0, 0.15)',
				],
			},
			fontSize: {
				"display-2xl": ["4.5rem", { lineHeight: "90px" }],
				"display-xl": ["3.75rem", { lineHeight: "72px" }],
				"display-lg": ["3rem", { lineHeight: "60px" }],
				"display-md": ["2.25rem", { lineHeight: "44px" }],
				"display-sm": ["1.875rem", { lineHeight: "38px" }],
				"display-xs": ["1.5rem", { lineHeight: "32px" }],
				xl: ["1.25rem", { lineHeight: "30px" }],
				lg: ["1.125rem", { lineHeight: "28px" }],
				md: ["1rem", { lineHeight: "24px" }],
				sm: ["0.875rem", { lineHeight: "20px" }],
				"1xs": ["0.75rem", { lineHeight: "18px" }],
				"2xs": ["0.625rem", { lineHeight: "15px" }],
				"3xs": ["0.5rem", { lineHeight: "10px" }],
			},
		},
	},
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require("tailwindcss-animate")],
};

export default config;
