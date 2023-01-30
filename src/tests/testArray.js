const result = {};
result.profileLinks = [
  "https://www.facebook.com/groups/1549862975251888/user/100014155819384/",
  "https://www.facebook.com/groups/1549862975251888/user/100006836675256/",
  "https://www.facebook.com/groups/1549862975251888/user/100003478739240/",
  "https://www.facebook.com/groups/1549862975251888/user/100000382447783/",
  "https://www.facebook.com/groups/1549862975251888/user/100024159764600/",
  "https://www.facebook.com/groups/1549862975251888/user/100055080800140/",
  "https://www.facebook.com/groups/1549862975251888/user/100054935963873/",
  "https://www.facebook.com/groups/1549862975251888/user/100025331195265/",
  "https://www.facebook.com/groups/1549862975251888/user/100022731576136/",
  "https://www.facebook.com/groups/1549862975251888/user/100007140738847/",
  "https://www.facebook.com/groups/1549862975251888/user/100003773331194/",
  "https://www.facebook.com/groups/1549862975251888/user/100004641999288/",
  "https://www.facebook.com/groups/1549862975251888/user/100049555833516/",
  "https://www.facebook.com/groups/1549862975251888/user/100009371702067/",
  "https://www.facebook.com/groups/1549862975251888/user/100005328848627/",
  "https://www.facebook.com/groups/1549862975251888/user/100005057200175/",
  "https://www.facebook.com/groups/1549862975251888/user/100044563172935/",
  "https://www.facebook.com/groups/1549862975251888/user/100055166615297/",
  "https://www.facebook.com/groups/1549862975251888/user/100054448303402/",
  "https://www.facebook.com/groups/1549862975251888/user/100054373931811/",
  "https://www.facebook.com/groups/1549862975251888/user/100006698321587/",
  "https://www.facebook.com/groups/1549862975251888/user/100055084421302/",
  "https://www.facebook.com/groups/1549862975251888/user/100050858194894/",
  "https://www.facebook.com/groups/1549862975251888/user/100035562499977/",
  "https://www.facebook.com/groups/1549862975251888/user/100007626842634/",
  "https://www.facebook.com/groups/1549862975251888/user/100055448524251/",
  "https://www.facebook.com/groups/1549862975251888/user/100054681472515/",
  "https://www.facebook.com/groups/1549862975251888/user/100004779843083/",
  "https://www.facebook.com/groups/1549862975251888/user/100004653070050/",
  "https://www.facebook.com/groups/1549862975251888/user/100021646667452/",
  "https://www.facebook.com/groups/1549862975251888/user/100055027898602/",
  "https://www.facebook.com/groups/1549862975251888/user/100025717867289/",
  "https://www.facebook.com/groups/1549862975251888/user/100009113069897/",
  "https://www.facebook.com/groups/1549862975251888/user/100054965923065/",
  "https://www.facebook.com/groups/1549862975251888/user/100012159499538/",
  "https://www.facebook.com/groups/1549862975251888/user/100010927235959/",
  "https://www.facebook.com/groups/1549862975251888/user/100008801561571/",
  "https://www.facebook.com/groups/1549862975251888/user/100006107326919/",
  "https://www.facebook.com/groups/1549862975251888/user/100009005496595/",
  "https://www.facebook.com/groups/1549862975251888/user/100047256290137/",
  "https://www.facebook.com/groups/1549862975251888/user/100047906040652/",
  "https://www.facebook.com/groups/1549862975251888/user/100039927310726/",
  "https://www.facebook.com/groups/1549862975251888/user/100009150622823/",
  "https://www.facebook.com/groups/1549862975251888/user/100055172951280/",
  "https://www.facebook.com/groups/1549862975251888/user/100054979337327/",
  "https://www.facebook.com/groups/1549862975251888/user/100049688374808/",
  "https://www.facebook.com/groups/1549862975251888/user/100049577709954/",
  "https://www.facebook.com/groups/1549862975251888/user/100034421286475/",
  "https://www.facebook.com/groups/1549862975251888/user/100004516569141/",
];
console.log({
    result,
    'result.profileLinks': result.profileLinks,
    'Array.isArray(result.profileLinks)': Array.isArray(result.profileLinks)
});
if (result && result.profileLinks && Array.isArray(result.profileLinks)) {
    console.log(1);
  result.profileLinks = result.profileLinks.map((link) => {
    const matchLink = link.match(/groups\/\d+\/user\/\d+/i);
    // console.log(matchLink);
    if (link && matchLink && matchLink[0]) {
      try {
        link = "https://facebook.com/" + matchLink[0].split('/')[3];
      } catch (e) {
          console.log({e})
      }
    } else {
        console.log('bug');
    }
    return link;
  });
}else {
    console.log(2);
}
console.log({result});
