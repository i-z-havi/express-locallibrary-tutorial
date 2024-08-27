const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const authorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

//virtuals are variables that DONT get saved to mongo
authorSchema.virtual("name").get(function () {
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = this.family_name + ", " + this.first_name;
  }
  return fullName;
});

authorSchema.virtual("url").get(function () {
  //no arrow function as we'll need this object
  return "/catalog/author/" + this._id;
});

authorSchema.virtual("formattedDates").get(function () {
  switch (this.date_of_birth == null) {
    case false:
      return this.date_of_death
        ? `${DateTime.fromJSDate(this.date_of_birth).toLocaleString({
            weekday: "long",
            month: "long",
            day: "2-digit",
          })} - 
      ${DateTime.fromJSDate(this.date_of_death).toLocaleString({
        weekday: "long",
        month: "long",
        day: "2-digit",
      })}`
        : `${DateTime.fromJSDate(this.date_of_birth).toLocaleString({
            weekday: "long",
            month: "long",
            day: "2-digit",
          })}`;
    case true:
      return "";
  }
});

authorSchema.virtual("updateBirthDate").get(function () {
  const date = DateTime.fromJSDate(this.date_of_birth).toISODate();
  return date;
});

authorSchema.virtual("updateDeathDate").get(function () {
  const date = DateTime.fromJSDate(this.date_of_death).toISODate();
  return date;
});

module.exports = mongoose.model("Author", authorSchema);
