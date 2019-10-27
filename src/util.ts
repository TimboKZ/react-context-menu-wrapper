export const warn = (...args: any[]) => {
    const parts: any = [`[react-context-menu-wrapper]`].concat(args);
    // eslint-disable-next-line no-console
    console.warn.apply(null, parts);
};

export const isMobileDevice = () => {
    return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
};
