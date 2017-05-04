function formatDate(string) {
  var date = new Date(string).toString();
  return date.split(' ').slice(0, 4).join(' ');
}

function loadBlog() {
  var blog = document.getElementById('blog');
  $.ajax({
    url      : "https://girlbitsnbytes.wordpress.com/feed/",
    dataType : 'xmlp',
    success  : function (data) {
      console.log(data);
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

function appendContent(article, text) {
  var urlRegex = /([https?:\/\/|][^\s]+\.[com|co|org|net][^\s]+)/g;
  text = text.replace('&hellip;','');
  text = text.replace('&nbsp;','');
  texts = text.split(urlRegex);

  var content = document.createElement('p');
  if(texts.length == 1)
    content.append(text);
  else {
    $.each(texts, function (i, text) {
      if(text.match(urlRegex)){
        var link = document.createElement('a');
        if(!text.match(/^http/g))
          text = 'http://' + text;
        link.href=text;
        link.target = '_blank';
        link.appendChild(document.createTextNode(text.split('/')[2]));
        content.append(link);
      } else
        content.append(text);
    });
  }
  article.appendChild(content);
}

function loadTweets() {
  var tweets = document.getElementById('tweets');
  $.ajax({
    url      : 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent("https://twitrss.me/twitter_user_to_rss/?user=n3rdgir1"),
    dataType : 'json',
    success  : function (data) {
      if (data.responseData.feed && data.responseData.feed.entries) {
        $.each(data.responseData.feed.entries, function (i, e) {
          var article = document.createElement('article');

          var handleRegex = /(\(@[^\s]+\))/g;
          var titles = e.author.split(handleRegex);
          var author = document.createElement('h3');
          author.appendChild(document.createTextNode(titles[0]));
          var handle = document.createElement('span');
          handle.appendChild(document.createTextNode(titles[1]));
          author.appendChild(handle);

          article.appendChild(author);

          var date = document.createElement('span');
          date.appendChild(document.createTextNode(formatDate(e.publishedDate)));
          article.appendChild(date);

          appendContent(article, e.contentSnippet);

          var readMore = document.createElement('a');
          readMore.href = e.link;
          readMore.target = '_blank';
          readMore.appendChild(document.createTextNode('View Tweet'));
          article.appendChild(readMore);

          tweets.appendChild(article);
        });
      }
    }
  });
}

window.onload = function populateRecentBlog() {
  loadBlog();
  loadTweets();
}
