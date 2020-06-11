/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2020
 * @license MIT
 */
export declare const warn: (...args: any[]) => void;
export declare const isMobileDevice: boolean;
export declare const determineMenuPlacement: (clientX: number, clientY: number, menuWidth: number, menuHeight: number) => {
    left: number;
    top: number;
};
