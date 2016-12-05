function formatDate(string) {
  var date = new Date(string).toString();
  return date.split(' ').slice(0, 4).join(' ');
}

function loadBlog() {
  var blog = document.getElementById('blog');
  $.ajax({
    url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent("https://girlbitsnbytes.wordpress.com/feed/"),
    dataType : 'json',
    success  : function (data) {
      if (data.responseData.feed && data.responseData.feed.entries) {
        $.each(data.responseData.feed.entries, function (i, e) {
          if(i < 3) {
            var article = document.createElement('article');

            var title = document.createElement('h3');
            title.appendChild(document.createTextNode(e.title));
            article.appendChild(title);

            var date = document.createElement('span');
            date.appendChild(document.createTextNode(formatDate(e.publishedDate)));
            article.appendChild(date);

            var content = document.createElement('p');
            content.appendChild(document.createTextNode(e.contentSnippet));
            article.appendChild(content);

            var readMore = document.createElement('a');
            readMore.href = e.link;
            readMore.target = '_blank';
            readMore.appendChild(document.createTextNode('Read more'));
            article.appendChild(readMore);

            blog.appendChild(article);
          }
        });
      }
    }
  });
}
window.onload = function populateRecentBlog() {
  loadBlog();
}
