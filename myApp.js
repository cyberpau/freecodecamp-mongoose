require('dotenv').config();
const mongoose = require("mongoose");
const { Schema } = mongoose;

const personSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: false},
  age: {type: Number, required: false},
  status: {type: Number, required: true, default: 1},
  favoriteFoods: [{type: String}]
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
  if(error){
    console.error(error);
    return error;
  } else {
    console.log("Sucessfully connected to MongoDB!");
  }
});

let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = (done) => {
  let person = new Person({
    "name": "Paulo",
    "age": "26",
    "favoriteFoods": ["Pasta", "Pancit"]
  });
  person.save((err, data) => {
    if (err) return err;
     done(null, person);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return err;
    done(null, data);
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name: personName}, (err, data) => {
    if (err){
      console.error(err);
      return err;
    }
    console.log(data);
    done(null, data);
  })
  
};

const findOneByFood = (food, done) => {
  console.log(food);
  Person.findOne({favoriteFoods: [food]}, (err, data) => {
    if (err) {
      console.error(err);
      return err;
    }
    done(null, data);
  });
};

const findPersonById = (personId, done) => {
  console.log(`ID = ${personId}`);
  Person.findById(personId, (err, data) => {
    if(err){done(err);}
    done(null, data);
  })
  
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  // first, find the person via ID
  Person.findById(personId, (err, person) => {
    if(err) {
      console.err(err);
      done(err);
    }

    // Display the fetched data
    console.log(`before update: ${person}`);

    // insert new food to add
    person.favoriteFoods.push(foodToAdd);

    console.log(`updated data: ${person}`);

    // save
    person.save().then(result => {
      console.log(result);
      done(null, result)
    });

  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName},
    {$set: {age: ageToSet}}, {new: true}, (err, data) => {
      if (err){
        done(err);
        console.error(err);
        return;
      }
      console.log(data);
      done(null, data);
    });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) { done(err); return;}
    console.log(data);
    done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, data) => {
    if (err) { done(err); return;}
    console.log(data);
    done(null, data);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch})
  .sort('name')
  .limit(2)
  .select('name favoriteFoods')
  .exec((err, data) => {
    if (err) {done(err); return;}
    console.log(data);
    done(null, data);
  });

  
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
