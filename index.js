const jsObject = {
  id: 2,
  title: "Practise React state",
  completed: false,
};

console.log("1. js objekt");
console.log(jsObject);
console.log("Tüüp:", typeof jsObject);

const jsonString = JSON.stringify(jsObject, null, 2); // JS objekt -> JSON string

console.log("\n 2. json stringify");
console.log(jsonString);
console.log("Tüüp:", typeof jsonString);

const parsedObject = JSON.parse(jsonString); // JSON string -> parsed JS objekt

console.log("\n 3. parsed js objekt");
console.log(parsedObject.title); // Practise React state
console.log("Tüüp:", typeof parsedObject);
