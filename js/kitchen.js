var nutritionApiKey = require('./../.env').nutritionApiKey;
var nutritionId = require('./../.env').nutritionId;
var recipeApiKey = require('./../.env').recipeApiKey;
var recipeId = require('./../.env').recipeId;

function Food() {
}

Food.prototype.searchIngredient = function(foodName) {
  $.get('https://api.nutritionix.com/v1_1/search/' + foodName + '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_total_fat&appId=' + nutritionId + '&appKey=' + nutritionApiKey).then(function(response) {
    console.log(response);
  $('#results').append('<li>' + response.hits[0].fields.item_name + ": " + "has this many calories: " +  Math.round(response.hits[0].fields.nf_calories) + '<br>' + " and this many grams of fat: " + Math.round(response.hits[0].fields.nf_total_fat) + "</li>");
  });
};

Food.prototype.searchRecipe = function(ingredient, diet1, diet2) {
  $.get('https://api.edamam.com/search?q=' + ingredient + '&app_id=' + recipeId + '&app_key=' + recipeApiKey).then(function(response) {
    var results = [];
    for ( var x = 0; x < 10; x++) {
      var labels = [];
      var healthLabel = response.hits[x].recipe.healthLabels;
      var dietLabel = response.hits[x].recipe.dietLabels;
      var resultRecipe = response.hits[x].recipe;
      for (var i = 0; i < healthLabel.length; i++) {
        labels.push(healthLabel[i].toLowerCase());
      }
      for (var j = 0; j < dietLabel.length; j++) {
        labels.push(dietLabel[j].toLowerCase());
      }

      if ((diet1) && (diet2)) {
        if (labels.indexOf(diet1) >= 0 && labels.indexOf(diet2) >= 0) {
          results.push(resultRecipe);
        }
      } else if ((diet1)|| (diet2)) {
        if (labels.indexOf(diet1) >= 0 || labels.indexOf(diet2) >= 0) {
          results.push(resultRecipe);
        }
      } else {
        results.push(resultRecipe);
      }
    }

    for (var y = 0; y < results.length; y++) {
      var ingredients = '';
      for (var t = 0; t < results[y].ingredientLines.length; t++) {
        ingredients += "<li>" + results[y].ingredientLines[t] + "</li>";
      }
      $('.recipe-results').append("<div class='recipes'><a href='" + results[y].shareAs + "'>" + results[y].label + "</a><br><br><img src='" + results[y].image + "'><hr><ul>" + ingredients + "</ul><br></div>");
    }
    console.log(response);
    console.log(results);
  });
};

exports.foodModule = Food;
