/**
 * The flag of the country a project was made in.
 *
 * Drawn inline rather than taken from emoji: Windows renders no flag glyph at
 * all, it falls back to the two regional-indicator letters, so 🇨🇭 would show up
 * as "CH" on a large share of the visitors. All four are geometric, so an SVG
 * costs a handful of rects and stays sharp at any size.
 *
 * Every flag is drawn on the same 24x16 field (3:2). Switzerland is square in
 * reality; like most flag sets, it keeps its cross square and centred inside
 * the shared rectangle so the row of them lines up.
 */

import './Flag.css';

export type CountryCode = 'CH' | 'FR' | 'FI' | 'IT';

const countryNames: Record<CountryCode, string> = {
    CH: 'Switzerland',
    FR: 'France',
    FI: 'Finland',
    IT: 'Italy',
};

const flags: Record<CountryCode, JSX.Element> = {
    // Three equal bands.
    FR: (
        <>
            <rect width="8" height="16" fill="#0055A4" />
            <rect x="8" width="8" height="16" fill="#F7F7F7" />
            <rect x="16" width="8" height="16" fill="#EF4135" />
        </>
    ),
    IT: (
        <>
            <rect width="8" height="16" fill="#008C45" />
            <rect x="8" width="8" height="16" fill="#F7F7F7" />
            <rect x="16" width="8" height="16" fill="#CD212A" />
        </>
    ),
    // Square cross, centred: arms 6/32 wide and 20/32 long on the original.
    CH: (
        <>
            <rect width="24" height="16" fill="#DA291C" />
            <rect x="10.5" y="3" width="3" height="10" fill="#F7F7F7" />
            <rect x="7" y="6.5" width="10" height="3" fill="#F7F7F7" />
        </>
    ),
    // Nordic cross: arms 3/11 of the height, the upright set toward the hoist.
    FI: (
        <>
            <rect width="24" height="16" fill="#F7F7F7" />
            <rect y="5.8" width="24" height="4.4" fill="#002F6C" />
            <rect x="4.5" width="4.4" height="16" fill="#002F6C" />
        </>
    ),
};

/**
 * `title` alone would leave the flag unnamed for a screen reader, so the name
 * is carried by the label and the graphic itself is hidden from the tree.
 *
 * `decorative` drops both, for the places where the country is already spelled
 * out next to the flag: otherwise the name is announced twice in a row.
 */
const Flag = ({
    country,
    className,
    decorative = false,
}: {
    country: CountryCode;
    className?: string;
    decorative?: boolean;
}) => (
    <span
        className={`flag${className ? ` ${className}` : ''}`}
        {...(decorative
            ? { 'aria-hidden': true }
            : { role: 'img', 'aria-label': countryNames[country], title: countryNames[country] })}
    >
        {/* The corners and the ring are CSS on the wrapper: a rounded <rect>
            here would only clip the stroke, not the bands painted under it. */}
        <svg viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            {flags[country]}
        </svg>
    </span>
);

export { countryNames };
export default Flag;
