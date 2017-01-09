$(function(){

  //Show a selection of example searchwords to inspire user
  var instruction = 'Type in your word and...'
  //Display instructions shortly, then show examples on mobile devices
  if ($(window).width() < 768) {
    var searchExMobile = [
      instruction, 'Need some examples?', 'socialization', 'benchmarking', 'nanotechnology', 'best practice', 
      'sensationalism', 'syllogism','paradigm shift', 'augmented reality', 'biometrics',
      'sustainability', 'brick and mortar', 'boolean', 'responsive web design',
      'project-based learning', 'socialization', 'benchmarking', 'nanotechnology', 'best practice', 
      'sensationalism', 'syllogism','paradigm shift', 'augmented reality', 'biometrics',
      'sustainability', 'brick and mortar', 'boolean', 'responsive web design', 'project-based learning'
    ];
    setInterval(function(){
      $("input#searchfield").attr("placeholder", searchExMobile[searchExMobile.push(searchExMobile.shift())-1]);
    }, 2000);    
  //Continue displaying instructions until opening animation is over on desktop
  } else {
    var searchEx = [
      instruction, instruction, instruction, instruction, instruction, 
      'Need some examples?', 'socialization', 'benchmarking', 'nanotechnology', 'best practice', 
      'sensationalism', 'syllogism','paradigm shift', 'augmented reality', 'biometrics',
      'sustainability', 'brick and mortar', 'boolean', 'responsive web design',
      'project-based learning', 'socialization', 'benchmarking', 'nanotechnology', 'best practice', 
      'sensationalism', 'syllogism','paradigm shift', 'augmented reality', 'biometrics',
      'sustainability', 'brick and mortar', 'boolean', 'responsive web design', 'project-based learning'
    ];
    setInterval(function(){
      $("input#searchfield").attr("placeholder", searchEx[searchEx.push(searchEx.shift())-1]);
    }, 3000);
  }

  //Lookitup button
  $('#lookitup').click(function(event){
    event.preventDefault();
    searchWord = $('#searchfield').val();
    //Check for empty input
    if (searchWord === '') {
      readyForm();
    //Check for whitespace input
    } else if (searchWord.match(/^\s*$/)){
      readyForm();
    /*If input is valid, hide mobile-device keyboards, hide intro elements, display loading msg, empty result divs,
    hide main, scroll to the form and followingresults, and run AJAX calls to Longman, Wiki, and YouTube APIs*/
    } else {
      $('input#searchfield').blur();
      $('.newsearchrow').hide();
      $('.loadrow').show();
      $('#gentriex').hide();
      $('.content').hide();
      $('.results').empty();
      $('main').hide(function(){
        $('html, body').animate({
          scrollTop: $('#inputform').offset().top}, 500);      
      });
      searchLongman(searchWord);
      searchWiki(searchWord);
      searchYoutube(searchWord);
    }
  }); 
   
  //New Search button in footer 
  $('a#newsearch').click(function(){
    event.preventDefault();
    readyForm();
    $('a#newsearch').blur();
  });
});

//Display instruction message in field, animate to form, and focus on input
function readyForm(){
  $('#inputform')[0].reset();  
  $("input#searchfield").attr("placeholder", "Type in your word and...");
  $('html, body').animate({
    scrollTop: $('#smallscreen').offset().top}, 500);    
  $('input#searchfield').focus();    
}

//AJAX call to Longman API
function searchLongman(searchWord){
  url = 'https://api.pearson.com/v2/dictionaries/ldoce5/entries?limit=2&headword=' + searchWord;
  $.getJSON(url, function(data){
    showLongman(data.results);
  });
}

