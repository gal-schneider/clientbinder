var txt = document.createTextNode(" This text was added to the DIV. 777");
document.getElementById("1").appendChild(txt);

document.body.innerHTML = '<div id="amazon-root"></div>';

var a = document.createElement('a');
var linkText = document.createTextNode("my title text");
a.appendChild(linkText);
a.id = "login";
a.title = "Login";
a.name = "Login";
a.href = "#";
document.body.appendChild(a);

   // IAM Role that you create for Login With Amazon
    var roleArn = 'arn:aws:iam::368101875365:role/login-with-amazon_dynamodb-d3';

    // Login with Amazon
    window.onAmazonLoginReady = function() {
        amazon.Login.setClientId('amzn1.application-oa2-client.c86fbf2d48a84150be9615524c316a21');
    };
    (function(d) {
        var a = d.createElement('script'); a.type = 'text/javascript';
        a.async = true; a.id = 'amazon-login-sdk'; 
        a.src = 'https://api-cdn.amazon.com/sdk/login1.js?v=3';
        d.getElementById('amazon-root').appendChild(a);
    })(document);

    /* if the Login With Amazon authentication is successful
       then detect the browser being used and push it into a DynamoDB table, 
       returning the updated count if the put is successful */
    function amazonAuth(response) {
        if (response.error) {
            console.log(response.error);
            return;
        } 
        AWS.config.credentials = new AWS.WebIdentityCredentials({
            RoleArn: roleArn,
            ProviderId: 'www.amazon.com',
            WebIdentityToken: response.access_token
        });
        amazon.Login.retrieveProfile(response.access_token, function(response) {
            AWS.config.region = 'us-east-1';
            var db = new AWS.DynamoDB();
            var detectedBrowser = identifyBrowser();
            var params = {
                TableName: 'browser-metrics',
                Key: {'browser': {'S': detectedBrowser.n}, 'version': {'S': detectedBrowser.v}},
                AttributeUpdates: {'count': {Action: 'ADD', Value: {N: '1'}}},
                ReturnValues: 'UPDATED_NEW'
            }
            db.updateItem(params, function(err, data) {
                if (err) console.log(err, err.stack);
                else     updateBrowserCount(data);
            });
        });
    }

    // display current detected browser count
    function updateBrowserCount(data) {
        document.getElementById('login').innerHTML = '';
        document.getElementById('logout').innerHTML = 'Logout';
        document.getElementById('browserCount').innerHTML = 'Successful authentications by people with browsers like yours: ' + data.Attributes.count.N;
    }
    
    // login with Amazon when you click the Login link
    document.getElementById('login').onclick = function() {
        options = { scope : 'profile' };
        amazon.Login.authorize(options, amazonAuth);
    };

    // logout when you click the Logout link
    document.getElementById('logout').onclick = function() {
        amazon.Login.logout();
        location.reload();
    };

