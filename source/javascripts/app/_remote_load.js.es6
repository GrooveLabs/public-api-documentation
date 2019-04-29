function updateToc(headers) {
  let apiTitle = document.querySelector('[data-title="API"]');

  let apiLinks = apiTitle.nextElementSibling;

  if (!apiLinks) {
    apiLinks = document.createElement('ul');
    apiLinks.classList.add('toc-list-h2', 'active');
    apiTitle.parentNode.appendChild(apiLinks);
  }


  apiLinks.innerHTML += headers.map((header) =>
    `<li>
        <a href="#${header.toLowerCase()}" class="toc-h2 toc-link" data-title="${header}">${header}</a>
      </li>`
  ).join('');
}

async function remoteLoad() {
  let text = '<p style="color:red">Unable to load API docs</p>';

  try {
    const response = await fetch('https://s3-us-west-2.amazonaws.com/developer.grooveapp.com/production/public-api-documentation/docs.html')
    if (response.status !== 200) {
      throw new Error('Unable to fetch docs');
    }
    text = await response.text();
  } catch (e) {
    console.error(e);
  }
  const div = document.createElement('div')
  div.innerHTML = text;
  const headers = [...div.querySelectorAll('h2')].map(h2 => h2.innerText);

  updateToc(headers);

  document.querySelector('.content').innerHTML += text;
};
