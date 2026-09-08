
export function mezclar(array: any){
    for (let i = array.length - 1; i > 0;  i--){
        let j = Math.floor( Math.random() * i );
        let temporal = array[i];
        array[i] = array[j];
        array[j] = temporal;
    }
    
    return array;
}