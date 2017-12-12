
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    var streetstring=$("#street").val();
    var citystring=$("#city").val();
    var address=streetstring+","+citystring;
    $greeting.text("It seems you choose to live at "+address);

    var streetviewUrl="http://maps.googleapis.com/maps/api/streetview?size=600x300&location="+address;
    $body.append('<img src="'+streetviewUrl+'" class="bgimg">');

    // NY times ajax request


    var NYtimesUrl="https://api.nytimes.com/svc/search/v2/articlesearch.json?q="+citystring+"&sort=newest&api-key=b4f22b903c614bc8be9aebc1d01a6efc";
    $.getJSON(NYtimesUrl,function(data){
        // console.log(data);
    $nytHeaderElem.text("New York Times Articles About"+citystring);

    var articles=data.response.docs;
    for(var i=0;i<articles.length;i++){
        var article=articles[i];
        $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');

    };
    // the error handling is chained to another method
    }).error(function(){
        $nytHeaderElem.text("New York Times Articles Could Not Be Loaded");
    });



    // wikipedia ajax request goes here
    // wikipedia endpoint http://en.wikipedia.org/w/api.php
    var wikiUrl="http://en.wikipedia.org/w/api.php?action=opensearch&search=" +citystring+ "&format=json&callback=wikiCallback";


    // adding error handling with the help of timeOut function
    var wikiRequestTimeout=setTimeout(function(){
        $wikiElem.text("Failed to receive Wikipedia resources");
    },8000);



    $.ajax(wikiUrl,{
        dataType:"jsonp",
        success:function(response){
            var articleList=response[1];

            for(var i=0;i<articleList.length;i++){
                articleStr=articleList[i];
                var url="http://en.wikipedia.org/wiki/"+articleStr;
                $wikiElem.append('<li> <a href="'+url+'">'+articleStr+'</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });









    return false;
};

$('#form-container').submit(loadData);
