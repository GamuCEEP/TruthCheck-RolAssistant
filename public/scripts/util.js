function formatResource(resource) {
  for (const prop of ["pasive", "active", "inventory", "equipment"]) {
    if (!resource[prop]) continue;
    for (let item in resource[prop]) {
      resource[prop][item] = resource[prop][item]["id"];
    }
  }
  if (resource.code) {
    resource.code = resource.code.code;
  }
  resource.tags = resource.tags.map((tag) => tag.toLowerCase());
  if (resource.stats) {
    const stats = {};
    for (const statIndex in resource.stats) {
      const key = resource.stats[statIndex].key;
      stats[key] = resource.stats[statIndex].value;
    }
    resource.stats = stats;
  }
  return resource;
}
function formatGame(resource) {
  console.log(resource)
  const game = JSON.parse(JSON.stringify(resource))
  //Players -> actors
  if (game["players"]) {
    game["actors"] = game["players"]?.map((e) => e.id ?? e.key.id);
    delete game["players"];
  }
  //Stages.stage
  
  game["stages"] = game["stages"]?.map(s=>{
    return {
      deck: s["deck"]?.map((e) => {
        console.log(e)
        return {
          odds: e["odds"],
          resource: {
            referencedCollection: e["resource"]["key"]["type"],
            referencedResource: e["resource"]["key"]["id"],
          },
          condition: e["condition"],
        };
      }),
      stage: s["stage"]["key"]["id"]
    }
  })
  return game;
}

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});