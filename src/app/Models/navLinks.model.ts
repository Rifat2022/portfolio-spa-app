
export interface NavLink {
    label: string;
    href: string;
    isActive: boolean;
    isDropdown?: boolean;
    icon?: string;
    children?: NavLink[];
}
