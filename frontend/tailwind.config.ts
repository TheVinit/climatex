import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./index.html",
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
				sans: ["Inter", "sans-serif"],
				mono: ["JetBrains Mono", "monospace"],
				outfit: ["Outfit", "sans-serif"],
				display: ["Outfit", "sans-serif"],
			},
			colors: {
				"bg-base": "#f4f7f4",
				"bg-surface": "#ffffff",
				"bg-panel": "#edf1ed",
				"bg-hover": "#e4e9e4",
				brand: "#4ca61c",
				"brand-dim": "rgba(76,166,28,0.08)",
				"brand-border": "rgba(76,166,28,0.20)",
				"t-primary": "#121812",
				"t-secondary": "#4a554a",
				"t-dim": "#718071",
				bdr: "rgba(0,0,0,0.08)",
				bdr2: "rgba(0,0,0,0.12)",
				"risk-h": "#d32f2f",
				"risk-hbg": "rgba(211,47,47,0.08)",
				"risk-hb": "rgba(211,47,47,0.20)",
				"risk-m": "#f9a825",
				"risk-mbg": "rgba(249,168,37,0.08)",
				"risk-mb": "rgba(249,168,37,0.20)",
				"risk-l": "#2e7d32",
				"risk-lbg": "rgba(46,125,50,0.08)",
				"risk-lb": "rgba(46,125,50,0.20)",
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"fade-in": {
					from: { opacity: "0" },
					to: { opacity: "1" },
				},
				"slide-up": {
					from: { transform: "translateY(20px)", opacity: "0" },
					to: { transform: "translateY(0)", opacity: "1" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
			},
		},
	},
	plugins: [tailwindAnimate],
} satisfies Config;