//Display Longman data
function showLongman(results){
  //Error msg for no search results
  if (results.length === 0){
    var html = "";
    html += '<p class="emptyMsg"><span class="dotdotdot">' + "/(@_@)\\</span><br>" +
    "Your searchword isn't listed in the Longman Dictionary of Contemporary English. " +
    'Check for typos or spelling errors, but keep in mind that dictionaries often do not list words that are relatively new or very field-specific, ' +
    "so check out what Wikipedia or YouTube has to say about your search.";
    $('.longman').append(html);
  } else {
    //Process and display up to three word entries
    $.each(results, function(index,value){
      $('.longman').append('<dt class="searchword">' + value.headword + '</dt>');

      //Check if pronunciation data is available
      if ("pronunciations" in value){
        //Check if pronunciation audio data is available
        if ("audio" in value.pronunciations[0]){
          var pronunciationLink = value.pronunciations;
          
          //Check if American pronunciation audio data is available 
          if (pronunciationLink.length > 1){
            $('.longman').append('<dd><audio src="https://api.pearson.com' + value.pronunciations[1].audio[0].url + 
              '" id="https://api.pearson.com' + value.pronunciations[1].audio[0].url + '"></audio>' + 
              '<a href="#https://api.pearson.com' + value.pronunciations[1].audio[0].url +
              '" onclick="document.getElementById(\'https://api.pearson.com' + value.pronunciations[1].audio[0].url + '\').play()">' +
              '<i class="fa fa-volume-up" aria-hidden="true"></i></a> ' + value.pronunciations[0].ipa + '</dd>');
          //If not, append British pronunciation audio data
          } else {
            $('.longman').append('<dd><audio src="https://api.pearson.com' + value.pronunciations[0].audio[0].url + 
              '" id="https://api.pearson.com' + value.pronunciations[0].audio[0].url + '"></audio>' + 
              '<a href="#https://api.pearson.com' + value.pronunciations[0].audio[0].url +
              '" onclick="document.getElementById(\'https://api.pearson.com' + value.pronunciations[0].audio[0].url + '\').play()">' +
              '<i class="fa fa-volume-up" aria-hidden="true"></i></a> ' + value.pronunciations[0].ipa + '</dd>');
          }
        //If pronunciation audio data is not available, append only IPA pronunciation data
        } else {
          $('.longman').append('<dd>' + value.pronunciations[0].ipa + '</dd>')          
        }
      }

      //Check if part of speech data is available
      if ("part_of_speech" in value){
        $('.longman').append('<dt>Part of Speech</dt><dd class="partofspeech">' + value.part_of_speech + '</dd>');
      }

      //Check if Senses array (containing definition and examples) is available
      if (value.senses !== null){
        $('.longman').append('<dt>Definition</dt><dd class="meaning">' + value.senses[0].definition + '</dd>');
        //Check if examples are available in Senses array
        if ("examples" in value.senses[0]){
          //Check if audio data for examples are available
          if ("audio" in value.senses[0].examples[0]){
            $('.longman').append('<dt>Usage examples</dt><dd class="examples">' + '<audio src="https://api.pearson.com' + 
              value.senses[0].examples[0].audio[0].url + '" id="https://api.pearson.com' + value.senses[0].examples[0].audio[0].url + '"></audio>' + 
              '<a href="#https://api.pearson.com' + value.senses[0].examples[0].audio[0].url + '" onclick="document.getElementById(\'https://api.pearson.com' + 
              value.senses[0].examples[0].audio[0].url + '\').play()">' + '<i class="fa fa-volume-up" aria-hidden="true"></i></a> "' + 
              value.senses[0].examples[0].text + '"</dd>');
          //If not, append example text only
          } else {
            $('.longman').append('<dt>Usage examples</dt><dd class="examples">"' + 
              value.senses[0].examples[0].text + '"</dd>');
          }
        }
      }
      $('.longman').append('<hr>');
    });
    $('.longman').append('<b><a href="http://www.ldoceonline.com/dictionary/' + $('#searchfield').val() +
    '" class="longmanlink">Visit Longman Dictionary</a></b>');
  }
  //Since Longman's API generally has slowest response time, display all content after Longman call is finished
  $('.content').show(function(){
    $('main').show();
    $('.loadrow').hide();
    $('.newsearchrow').show();
  });
}

//AJAX call to Wikipedia API
function searchWiki(searchWord){
  var params = {
    origin: '*',
    action: 'query',
    format: 'json',
    prop: 'extracts|pageimages',
    indexpageids: 1,
    titles: searchWord, 
    exintro: 1,
    exchars: 1000,
    exsectionformat: 'plain',
    piprop: 'name|thumbnail|original',
    pithumbsize: 300
  };
  url = 'https://en.wikipedia.org/w/api.php';
  $.getJSON(url, params, function(data){
    showWiki(data.query);
  });
}

