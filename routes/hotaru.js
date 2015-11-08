var express = require('express');
var request = require("request");
var cheerio = require("cheerio");
var router = express.Router();



router.get("/", function(req,res,next){
  res.render("index");
});

router.get("/i", function(req,res,next){
  try{
    request("https:" + req.query.i).on('error', function(e){res.status(404).end()}).pipe(res);
  }catch(e){
    res.status(404).end();
  }
});

router.get("/start", function(req,res,next){
  res.redirect("/" + req.query.where + '/all/1');
});

router.get('/:site', function(r,s,n){
  s.redirect('/' + r.params.site + "/all/1");
});

router.get('/:site/:lang/:page', function(req, res, next) {
  var site = req.params.site;
  var lang = req.params.lang;
  var page = req.params.page;

  var url = "https://" + site + "/index-" + lang + "-" + page +".html";

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);

      var items = [];

      $(".gallery-content > div").each(function(){
        var obj = {};

        obj.title = $(this).find("h1").text();
        obj.thumbnail = $(this).find("img").eq(0).attr("src");
        obj.link = "https://" + site + $(this).find('a[href^="/galleries/"]').attr("href").replace("galleries", "reader");

        var tags = [];

        $(this).find('.relatedtags a[href^="/tag/"]').each(function(){
          tags.push($(this).text());
        });

        obj.tags = tags;

        items.push(obj);
      });
      page *= 1;
      res.render("list", {list: items, nextlink: "/" + site + "/" + lang + "/" + (page + 1),prevlink: "/" + site + "/" + lang + "/" + (page - 1) });
    }else{
      res.render("error", error);
    }
  })

});

module.exports = router;
