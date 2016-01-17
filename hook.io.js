module['exports'] = function echoHttp (hook) {
  var GitHubApi = require('github'),
      store = hook.datastore,
      res = hook.res;

  if(!hook.params.brandName)    return res.status(400).json({error:'missing brandName'});
  if(!hook.params.brandColor)   return res.status(400).json({error:'missing brandColor'});
  if(!hook.params.brandName)    return res.status(400).json({error:'missing brandName'});

  var github = new GitHubApi({
      // required
      version: "3.0.0",
      protocol: "https",
      host: "api.github.com", // should be api.github.com for GitHub
      timeout: 5000,
      headers: {
          "user-agent": "brand-colors-bot" // GitHub is happy with a unique user agent
      }
  });

  store.get('authKey', function(err, token){
      if (err) return res.status(500).json({error:'missing internal auth keys'});

      github.authenticate({
        type: "oauth",
        token: token
      });

      var body = {
        brandName : hook.params.brandName,
        brandColor : hook.params.brandColor,
        brandSource : (hook.params.brandSource)|| null,
      }

      if (hook.params.brandSource){
        body.brandSoure = hook.params.brandSource;
      }

      body = JSON.stringify(body);


      if (hook.params.message){
        body.body = '\n' + hook.params.message;
      }

      github.issues.create({
        user  : 'reimertz',
        repo  : 'brand-colors',
        title   : 'BOT: Add ' + hook.params.brandName + " : " + hook.params.brandColor,
        body  : body
      }, function(err, result){
        if (err) return res.status(500).json({error:'github messed up'});

        res.end();
      })
    });
}