//Display Wikipedia data
function showWiki(results){
  var pageId = results.pageids[0];
  var info = results.pages[pageId].extract;
  var thumbnail = results.pages[pageId].thumbnail
  var html = "";

  //Error msgs from Wikipedia
  var misSpell = "<ul>\n<li><b>From a misspelling</b>: This is a redirect from a misspelling or typographical error. The correct form is given by the target of the redirect.\n<ul>\n<li>This redirect is made available to aid searches. Pages that use this link should be updated to link directly to the target without the use of a piped link that hides the correct details.</li>\n<li>This template tags redirects with a subcategory of the Redirects from incorrect names category, so template {{R from incorrect name}} should not be used with this template.</li>\n</ul>\n</li>\n</ul>..."
  var misCap = "<ul>\n<li><b>From a miscapitalisation</b>: This is a redirect from a miscapitalisation. The correct form is given by the target of the redirect.\n<ul>\n<li>This redirect is made available to aid searches or to maintain links. Pages that use this link should be updated to link directly to the correct form without using a piped link hiding the correct details.</li>\n<li>This template tags redirects with a subcategory of the Redirects from incorrect names category, so template {{R from incorrect name}} should not be used with this template.</li>\n</ul>\n</li>\n</ul>..."
  var wrongCap = "<ul>\n<li><b>From other capitalisation</b>: This is a redirect from a title with another method of capitalisation. It leads to the title in accordance with the Wikipedia naming conventions for capitalisation, or it leads to a title that is associated in some way with the conventional capitalisation of this redirect title. This may help writing, searching and international language issues.\n<ul>\n<li>If this redirect is an incorrect capitalisation, then {{R from miscapitalisation}} should be used <i>instead</i>, and pages that use this link should be updated to link <i>directly</i> to the target. Miscapitisations can be tagged in <i>any namespace</i>.</li>\n<li>Use this rcat to tag <i>only</i> mainspace redirects; when other capitalisations are in other namespaces, use {{R from modification}} <i>instead</i>.</li>\n</ul>\n</li>\n</ul>..."

  //Error msg for no Wiki page
  if (info === undefined || info === null || info.length < 100 || info === misCap || info === wrongCap || info === misSpell) {
  html += '<p class="emptyMsg"><span class="dotdotdot">' + "?(0_0)?</span><br>" +
  "Wikipedia doesn't have any pages that match the way you typed your searchword, " +
  "but Wikipedia is indeed very particular with correct <u>ca</u>p<u>italizations</u>. " +
  "If your search consists of more than one word, try another search capitalizing your words as follows:<br><br>" + 
  "(1) For proper nouns like the names of places/people, capitalize every word (ex. Los Angeles, Angkor Wat, Paulo Freire).<br><br>" +
  "(2) For all other things, leave the words uncapitalized. First word is up to you! " + 
  "(ex. Learning theory, responsive web design)</p>";
  $('.wiki').append(html);
  } else {
    //If thumbnail is unavailable
    if (thumbnail === undefined || thumbnail === null) {
      //Check if extract from is cut off
      if (info.length < 1000) {
        info = info.substring(0, info.length-3)
        html += info;
        $('.wiki').append(html);
      //If it is cut, get rid off abbreviated ending
      } else {
        info = info.substring(0, info.length-7)
        for (var i = 1; i < 6; i++) {
          if (info.charAt(info.length-i) === '<') {
            info = info.substring(0, info.length-i)
          }
        }
        html += info + '...</p>';
        $('.wiki').append(html);
      }
    //If thumbnail is available
    } else {
      //Same as above, check if extract is cut off or not
      if (info.length < 1000) {
        info = info.substring(0, info.length-3)
        html += '<a href="' + thumbnail.original + '" data-lity><div class="picWrap"><img class="wikipic" src="' +
        thumbnail.source + '"><p class="expand"><i class="fa fa-arrows-alt" aria-hidden="true"></i></div></a>' + info;
        $('.wiki').append(html);
      } else {
        info = info.substring(0, info.length-7)
        for (var i = 1; i < 6; i++) {
          if (info.charAt(info.length-i) === '<') {
            info = info.substring(0, info.length-i)
          }
        }
        html += '<a href="' + thumbnail.original + '" data-lity><div class="picWrap"><img class="wikipic" src="' +
        thumbnail.source + '"><p class="expand"><i class="fa fa-arrows-alt" aria-hidden="true"></i></div></a>' + info + '...</p>';
        $('.wiki').append(html);
      }
    }
    $('.wiki').append('<hr>');
    $('.wiki').append('<b><a href="https://en.wikipedia.org/wiki/' + $('#searchfield').val() + 
      '" class="wikilink" target="_blank">Read more on Wikipedia</a></b><p></p>'
    );
  }
}

//AJAX call to YouTube API
function searchYoutube(searchWord){
  var params = {
    part:'snippet',
    key:'AIzaSyAzrW8qlKjU1kXdfy6PHI23-3jfdpfKBdU',
    q: 'What is ' + searchWord,
    maxResults: 8,
    type: 'video',
    order: 'Relevance',
    safeSearch: 'strict',
    relevanceLanguage: 'en'
  };
  url = 'https://www.googleapis.com/youtube/v3/search';
  $.getJSON(url, params, function(data){
    showYoutube(data.items);
  });
}

//Display YouTube data
function showYoutube(results){
  var html = "";
  //Error msg for no search results
  if (results.length === 0) {
    html += '<p class="emptyMsg"><span class="dotdotdot">' + "\\(o_o;)/</span><br>Wow, it looks like YouTube doesn't have any videos about your searchword. " +
    "It's possible that your searchword contains typos, spelling errors or miscapitalizations. " + 'Check your searchword above and try again!</p>';
    $('.youtube').append(html);
  } else {
    $.each(results, function(index,value){
      html += '<table><tr><td><a href="https://www.youtube.com/watch?v=' + value.id.videoId + '?vq=hd1080" data-lity>' + 
      '<div class="thumbnailWrap"><img class="thumbnail" src="' + value.snippet.thumbnails.medium.url + 
      '"><p class="play"><i class="fa fa-play-circle" aria-hidden="true"></i><br><span class="popup">Play on this page</span></p></div></a></td>' + 
      '<td class="tdtext"><a href="https://www.youtube.com/watch?v=' + value.id.videoId + '" data-lity><p class="videotitle">' + 
      value.snippet.title + '</p></a><p class="videochannel">' + 
      'From <a href="https://www.youtube.com/channel/' + value.snippet.channelId + '" target="_blank">' +
      value.snippet.channelTitle + '</a></p></td></tr></table>';
    });
    $('.youtube').append(html);
    $('.youtube').append('<hr id="youtubehr">');
    $('.youtube').append('<b><a href="https://www.youtube.com/results?search_query=' + $('#searchfield').val() + 
      '" class="youtubelink" target="_blank">More clips on YouTube</a></b>'
    );
  }
}
