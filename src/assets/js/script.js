import _ from 'lodash';
const axios = require('axios');
const storiesId = [];
let loadedNewsCount = 10;
const loaderButton = document.getElementById('load-more');

const createNewElement = (element) => document.createElement(element);

// Get new stories
const getNewStories = async () => {
  try {
    const response = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json');
    storiesId.push(...response.data);
  } catch (error) {
    console.error(error);
  }
};

// Get full story details
const getStoryDetails = async (id) => {
  await getNewStories();
  try {
    const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Create an li element with story's details
const createStoryElement = (storyDetails) => {
  const li = createNewElement('li');
  li.classList.add('bg-white', 'p-4', 'shadow', 'rounded', 'flex', 'items-center', 'shadow-xl');

  const divCover = createNewElement('div');
  divCover.classList.add('mr-4','font-bold', 'text-3xl', 'border-r-4', 'border-black');

  const imgCover = createNewElement('h1');
  imgCover.textContent = storyDetails.score;
  imgCover.classList.add('w-24', 'h-24', 'object-cover', 'flex', 'justify-center', 'items-center', 'text-blue-600');

  const divDetails = createNewElement('div');
  divDetails.classList.add('flex-1');

  const pCategory = createNewElement('p');
  pCategory.classList.add('category', 'text-sm', 'mb-1');
  pCategory.textContent = storyDetails.type.toUpperCase();

  const h2Title = createNewElement('a');
  h2Title.classList.add('title', 'text-xl', 'font-semibold', 'mb-2');
  h2Title.textContent = storyDetails.title;
  if (storyDetails.url) {
    h2Title.href = storyDetails.url;
  } else {
    h2Title.href = '#';
  }

  const divScoreDate = createNewElement('div');
  divScoreDate.classList.add('text-sm', 'flex', 'items-center', 'overflow-hidden');

  const pDate = createNewElement('p');
  pDate.classList.add('date', 'ml-1');
  const date = new Date(storyDetails.time * 1000);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}`;
  pDate.textContent = formattedDate;

  // Aggiungere gli elementi al documento
  divCover.appendChild(imgCover);
  divDetails.appendChild(pCategory);
  divDetails.appendChild(h2Title);
  divScoreDate.appendChild(pDate);
  divDetails.appendChild(divScoreDate);
  li.appendChild(divCover);
  li.appendChild(divDetails);

  return li;
};

// Select 10 news from storiesId
const viewTenNews = async (array) => {
  await getNewStories();
  const tenNews = array.slice(0, 10);

  for (const id of tenNews) {
    const storyDetails = await getStoryDetails(id);
    const storyElement = createStoryElement(storyDetails);
    document.getElementById('news-list').appendChild(storyElement)
  }
};

viewTenNews(storiesId);

// News Loader
const loadMoreNews = async () => {
  const nextNews = storiesId.slice(loadedNewsCount, loadedNewsCount + 10);

  for (const id of nextNews) {
    const storyDetails = await getStoryDetails(id);
    const storyElement = createStoryElement(storyDetails);
    document.getElementById('news-list').appendChild(storyElement);
  }

  loadedNewsCount += 10;
};

loaderButton.addEventListener('click', loadMoreNews);
