import { debounce } from 'lodash';
import Notiflix from 'notiflix';


import { createGalleryCard } from './galleryCard';
import { axiosRecipes } from './axiosRecipes';
import { axiosCard } from './axiosCategories';

const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api/';
const categoriesRef = 'categories';
const areaRef = 'areas';
const ingredientsRef = 'ingredients';

const refs = {
  form: document.querySelector('.myForm'),
  categoriesEl: document.querySelector('.categories-list'),
  inputEl: document.querySelector('.input-filter'),
  timeEl: document.querySelector('.time-select'),
  areaEl: document.querySelector('.area-select'),
  timeMob: document.querySelector('.time-select-mob'),
  areaMob: document.querySelector('.area-select-mob'),
  ingredientsEl: document.querySelector('.ingredients-select'),
  ratingBackdrop: document.querySelector('.rating-backdrop'),
  gallery: document.querySelector('.gallery'),
  button1: document.querySelector('.btn-center1'),
  button2: document.querySelector('.btn-center2'),
  button3: document.querySelector('.btn-center3'),

  btn_right: document.querySelector('.btn-right'),
  btn_end: document.querySelector('.btn-right-end'),

  btn_start: document.querySelector('.btn-left1'),
  btn_left: document.querySelector('.btn-left'),

  btn_all_categories: document.querySelector('.btn-all-categories'),
  resetFilter: document.querySelector('.reset-filter'),

  fidbackRaiting:document.querySelector(".js-rating")
};


const axiosRecipesInstance = new axiosRecipes();



axiosRecipesInstance.getFilteredData(categoriesRef).then(categories => {
  categories.forEach(category => {
    const liEl = document.createElement('li');
    liEl.textContent = category.name;
    liEl.setAttribute('value', category.name);
    liEl.classList.add('category-item');
    refs.categoriesEl.append(liEl);
  });
});

axiosRecipesInstance.getFilteredData(areaRef).then(areas => {
  areas.forEach(area => {
    const optionEl = document.createElement('option');
    optionEl.id = area._id;
    optionEl.value = area.name;
    optionEl.textContent = area.name;
    optionEl.classList.add('option-text');
    refs.areaMob.appendChild(optionEl);
  });

});

axiosRecipesInstance.getFilteredData(areaRef).then(areas => {
  areas.forEach(area => {
    const optionEl = document.createElement('option');
    optionEl.id = area._id;
    optionEl.value = area.name;
    optionEl.textContent = area.name;
    optionEl.classList.add('option-text');
    refs.areaEl.appendChild(optionEl);
  });

});

axiosRecipesInstance.getFilteredData(ingredientsRef).then(ingredients => {
  ingredients.forEach(ingredient => {
    const optionEl = document.createElement('option');
    optionEl.value = ingredient._id;
    optionEl.id = ingredient._id;
    optionEl.textContent = ingredient.name;
    optionEl.classList.add('option-text');
    refs.ingredientsEl.appendChild(optionEl);
  });
 
});
selectTime();
function selectTime() {
  for (let i = 5; i <= 120; i += 5) {
    const optionEl = document.createElement('option');
    optionEl.textContent = [i] + ' min';
    optionEl.value = [i];
    optionEl.classList.add('option-text');

    refs.timeEl.appendChild(optionEl);
  }

 
}

selectTimeMob();

function selectTimeMob() {
  for (let i = 5; i <= 120; i += 5) {
    const optionEl = document.createElement('option');
    optionEl.textContent = [i] + ' min';
    optionEl.value = [i];
    optionEl.classList.add('option-text');
    optionEl.style.backgroundColor = 'var(--option-color)';
    optionEl.style.color = 'var(--primary-color-03)';
    refs.timeMob.appendChild(optionEl);
  }

  
}


let selectedCategoryId;
let selectedAreaId;
let selectedIngredientsId;
let selectedTimeId;
let inputValue;
let totalPages = 1;
let arayRecept;
let limitID;
let results = [];

let activeCategories;

refs.categoriesEl.addEventListener('click', handleCategory);
const axiosCardInstance = new axiosCard();
function handleCategory(e) {
  
  if (e.target.classList.contains('category-item')) {
    refs.btn_all_categories.classList.remove('active_all-categories');
    selectedCategoryId = e.target.getAttribute('value');
    axiosCardInstance.category = selectedCategoryId;
    axiosCardInstance.page = 1;

    showRecipes();

    if (activeCategories !== undefined) {
      activeCategories.classList.remove('active');
    }
  }
  activeCategories = e.target;
  e.target.classList.add('active');
}

refs.inputEl.addEventListener('input', debounce(handleInputEl, 300));

function handleInputEl(e) {
  inputValue = e.target.value.trim();
  axiosCardInstance.title = inputValue;

  showRecipes();
}

refs.areaMob.addEventListener('change', handleAreaMob);
function handleAreaMob(e) {
  selectedAreaId = e.target.value;
  axiosCardInstance.area = selectedAreaId;
  showRecipes();
}
refs.areaEl.addEventListener('change', handleArea);

function handleArea(e) {
  selectedAreaId = e.target.value;
  axiosCardInstance.area = selectedAreaId;
  showRecipes();
}

refs.timeMob.addEventListener('change', handleTimeMob);

function handleTimeMob(e) {
  selectedTimeId = e.target.value;
  axiosCardInstance.time = selectedTimeId;
  arayRecept = selectedTimeId;
  showRecipes();
}

