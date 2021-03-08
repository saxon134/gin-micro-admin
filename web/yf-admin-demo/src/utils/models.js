export default {
    zuowen:zuowen,
};

function zuowen(e) {
    if (!e) {return null;}

    let ary = [];
    if (!e.examples) {
        ary = [{txt:""}];
    } else {
        e.examples.forEach(function (t) {
            ary.push({txt:t});
        });
    }
    e.examples = ary;

    return e;
}
