/**
 * @property {HTMLElement} element
 * @property {{target: string, active:string, menu: string, subMenu: string}} options
 */
export default class SubMobile {
    /**
     * @param {HTMLElement} el, l'élement
     * @param {OPT} opt
     */
    constructor(el, opt) {
        var _a;
        this._options = SubMobile.defOptions;
        // permet de reset les sous menus au préalable
        this.resetSMenu = () => {
            if (!this._elMobile)
                return;
            // on retire la classe active aux autres elements du menu
            Array.from(this._elMobile.querySelectorAll(`.${this._options.actif}`), (element) => {
                if (element !== this._element)
                    element.classList.remove(this._options.actif);
            });
            // on retire la classe active aux autres elements du menu
            Array.from(this._elMobile.querySelectorAll(`.${this._options.subMenu}`), (element) => {
                if (element instanceof HTMLElement) {
                    if (element.id !== this._options.target)
                        element.style.display = "none";
                }
            });
        };
        this.onClick = (e) => {
            e.preventDefault();
            if (!this._element || !this._menudown)
                return;
            this.resetSMenu();
            this._element.classList.toggle(this._options.actif);
            if (this._menudown.style.display == "none") {
                this._menudown.style.display = "block";
                this._menudown.style.opacity = "0";
                setTimeout(() => {
                    if (this._menudown)
                        this._menudown.style.opacity = "1";
                }, 1);
            }
            else
                this._menudown.style.display = "none";
        };
        this._options = Object.assign(Object.assign({}, SubMobile.defOptions), opt);
        if (!this._options.target)
            return;
        // le menu mobile
        this._elMobile = document.querySelector(`.${this._options.menu}`);
        if (!this._elMobile)
            return;
        // on selectionne le parent de l'element data-menudown
        this._element = el.parentElement;
        if (!this._element)
            return;
        // on recherche si il y a une div subnav dans le lien car il nécessaire de la déplacer
        const subnav = this._element.querySelector(`.${this._options.subMenu}`);
        if (subnav) {
            const newnav = (_a = subnav.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(subnav);
            if (newnav)
                this._elMobile.insertBefore(newnav, this._elMobile.firstChild);
        }
        this._menudown = document.getElementById(this._options.target);
        // on pose le click si le sous-menu est trouvé
        if (!this._menudown) {
            console.error(`SubMobile : Erreur id  -${this._options.target}- non trouvé`);
            return;
        }
        el.addEventListener("click", this.onClick);
        this._menudown.style.transition = "opacity 1s ease-out";
        this._menudown.style.display = "none";
    }
    /**
     * Permet de gerer la logique d'un menu mobile avec des sous-menus
     *
     * @param {*} OPT, les options de la classe
     * @returns
     */
    static async bind(options = SubMobile.defOptions) {
        return Array.from(document.querySelectorAll("[data-menudown]")).map((el) => {
            if (!(el instanceof HTMLElement) || !el.dataset.menudown)
                return undefined;
            if (el.dataset.menudown.startsWith("{"))
                options = Object.assign(Object.assign({}, options), JSON.parse(el.dataset.menudown));
            else
                options = Object.assign(Object.assign({}, options), { target: el.dataset.menudown });
            return new SubMobile(el, options);
        });
    }
}
SubMobile.defOptions = {
    actif: "active",
    menu: "mobile",
    subMenu: "subnav"
};
