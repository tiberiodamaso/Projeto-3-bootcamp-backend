function trimestre(mes) {
    let limites = {
        lower: null,
        upper: null,
    };

    switch (mes) {
        case '1':
        case '2':
        case '3':
            limites.lower = 1;
            limites.upper = 3;
            break;
        case '4':
        case '5':
        case '6':
            console.log('aqui oh');
            limites.lower = 4;
            limites.upper = 6;
            break;
        case '7':
        case '8':
        case '9':
            limites.lower = 7;
            limites.upper = 9;
            break;
        case '10':
        case '11':
        case '12':
            limites.lower = 10;
            limites.upper = 12;
            break;
    }

    return limites;
}

export default trimestre;
