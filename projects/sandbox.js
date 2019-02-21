const carName = 'Volkswagen';

const ReturnCarMake = (make) => {
    console.log(`Your car is a ${make}.`);
};

ReturnCarMake(carName);

let a = 0;
let x = 32;
while (x > 10) {
    a = a + 1;
    x = x / 2;
}
let b = a;
while (x >= 2) {
    x = x - 3;
    b = b + 1;
}

console.log(a);
console.log(b);