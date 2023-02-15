const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtn = document.getElementById('close-popup');

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('searchBtn');

 getRandomMeal();
 fetchFavMeals();

async function getRandomMeal(){
   const resp = await fetch
   ('https://www.themealdb.com/api/json/v1/1/random.php');
   const respData = await resp.json();
   const randomMeal =  respData.meals[0];

   addMeal(randomMeal, true);
};
async function getMealById(id){
   const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i='+id);

   const respData = await resp.json();
   const meal = respData.meals[0];
   return meal;
}

async function getMealsBySearch(term){
   const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s='+term
   );

   const respData = await resp.json();
   const meals = respData.meals;
   
   console.log(meals)
   return meals;
}


function addMeal(mealData,random = false) {
   
   const meal = document.createElement('div');
   meal.classList.add('meal');
   meal.innerHTML = `
      <div class="meal-header">
       ${random?`
       <span class="radom">Random Recipe</span>`
        : ''}
         <img 
         src="${mealData.strMealThumb}" alt="${mealData.strMeal}"/>
      </div>
      <div class="meal-body">
         <h4>${mealData.strMeal}</h4>
         <button class="fav-btn">
            <i class="fa-heart"></i>
         </button>
      </div>
      `;
      const head = meal.querySelector('.meal-header')
      const btn1 = meal.querySelector('.meal-body .fav-btn');
      btn1.addEventListener('click',()=>{
         if(btn1.classList.contains('active')){
            removeMealFLS(mealData.idMeal)
            btn1.classList.remove('active');
         }
         else{
            addMealsToLS(mealData.idMeal)
            btn1.classList.add('active');
         }
         fetchFavMeals();
      });
      
      head.addEventListener('click',()=>{
         showMealInfo(mealData);
      })

      mealsEl.appendChild(meal);
}

function addMealsToLS(mealId){
   const mealIds = getMealsFLS();

   localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}
function removeMealFLS(mealId){
   const mealIds = getMealsFLS();

   localStorage.setItem(
      'mealIds', JSON.stringify(mealIds.filter((id) =>
      id !== mealId)));

}
function getMealsFLS(){
   const mealIds = JSON.parse(localStorage.getItem('mealIds'));
   
   return mealIds === null ? [] : mealIds;
}
async function fetchFavMeals(){
   //clean the container
   favoriteContainer.innerHTML = '';

   const mealIds = getMealsFLS();

   for(let i=0; i<mealIds.length; i++){
      const mealId = mealIds[i];
      const meal = await getMealById(mealId);
      
      addMealFav(meal)

   }
//add them to the screen
      
}
function addMealFav(mealData) {   
   const favMeal = document.createElement('li');

   favMeal.innerHTML =`
   <div class='fav-img'>
      <img src="${mealData.strMealThumb}"
      alt="${mealData.strMeal}">
      <span>${mealData.strMeal}</span>
      </div>
      <div class='btnbox'>
      <button class='clear'><i class="fa-window-close"></i></button>
      <div>
      `;

      const btnbox = favMeal.querySelector(".btnbox");
      btnbox.addEventListener('mouseover',()=>{
         btn.style.opacity='1'
      })
      btnbox.addEventListener('mouseout',()=>{
         btn.style.opacity='0'
      });

      const btn = favMeal.querySelector(".clear");
      btn.addEventListener("click", ()=>{
         removeMealFLS(mealData.idMeal);
         
         fetchFavMeals();
      });
      
      const favImg = favMeal.querySelector('.fav-img');
      favImg.addEventListener('mouseover',()=>{
           btn.style.opacity='1'
      });
      favImg.addEventListener('mouseout',()=>{
         btn.style.opacity='0'
    });
      favImg.addEventListener('click',()=>{
         showMealInfo(mealData);
      });
      favoriteContainer.appendChild(favMeal);
      // favMeal.addEventListener('contextmenu',(e)=>{
      //    e.preventDefault();
      //    favMeal.remove();
      // });
      
      
}

function showMealInfo(mealData){
   //close it up
   mealInfoEl.innerHTML = '';
   
   //update the meal info
  const mealEl = document.createElement('div');

  const ingredients = [];

  //get ingredients and measures
  for(let i=1; i<20; i++){
     if(mealData['strIngredient'+i]){
         ingredients.push(`${mealData['strIngredient'+i]} - ${mealData['strMeasure'+i]}`)
     }else{
        break;
     }

  }

  mealEl.innerHTML = ` 
  <h1>${mealData.strMeal}</h1>
  <img
  src="${mealData.strMealThumb}" 
  alt="${mealData.strMeal}">

  <p>
     ${mealData.strInstructions}
  </p>
  <h3>Ingredients</h3>
  <ul>
      ${ingredients.map((ing)=>`<li>${ing}</li>`)
      .join('')}

  `

  mealInfoEl.appendChild(mealEl);
  
  //show the popup
  mealPopup.classList.remove('hidden');
            
}

searchBtn.addEventListener("click", async () => {
   //clean container
   mealsEl.innerHTML = '';

   const search = searchTerm.value;
   const meals = await getMealsBySearch(search);

   if (meals) {
      meals.forEach((meal)=>{
      addMeal(meal);
      });
   }else{
      mealsEl.innerHTML='sorry meal not found!!.'
   }
})

popupCloseBtn.addEventListener('click',()=>{
   mealPopup.classList.add('hidden')
})














