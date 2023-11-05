import _ from 'lodash';
const axios = require('axios');
const storiesId = [];
let loadedNewsCount = 10;
const loaderButton = document.getElementById('load-more');

const createNewElement = (element) => document.createElement(element);

// Reset the state
const resetState = () => {
  storiesId.length = 0;
  loadedNewsCount = 10;
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = '';
};

// Get new stories
const getNewStories = () => {
  resetState();
  return axios.get('https://hacker-news.firebaseio.com/v0/newstories.json')
    .then((response) => {
      storiesId.push(...response.data);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      const loaderElement = document.getElementById('loader');
      loaderElement.innerHTML = '';
    });
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

  const createAndAppendElement = (element, className, textContent) => {
    const el = createNewElement(element);
    el.classList.add(className);
    el.textContent = textContent;
    return el;
  }

  const pCategory = createAndAppendElement('p', 'category', storyDetails.type.toUpperCase());
  const h2Title = createAndAppendElement('a', 'title', storyDetails.title);
  
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

  // Add elements to the document
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