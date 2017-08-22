/**
 * Created by xianrongbin on 2017/8/17.
 */

let sortDetail = function (propertyArray) {
    let levelCount = propertyArray.length,
        checkLetter = /^[A-Z]{1}$/; //检验是否是整数，字符1和数字1是不同的

    return function (item1, item2) {
        let level = 0;
        let sorting = function () {
            let propertyName = propertyArray[level];
            level++;

            let itemCell1 = item1[propertyName],
                itemCell2 = item2[propertyName];

            //to check type
            if (!checkLetter.test(itemCell1)) {
                itemCell1 = parseInt(itemCell1, 10);
                itemCell2 = parseInt(itemCell2, 10);
            }

            if (itemCell1 < itemCell2) {
                return -1; //从小到大排序
            } else if (itemCell1 > itemCell2) {
                return 1;
            } else if (itemCell1 === itemCell2) {
                if (level === levelCount) {
                    return 0;
                } else {
                    return sorting();
                }
            }

        };
        return sorting();
    };
};

/**
 * 使用例子
 * */
let sortInstance = [
    {'name': 'manager', 'deptNo': 2, 'age': 36, 'sal': 8500},
    {'name': 'low developer', 'deptNo': 3, 'age': 18, 'sal': 5800},
    {'name': 'high developer', 'deptNo': 3, 'age': 35, 'sal': 6800},
    {'name': 'boss', 'deptNo': 1, 'age': 56, 'sal': 9800},
];

let sortProperty = ['sal', 'deptNo', 'age'];

sortInstance.sort(sortDetail(sortProperty));

sortInstance.forEach(function (item) {
    console.log(item.name + '---' + item.deptNo + '---' + item.age + '---' + item.sal);
});