refs.timeEl.addEventListener('change', handleTime);

function handleTime(e) {
  selectedTimeId = e.target.value;
  axiosCardInstance.time = selectedTimeId;
  arayRecept = selectedTimeId;
  showRecipes();
}

refs.ingredientsEl.addEventListener('change', handleIngredients);

function handleIngredients(e) {
  selectedIngredientsId = e.target.value;
  axiosCardInstance.ingredients = selectedIngredientsId;
  showRecipes();
}



if (window.screen.width >= 1280) {
  limitID = 9;
  axiosCardInstance.limit = limitID;
  arayRecept = limitID;
  showRecipesAdapt();
} else if (window.screen.width >= 768) {
  limitID = 8;
  axiosCardInstance.limit = limitID;
  arayRecept = limitID;
  showRecipesAdapt();
} else {
  showRecipesAdapt();
}


function showRecipes() {
  axiosCardInstance.getCardData().then(data => {
    totalPages = data.totalPages;
    if (totalPages === null) {
      Notiflix.Notify.info("😪 We don't have recipes for your request!");
    }
   
    totalPages = data.totalPages;
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
}
function showRecipesAdapt() {
  axiosCardInstance.getCardData().then(data => {
    totalPages = data.totalPages;
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
}

//////////////////////////////////////////////////////// pagination
refs.button1.addEventListener('click', e => {
  axiosCardInstance.page = 1;
  axiosCardInstance.getCardData().then(data => {
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
});

refs.button2.addEventListener('click', e => {
  if (totalPages === 2) {
    return;
  } else {
    axiosCardInstance.page = e.currentTarget.innerText;

    axiosCardInstance.getCardData().then(data => {
      refs.gallery.innerHTML = createGalleryCard(data.results);
    });
  }
});
refs.button3.addEventListener('click', e => {
  if (totalPages === 3) {
    return;
  }
  axiosCardInstance.page = e.currentTarget.innerText;

  axiosCardInstance.getCardData().then(data => {
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
});

refs.btn_right.addEventListener('click', e => {
  if (totalPages === axiosCardInstance.page) {
    return;
  }
  axiosCardInstance.page++;
  axiosCardInstance.getCardData().then(data => {
    totalPages = data.totalPages;
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
});
refs.btn_end.addEventListener('click', e => {

  axiosCardInstance.page = totalPages;
  axiosCardInstance.getCardData().then(data => {
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
});
refs.btn_left.addEventListener('click', e => {
  if (axiosCardInstance.page === 1) {
    return;
  }
  axiosCardInstance.page--;
  axiosCardInstance.getCardData().then(data => {
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
});

refs.btn_start.addEventListener('click', e => {
  axiosCardInstance.page = 1;
  axiosCardInstance.getCardData().then(data => {
    refs.gallery.innerHTML = createGalleryCard(data.results);
  });
});

//////////////////////////////////////////////////////// pagination


refs.resetFilter.addEventListener('click', resetAllFilters);

function resetAllFilters() {
  refs.timeEl.value = '';
  refs.areaEl.value = '';
  refs.timeMob.value = '';
  refs.areaMob.value = '';
  refs.ingredientsEl.value = '';

  axiosCardInstance.category = selectedCategoryId;
  axiosCardInstance.area = null;
  axiosCardInstance.time = null;
  axiosCardInstance.ingredients = null;
  axiosCardInstance.title = null;
  axiosCardInstance.page = 1;
  refs.inputEl.value = '';

 

  showRecipesAdapt();
}

refs.btn_all_categories.addEventListener('click', displayAllCategories);

function displayAllCategories(e) {
  selectedCategoryId = null;
  activeCategories.classList.remove('active');
  activeCategories = e.target;
  e.target.classList.add('active');
  axiosCardInstance.category = null;


  showRecipesAdapt();

  if (activeCategories === e.target) {
    activeCategories.classList.remove('active');
  }
  activeCategories = e.target;
  e.target.classList.add('active');
}



///////////////////////////  ADD TO  FAVORITE ///////////////
const KEY_FAVORITE = 'favorite';
let favoriteArr = JSON.parse(localStorage.getItem(KEY_FAVORITE)) ?? [];

async function fetchRecipeById(recipeId) {
  return fetch(
    `https://tasty-treats-backend.p.goit.global/api/recipes/${recipeId}`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .catch(error => console.error('Error:', error));
}

refs.gallery.addEventListener('click', addFavorite);

async function addFavorite(e) {
  if (e.target.tagName !== 'BUTTON') {
    return;
  }
  if (e.target.classList.contains('btn-heard')) {
    const recipeId = e.target.id;

    const inStorage = favoriteArr.some(({ _id }) => _id === recipeId);
    if (inStorage) {
      favoriteArr = favoriteArr.filter(({ _id }) => _id !== recipeId);
      e.target.classList.remove('heart-icon-active');
      localStorage.setItem(KEY_FAVORITE, JSON.stringify(favoriteArr));
      return;
    }
    try {
      const recipe = await fetchRecipeById(recipeId);
      favoriteArr.push(recipe);
      localStorage.setItem(KEY_FAVORITE, JSON.stringify(favoriteArr));
      e.target.classList.add('heart-icon-active');
    } catch (error) {
      console.error('Error:', error);
    }
  }
}


