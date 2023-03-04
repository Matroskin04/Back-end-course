function getNumber(str: string) {

    const resultArr: Array<number> = [];

    for ( let i = 0; i < str.length; i++ ) {

        if ( !parseInt( str.slice(i) )  ) continue

        resultArr.push( parseInt( str.slice(i) ) );
        i += parseInt( str.slice(i) ).toString().length - 1;
    } 
    return resultArr
}
getNumber('123fdf12vsd')