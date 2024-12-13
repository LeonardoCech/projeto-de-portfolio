

export const currencyFormatter = (v) => {

    try {
        v = +v;

        if (v == 0)
            return '-';

        if (v >= 1)
            return Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

        v = v.toFixed(10);

        let [whole, fraction] = ('' + v).split('.');

        let zerosCount = 0;

        for (let x = 0; x < fraction.length; x++)
            if (fraction.charAt(x) == '0') zerosCount++;
            else break;

        let zeros = fraction.slice(0, zerosCount);
        let noZeros = fraction.slice(zerosCount, zerosCount + 4);
        noZeros = ((+noZeros / 10000) + '').split('.')[1];

        return whole + '.' + zeros + (noZeros ?? '');
    } catch (error) {
        return v;
    }
};


export const numberFormatter = ({ v, precision = null, positiveSignal = false }) => {

    try {
        return Number(v) === 0 ? 0 : (positiveSignal && Number(v) > 0 ? '+' : '') + (precision ? Number(v).toFixed(precision) : v);
    } catch (error) {
        return v;
    }
};


export const percentageFormatter = ({ v, positiveSignal = true, multiply = true }) => {

    v = Number(v) * (multiply ? 100 : 1);
    var isPos = v > 0;

    try {
        return (positiveSignal && isPos ? '+' : '') + v.toFixed(2) + '%';
    }
    catch (error) {
        return v;
    }
};

export const scoreFormatter = (v) => {

    try {
        return new Intl.NumberFormat('en-US').format(v).replace(',', ' ');
    } catch (error) {
        return v;
    }
};
