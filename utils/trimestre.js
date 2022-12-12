function trimestre(trim) {
    let limites = {
        lower: null,
        upper: null,
    };

    switch (trim) {
        case '1':
            limites.lower = 1;
            limites.upper = 3;
            break;
        case '2':
            limites.lower = 4;
            limites.upper = 6;
            break;
        case '3':
            limites.lower = 7;
            limites.upper = 9;
            break;
        case '4':
            limites.lower = 10;
            limites.upper = 12;
            break;
    }

    return limites;
}

export default trimestre;
