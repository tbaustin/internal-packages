

export const colors = {
	primary: `#fff`,
	secondary: `lightgrey`,
	brand: `#c8202e`,
	textLight: `aliceblue`,
	textMedium: `#999`,
	textDark: `#333`,
	lightGrey: `#e8e7e7`,
	navLight: `#fff`,
	navMedium: `#1b1b1b`,
	navDark: `black`,
	blackRGB: `0, 0, 0`,
	red: `#c8202e`,
	white: `#fff`,
}


export const shadows = {
	low: `0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)`,
	high: `0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)`
}


export const sizes = {
	alertBarHeight: `40px`,
	navHeight: `6rem`,
	breadcrumbsHeight: `3.5rem`,
	constrainWidth: `1400px`
}


export const screenWidths = {
	desktopLarge: `2560px`,         // 2560x1440 (1440p screen)
	desktop: `1366px`,              // 1366x768 (average 16:9 screen)
	laptop: `1024px`,								//
	tablet: `768px`,                // 768x1024 (iPad)
	phoneLarge: `411px`,             // 411x731 (Pixel 2)
	// No 'phone' size; see below
}


/**
 * Actual breakpoints to go in media query parentheses
 *
 * No 'phone' breakpoint; for mobile-first design purposes, lack of a
 * breakpoint/media query is assumed to mean regular phone screen width from
 * 360px through 410px
 */
export const breakpoints = {
	desktopLarge: `min-width: ${screenWidths.desktopLarge}`,
	desktop: `min-width: ${screenWidths.desktop}`,
	laptop: `min-width: ${screenWidths.laptop}`,
	tablet: `min-width: ${screenWidths.tablet}`,
	phoneLarge: `min-width: ${screenWidths.phoneLarge}`,
	phoneSmall: `max-width: 359px`, // smaller than 360x740 (Galaxy S8)
	// ^ needed in some special cases
}
