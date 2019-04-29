//= require ./lib/_energize
//= require ./app/_toc
//= require ./app/_remote_load
//= require ./app/_lang

$(function() {
  loadToc($('#toc'), '.toc-link', '.toc-list-h2', 10);
  setupLanguages($('body').data('languages'));
  $('.content').imagesLoaded(async() => {
    await remoteLoad();
    window.recacheHeights();
    window.refreshToc();
  });
});

window.onpopstate = function() {
  activateLanguage(getLanguageFromQueryString());
};
