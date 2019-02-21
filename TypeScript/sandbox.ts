//const currentCity: string = 'Omaha';
//const cashPrize: number = 10000;
//const loading: boolean = true;

/* 
const currentCity = 'Omaha';
const cashPrize = 10000;
const loading = true;
*/

//loading.indexOf('if');

//let foods: string[];

function reverse(word: string): string {
  return word.split('').reverse().join('');
}

/* 
function reverse(word: string) {
  return word.split('').reverse().join('');
}
*/

reverse('racecar');

interface Person {
  name: string;
  age: number;
}

function birthYear(person: Person) {
  return 2018 - person.age
}

type Vegetable = 'broccoli' | 'carrot';
type Fruit = 'apple' | 'orange';

type Ingredient = Vegetable | Fruit;

