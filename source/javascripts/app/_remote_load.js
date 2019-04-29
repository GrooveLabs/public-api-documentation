function updateToc(headers) {
  let apiTitle = document.querySelector('[data-title="API"]');

  let apiLinks = apiTitle.nextElementSibling;

  if (!apiLinks) {
    apiLinks = document.createElement('ul');
    apiLinks.classList.add('toc-list-h2', 'active');
    apiTitle.parentNode.appendChild(apiLinks);
  }


  apiLinks.innerHTML += headers.map(header =>
    `<li>
        <a href="#${header.toLowerCase()}" class="toc-h2 toc-link" data-title="${header}">${header}</a>
      </li>`
  ).join('');
}

async function remoteLoad() {
  const response = await fetch('https://s3-us-west-2.amazonaws.com/developer.grooveapp.com/production/public-api-documentation/docs.html')
  const text = await response.text();
  const div = document.createElement('div')
  div.innerHTML = text;
  const headers = [...div.querySelectorAll('h2')].map(h2 => h2.innerText);

  updateToc(headers);

  document.querySelector('.content').innerHTML += text;
};
