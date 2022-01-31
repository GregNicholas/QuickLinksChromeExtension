let myLinks = [];

const input = document.getElementById("input-btn");
const tabBtn = document.getElementById("tab-btn");
const form = document.getElementById("links-form");
const deleteAll = document.getElementById("delete-btn");
const inputEl = document.getElementById("input-el");
const ulEl = document.getElementById("ul-el");
const linksFromLocalStorage = JSON.parse(localStorage.getItem("myLinks"));

const clickDelete = (itemId) => {
  myLinks = myLinks.filter(link => link[0] !== itemId)
  localStorage.setItem("myLinks", JSON.stringify(myLinks));
  render(myLinks)
}

const itemId = () => {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
       + Math.random().toString(16).slice(2)
       + Date.now().toString(16).slice(4);
};

const render = (links) => {
  let listItems = "";
  for (let i of links) {
      const btnId = `item-btn-${i[0]}`
    listItems += `
      <li id=${i[0]}>
        <button class="item-btn" id=${btnId} >x</button>
        <a href="${i[1]}" target="_blank">
          ${i[1]}
        </a>
      </li>
    `;
  }
  ulEl.innerHTML = listItems;

  myLinks.map(link => {
    const itemId = link[0];
    const item = document.getElementById(`item-btn-${itemId}`);
    item.addEventListener('click', () => {
      clickDelete(itemId)
    })
  })

};

if (linksFromLocalStorage) {
  myLinks = linksFromLocalStorage;
  render(myLinks);
}

const saveLink = (item) => {
  const newId = itemId();
  if (item) {
    myLinks.push([newId, item]);
    inputEl.value = "";

    localStorage.setItem("myLinks", JSON.stringify(myLinks));

    render(myLinks);
  }
};

const saveTab = () => {
  const newId = itemId();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    myLinks.push([newId, tabs[0].url])
        localStorage.setItem("myLinks", JSON.stringify(myLinks) )
        render(myLinks)
    
})
}

const deleteAllLinks = () => {
  myLinks = [];
  localStorage.clear();
  render(myLinks);
};

form.addEventListener("submit", () => saveLink(inputEl.value));
deleteAll.addEventListener("click", () => deleteAllLinks());
tabBtn.addEventListener("click", () => saveTab());
