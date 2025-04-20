/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  	extend: {
  		colors: {
  			'ds-primary': {
  				'100': '#DBEAFE',
  				'200': '#BFDBFE',
  				'300': '#93C5FD',
  				'400': '#60A5FA',
  				'500': '#428AFF',
  				'600': '#256AEB',
  				'700': '#1D52D8',
  				'800': '#1B399D',
  				'900': '#112573'
  			},
  			'ds-secondary': {
  				'100': '#FFE1F2',
  				'200': '#FFD1E8',
  				'300': '#FFB3D7',
  				'400': '#FF83C7',
  				'500': '#FF66BC',
  				'600': '#FF50B4',
  				'700': '#FF21A0',
  				'800': '#E50083',
  				'900': '#990058'
  			},
  			'ds-accent1': {
  				'100': '#FDD7D7',
  				'200': '#F9BCBC',
  				'300': '#F69999',
  				'400': '#FF6666',
  				'500': '#FF2727',
  				'600': '#E22222',
  				'700': '#CD1F1F',
  				'800': '#A31F1F',
  				'900': '#70201B'
  			},
  			'ds-accent2': {
  				'100': '#FFF6DB',
  				'200': '#FFEFBF',
  				'300': '#FFE599',
  				'400': '#FFDC73',
  				'500': '#FFCB32',
  				'600': '#DFAD16',
  				'700': '#C1981C',
  				'800': '#9C7A15',
  				'900': '#88690B'
  			},
  			'ds-accent3': {
  				'100': '#E2F8EC',
  				'200': '#C2EFD5',
  				'300': '#9DE5BC',
  				'400': '#79DBA3',
  				'500': '#38C173',
  				'600': '#33AA67',
  				'700': '#2E9159',
  				'800': '#287B4C',
  				'900': '#22663F'
  			},
  			'ds-white': '#FFFFFF',
  			'ds-grey': {
  				'100': '#FCFCFC',
  				'200': '#EBEBEB',
  				'300': '#BFBFBF',
  				'400': '#9FA6AC',
  				'500': '#848C95',
  				'600': '#5D666F',
  				'700': '#454C54',
  				'800': '#2D3239',
  				'900': '#212121',
  				disabled: '#F2F2F2'
  			},
  			'ds-black': '#1A1A1A',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		spacing: {
  			'ds-512': '512px',
  			'ds-640': '640px',
  			'ds-768': '768px'
  		},
  		fontFamily: {
  			'ds-primary': [
  				'Source Sans Pro',
  				'Arial',
  				'sans-serif'
  			]
  		},
  		boxShadow: {
  			'ds-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  			'ds-2': '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
  			'ds-3': '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.10)',
  			'ds-4': '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
  			'ds-5': '0 20px 40px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.05)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
