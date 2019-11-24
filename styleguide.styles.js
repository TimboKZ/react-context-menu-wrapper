const theme = {
    fontFamily: {
        base: ['sans-serif'],
        monospace: ['Fira Code', 'monospace'],
    },
    maxWidth: 1024,
    sidebarWidth: 280,
};

const styles = {
    StyleGuide: {
        '@global body': {
            fontFamily: 'sans-serif',
        },
        '@global img': {
            maxWidth: '100%',
        },
        '@global tbody > tr > td': {
            borderBottom: 'solid 1px #efefef !important',
        },
        '@global tbody > tr > td:nth-of-type(2) > span': {
            whiteSpace: 'pre',
        },
        '@global tbody > tr > td:nth-of-type(3) code': {
            padding: '3px 6px 6px !important',
            whiteSpace: 'pre !important',
            display: 'inline-block',
        },
    },
    SectionHeading: {
        sectionName: {
            textDecoration: 'none !important',
            '&:hover': {
                opacity: 0.75,
            },
        },
    },
    Heading: {
        heading4: {
            fontWeight: 'bold',
            marginTop: 30,
        },
    },
};

module.exports = { theme, styles };
