import Files from "./Files";

export function formatSize(length) {

    var i = 0,
        type = ['б', 'Кб', 'Мб', 'Гб', 'Тб', 'Пб'];

    while ((length / 1000 | 0) && i < type.length - 1) {
        length /= 1024;
        i++;
    }

    return length.toFixed(2) + ' ' + type[i];
}


export {
    Files
}

export default Files;
