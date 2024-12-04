
import { defaults, languages } from 'constants';


export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);



export const makeId = (length = 10) => {

    let id = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    let counter = 0;
    while (counter < length) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }

    return id;
};


export const idSearchOnHierarchy = (e, id, foundId = false) => {

    var node = e;

    if ('target' in e) {
        foundId = false;
        node = e.target;
    }

    if (foundId) return true;
    else {
        if (node && 'id' in node && node.id.includes(id)) {
            return true;
        }
        else {
            if (!node.parentNode) {
                return false;
            }
            else {
                return idSearchOnHierarchy(node.parentNode, id, foundId);
            }
        }
    }
};

export const maskString = (string) => {
    return string.slice(0, 3) + '*****' + string.slice(string.length - 3, string.length);
};


export const abbreviateText = (text, max = 20) => {
    return text.length > max ? text.substring(0, max) + '...' : text;
};


export const getDefaultLanguage = () => {
    let navigatorLang = navigator.language || navigator.userLanguage;
    return navigatorLang in languages ? navigatorLang : defaults.language;
};
