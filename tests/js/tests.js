//
// WhatSite test suite.
//

var ws = WhatSite;

//
// Test #1: Hostnames
//
var testHosts = {
  "local": [
    "local",
    "localhost",
    "test.localhost",
    "dev.site.localhost"
  ],
  "dev": [
    "dev.site.com",
    "dev.sub.site.com",
    "site.dev.com"
  ],
  "test": [
    "test.site.com",
    "test.sub.site.com",
    "site.test.com",
    "qa.site.com",
    "qa.sub.site.com",
    "site.qa.com"
  ]
};

$.each(testHosts, function (realm, hostnames) {
  $.each(hostnames, function (i, hostname) {
    console.log(realm, hostname);
    ws.hostname = hostname;
    console.log(ws.thisSite(), hostname);
  });
});

var antiTestHosts = [
  "somesite.com",
  "anothertestplace.com",
  "mysitedev.com",
  "mysitetest.com",
  "mysiteqa.com"
];

$.each(antiTestHosts, function (i, hostname) {
  ws.hostname = hostname;
  console.log(ws.thisSite(), "ANTIMATCH: " + hostname);
});

