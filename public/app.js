angular.module("storiesModule",["ngRoute","ngCookies","ui.bootstrap","ui.sortable","configModule","bodyModule","topMenuModule","storyModule","compositeClassesModule","compositesModule","runnerModule","loginModule","tourModule"]).service("TcBddService",["$modal","$http","$location","$q",function(t,e,o,s){this.openCompositeClass=function(e){var o=this;t.open({templateUrl:"/assets/html/compositeClasses/compositeClasses.tmpl.html",controller:"compositeClassesCtrl",resolve:{compositeClasses:["$route","$http","$modal",function(){return o.getJson("/groovyComposites",!1)}],compositeStepText:function(){return e}}})},this.newCollectionItem=function(t,e){13===t.which&&e.push({})},this.removeCollectionElement=function(t,e){t.splice(e,1)},this.buttonCssClass=function(t){return{"btn-success":t.$valid,"btn-danger":t.$invalid}},this.getRunnerProgressCss=function(t){return{"progress progress-striped active":t,progress:!t}},this.getStoryRunnerStatusText=function(t,e,o){return t?"Story run is in progress":e?o>0?"Story run was successful with "+o+" pending steps":"Story run was successful":"Story run failed"},this.getRunnerStatusCss=function(t,e,o){return{"progress-bar progress-bar-info":t,"progress-bar progress-bar-warning":!t&&e&&o,"progress-bar progress-bar-success":!t&&e&&!o,"progress-bar progress-bar-danger":!t&&!e}},this.openRunnerParametersModal=function(e,o){var s=this;return t.open({templateUrl:"/assets/html/runner/runnerParams.tmpl.html",controller:"runnerParamsCtrl",resolve:{data:["$route","$http","$modal",function(){return s.getJson("/steps/classes.json",!0)}],showGetApi:function(){return e},features:function(){return{runStory:o.features.runStory}}}})},this.openDir=function(t,e){if(".."===e){var o=t.rootPath.split("/");t.rootPath=o.slice(0,o.length-2).join("/"),""!==t.rootPath&&(t.rootPath+="/"),this.getStories(t,"")}else this.getStories(t,e)},this.getStories=function(t,o){var s=this;void 0===t.rootPath&&(t.rootPath=""),e.get("/stories/list.json?path="+t.rootPath+o).then(function(e){t.files=e.data,""!==o&&(t.rootPath+=o+"/")},function(t){s.openErrorModal(t.data)})},this.stepTextPattern=function(){return/^(Given|When|Then) .+$/},this.openConfirmationModal=function(e){return t.open({templateUrl:"/assets/html/confirmationModal.tmpl.html",controller:"modalCtrl",resolve:{data:function(){return e}}})},this.classNamePattern=function(){return/^[a-zA-Z_$][a-zA-Z\d_$]*$/},this.cssClass=function(t){return{"has-error":t.$invalid,"has-success":t.$valid&&t.$dirty}},this.deleteStory=function(t){var n=this,r=s.defer(),a={status:"Delete Story",message:"Are you sure you want to delete this story?"},i=this.openConfirmationModal(a);return i.result.then(function(){e.delete("/stories/story/"+t).then(function(){o.path("/page/stories/new/"),r.resolve("OK")},function(t){n.openErrorModal(t.data.meta),r.reject("NOK")})},function(){r.reject("NOK")}),r.promise},this.getJson=function(t,o){var s=this;return e.get(t,{cache:o}).then(function(t){return t.data},function(t){s.openErrorModal(t.data)})},this.openErrorModal=function(e){t.open({templateUrl:"/assets/html/errorModal.tmpl.html",controller:"modalCtrl",resolve:{data:function(){return e}}})},this.startJoyRide=function(t,o){e.get("/api/v1/data/"+t).then(function(t){o.configJoyRide=t.data.data,o.tours=[{}],o.startJoyRideFlag=!0},function(){o.startJoyRideFlag=!1})},this.onFinishJoyRide=function(t){t.startJoyRideFlag=!1,t.tours=[]}}]).controller("modalCtrl",["$scope","$modalInstance","data",function(t,e,o){t.data=o,t.ok=function(){e.close("ok")},t.cancel=function(){e.dismiss("cancel")}}]),angular.module("configModule",[]).config(["$routeProvider","$locationProvider",function(t,e){e.html5Mode(!0),t.when("/page/tour/",{templateUrl:"/assets/html/tour/tour.tmpl.html",controller:"tourCtrl"}).when("/page/stories/new/",{templateUrl:"/assets/html/story/story.tmpl.html",controller:"storyCtrl",resolve:{story:["$http","$modal","TcBddService",function(t,e,o){return o.getJson("/stories/story.json",!1)}],steps:["$http","$modal","TcBddService",function(t,e,o){return o.getJson("/steps/list.json",!0)}],groovyComposites:["$http","$modal","TcBddService",function(t,e,o){return o.getJson("/groovyComposites",!0)}]}}).when("/page/stories/new/:path*",{templateUrl:"/assets/html/story/story.tmpl.html",controller:"storyCtrl",resolve:{story:["$route","$http","$modal","TcBddService",function(t,e,o,s){return s.getJson("/stories/story.json?path="+t.current.params.path+".story",!1)}],steps:["$http","$modal","TcBddService",function(t,e,o){return o.getJson("/steps/list.json",!0)}],groovyComposites:["$http","$modal","TcBddService",function(t,e,o){return o.getJson("/groovyComposites",!0)}]}}).when("/page/stories/view/:path*",{templateUrl:"/assets/html/story/story.tmpl.html",controller:"storyCtrl",resolve:{story:["$route","$http","$modal","TcBddService",function(t,e,o,s){return s.getJson("/stories/story.json?path="+t.current.params.path+".story",!1)}],steps:["$http","$modal","TcBddService",function(t,e,o){return o.getJson("/steps/list.json",!0)}],groovyComposites:["$http","$modal","TcBddService",function(t,e,o){return o.getJson("/groovyComposites",!0)}]},reloadOnSearch:!1}).when("/page/composites/:className*",{templateUrl:"/assets/html/composites/composites.tmpl.html",controller:"compositesCtrl",resolve:{compositesClass:["$route","$http",function(t,e){var o=t.current.params.className,s="/groovyComposites/"+o;return e.get(s,{cache:!1}).then(function(t){return t.data},function(){var t=o.substring(0,o.lastIndexOf("."));return{"class":t,composites:[{stepText:"",compositeSteps:[{}]}],isNew:!0}})}],steps:["$http","$modal","TcBddService",function(t,e,o){return o.getJson("/steps/list.json",!1)}]}}).when("/page/runner/",{templateUrl:"/assets/html/runner/runner.tmpl.html",controller:"runnerCtrl",resolve:{data:["$route",function(t){return{reportsPath:t.current.params.path}}]}}).when("/page/login/",{templateUrl:"/assets/html/login/login.tmpl.html",controller:"loginCtrl"}).when("/page/loginWelcome/",{templateUrl:"/assets/html/login/loginWelcome.tmpl.html",controller:"loginWelcomeCtrl"}).otherwise({redirectTo:"/page/tour"})}]),angular.module("bodyModule",["ngJoyRide"]).controller("bodyCtrl",["$scope","$http","$modal","$location","TcBddService","$rootScope",function(t,e,o,s,n){t.onFinishJoyRide=function(){n.onFinishJoyRide(t)},t.startJoyRide=function(e){n.startJoyRide(e,t)},t.startJoyRideOnLoad=function(){void 0!==s.search().tour&&t.startJoyRide("tour_"+s.search().tour)},t.openStory=function(){o.open({templateUrl:"/assets/html/stories.tmpl.html",controller:"storiesCtrl",resolve:{data:function(){return{}},features:function(){return{deleteStory:t.features.deleteStory}}}})},t.openCompositeClass=function(){n.openCompositeClass()},t.openModal=function(){if(void 0!==s.search().openModal){var e=s.search().openModal;"openStory"===e?t.openStory():"openCompositeClass"===e&&t.openCompositeClass()}},t.loadFeatures=function(){e.get("/api/v1/data/features").then(function(e){t.features=e.data.data,t.openModal()},function(){t.features=[]})},t.loadFeatures(),t.startJoyRideOnLoad()}]),angular.module("compositeClassesModule",[]).controller("compositeClassesCtrl",["$scope","$http","$modalInstance","compositeClasses","compositeStepText","TcBddService",function(t,e,o,s,n,r){t.compositeClasses=s,t.compositeStepText=n,t.close=function(){o.close()},t.compositeClassUrl=function(e,o){var s="/page/composites/";void 0!==e&&""!==e&&(s+=e+".");var n;return n=o.indexOf("/")>=0?o.split("/"):o.split("\\"),s+=n[n.length-1],void 0!==t.compositeStepText&&""!==t.compositeStepText&&(s+="?stepText="+t.compositeStepText),s},t.compositeClassText=function(t){var e;e=t.indexOf("/")>=0?t.split("/"):t.split("\\");var o=e[e.length-1];return o.indexOf(".")>=0&&(o=o.substr(0,o.lastIndexOf("."))),o},t.classNamePattern=r.classNamePattern,t.cssClass=r.cssClass,t.data={"class":""},t.onFinishJoyRide=function(){r.onFinishJoyRide(t)},t.startJoyRide=function(e){r.startJoyRide(e,t)}}]),angular.module("compositesModule",[]).controller("compositesCtrl",["$scope","$http","$modal","$location","$cookieStore","compositesClass","steps","TcBddService",function(t,e,o,s,n,r,a,i){t.addNewComposite=function(){t.composite={stepText:"",compositeSteps:[{}]},t.compositesClass.composites.push(t.composite)},t.addStepTextParam=function(){void 0!==s.search().stepText&&""!==s.search().stepText&&t.compositesClass.composites.push({stepText:s.search().stepText,compositeSteps:[]})},t.addNewCompositeStep=function(){t.composite.compositeSteps.push({})},t.setLastComposite=function(){if(void 0!==t.compositesClass){var e=t.compositesClass.composites.length;t.composite=t.compositesClass.composites[e-1]}else t.composite={}},t.compositesClass=r,t.addStepTextParam(),t.originalCompositesClass=angular.copy(r),t.setLastComposite(),t.steps=a,t.classNamePattern=i.classNamePattern,t.stepTextPattern=i.stepTextPattern,t.cssClass=i.cssClass,t.buttonCssClass=function(t,e){return t.$valid?i.buttonCssClass(e):i.buttonCssClass(t)},t.openComposite=function(e){t.composite=e},t.newCollectionItem=i.newCollectionItem,t.removeCollectionElement=i.removeCollectionElement,t.revertCompositesClass=function(){t.compositesClass=angular.copy(t.originalCompositesClass),t.composite=t.compositesClass.composites[0]},t.canRevertCompositesClass=function(){return!angular.equals(t.compositesClass,t.originalCompositesClass)},t.canSaveCompositesClass=function(e){var o=e.$valid,s=!angular.equals(t.compositesClass,t.originalCompositesClass),n=t.compositesClass.isNew;return(n||s)&&o},t.compositesAreValid=function(e){var o=e.$valid;return angular.forEach(t.compositesClass.composites,function(t){void 0===t.stepText||""===t.stepText?o=!1:(void 0===t.compositeSteps||0===t.compositeSteps.length)&&(o=!1)}),o},t.saveCompositesClass=function(){e.put("/groovyComposites",t.compositesClass).then(function(){t.deleteCompositesClassWithoutConfirmation(),s.path("/page/composites/"+t.compositesClass.class+".groovy"),t.compositesClass.isNew=!1,t.originalCompositesClass=angular.copy(t.compositesClass),n.put("compositeClass",t.compositesClass.class)},function(t){i.openErrorModal(t.data)})},t.canDeleteCompositesClass=function(){return!t.compositesClass.isNew},t.deleteCompositesClassWithoutConfirmation=function(){var o=t.compositesClass.class,s=t.originalCompositesClass.class;o!==s&&e.delete("/groovyComposites/"+s).then(function(){},function(t){i.openErrorModal(t.data)})},t.deleteCompositesClass=function(){var o={status:"Delete Composites Class",message:"Are you sure you want to delete this composites class?"},n=i.openConfirmationModal(o);n.result.then(function(){e.delete("/groovyComposites/"+t.originalCompositesClass.class).then(function(){s.path("/")},function(t){i.openErrorModal(t.data)})},function(){})},t.saveCompositesText=function(){return t.compositesClass.isNew?"Create New Composites":"Update Composites"}}]),angular.module("loginModule",[]).controller("loginCtrl",["$scope","$location","TcBddService",function(t,e,o){t.init=function(){t.users=[]},t.cssClass=o.cssClass,t.buttonCssClass=o.buttonCssClass,t.canLogin=function(){return t.loginForm.$valid},t.register=function(){t.users.push(t.user),t.user={}},t.delete=function(){angular.forEach(t.users,function(e,o){e.username===t.user.username&&(t.users.splice(o,1),t.user={})})},t.login=function(){angular.forEach(t.users,function(o){o.username===t.user.username&&e.path("/page/loginWelcome")}),t.user.notRegistered=!0},t.init()}]).controller("loginWelcomeCtrl",["$scope",function(){}]),angular.module("runnerModule",[]).controller("runnerCtrl",["$scope","$modal","$http","$location","$timeout","TcBddService",function(t,e,o,s,n,r){t.openRunnerSelector=function(){return e.open({templateUrl:"/assets/html/runner/runnerSelector.tmpl.html",controller:"runnerSelectorCtrl",resolve:{data:function(){return{}}}})},t.openRunner=function(){var e=t.openRunnerSelector();void 0!==e&&e.result.then(function(e){var s=[];e.dirs.forEach(function(t){s.push({path:t.path+"/**/*.story"})}),e.stories.forEach(function(t){s.push({path:t.path})}),r.openRunnerParametersModal(!0,t).result.then(function(e){var n=e.classes,r=e.action;o.get("/groovyComposites").then(function(e){var o=e.data;t.apiJson={storyPaths:s,classes:n,groovyComposites:o},"run"===r?(t.run(t.apiJson),t.showApi=!1):t.showApi=!0})})})},t.run=function(e){var s="/api/v1/reporters/get/";t.reportsUrl="",t.storyRunnerSuccess=!1,t.showRunnerProgress=!0,o.post("/runner/run.json",e).then(function(e){var o=e.data;"OK"===o.status?(t.reportsUrl=s+o.reportsPath,t.storyRunnerInProgress=!0,t.getReports(o.id)):"FAILED"===o.status?(t.reportsUrl=s+o.reportsPath,t.storyRunnerInProgress=!1):r.openErrorModal(o)},function(e){t.storyRunnerInProgress=!1,t.storyRunnerSuccess=!1,r.openErrorModal(e.data)})},t.getReports=function(e){o.get("/api/v1/reporters/list/"+e).then(function(o){t.reports=o.data,"finished"!==t.reports.status?(t.showRunnerProgress=!0,n(function(){t.getReports(e)},15e3)):t.showRunnerProgress=!1},function(o){"ID is NOT correct"===o.data.message?n(function(){t.getReports(e)},15e3):(t.showRunnerProgress=!1,r.openErrorModal(o.data))})},t.getRunnerStatusCss=function(){return r.getRunnerStatusCss(t.storyRunnerInProgress,t.storyRunnerSuccess,t.pendingSteps>0)},t.getStoryRunnerStatusText=function(){return t.storyRunnerInProgress?"Stories run is in progress":"Stories run is finished"},t.getRunnerProgressCss=function(){return r.getRunnerProgressCss(t.storyRunnerInProgress)},t.onLoad=function(){if(t.storyRunnerInProgress=!1,t.storyRunnerSuccess=!1,t.showRunnerProgress=!1,t.pendingSteps=[],t.reportsUrl="",void 0===s.search().reportsId)t.openRunner();else{var e=s.search().reportsId;t.reportsUrl="/api/v1/reporters/get/"+e+"/view/reports.html",t.getReports(e)}t.showApi=!1},t.apiUrl=function(){return s.protocol()+"://"+s.host()+":"+s.port()+"/runner/run.json"},t.onLoad()}]).controller("runnerSelectorCtrl",["$scope","$http","$modal","$modalInstance","TcBddService",function(t,e,o,s,n){t.files={dirs:[],stories:[]},n.getStories(t,""),t.openDir=function(e){n.openDir(t,e)},t.cancelRunnerSelector=function(){s.dismiss("cancel")},t.okRunnerSelector=function(){var e={dirs:[],stories:[]};angular.forEach(t.files.dirs,function(o){o.selected&&e.dirs.push({path:t.rootPath+o.name})}),angular.forEach(t.files.stories,function(o){o.selected&&e.stories.push({path:t.rootPath+o.name+".story"})}),s.close(e)},t.allowToPrevDir=function(){return""!==t.rootPath},t.canContinue=function(){var e=!1;return angular.forEach(t.files.dirs,function(t){t.selected&&(e=!0)}),e||angular.forEach(t.files.stories,function(t){t.selected&&(e=!0)}),e},t.onFinishJoyRide=function(){n.onFinishJoyRide(t)},t.startJoyRide=function(e){n.startJoyRide(e,t)}}]).controller("runnerParamsCtrl",["$scope","$modalInstance","$cookieStore","data","showGetApi","TcBddService","features",function(t,e,o,s,n,r,a){t.onLoad=function(){t.paramArray=[],t.features=a},t.classes=s.classes,t.setParams=function(){t.classes.forEach(function(t){t.params.forEach(function(e){if(void 0!==e.value&&""!==e.value)e.disabled=!0;else{e.disabled=!1;try{e.value=o.get(t.fullName+"."+e.key)}catch(s){console.log("Could not retrieve cookie "+t.fullName+"."+e.key),console.log(s.message)}}})})},t.hasOptions=function(t){return t?t.length>0:!1},t.hasParams=function(t){return void 0!==t.params&&t.params.length>0},t.ok=function(){e.close({action:"run",classes:t.classes})},t.cancel=function(){e.dismiss("cancel")},t.showGetApi=function(){return n},t.getApi=function(){e.close({action:"api",classes:t.classes})},t.paramElementId=function(t,e){var o=t.charAt(0).toLowerCase()+t.slice(1),s=e.charAt(0).toUpperCase()+e.slice(1);return o+s},t.setParams(),t.onFinishJoyRide=function(){r.onFinishJoyRide(t)},t.startJoyRide=function(e){r.startJoyRide(e,t)},t.onLoad()}]),angular.module("storyModule",[]).controller("storyCtrl",["$scope","$http","$modal","$location","$cookieStore","$q","$anchorScroll","$timeout","story","steps","groovyComposites","TcBddService",function(t,e,o,s,n,r,a,i,l,c,u,p){t.onLoad=function(){t.pendingSteps=[],t.story=l,t.steps=c,t.groovyComposites=u,t.stepTypes=["GIVEN","WHEN","THEN"],t.storyFormClass="col-md-12",t.storyRunnerVisible=!1,t.storyRunnerInProgress=!1,t.storyRunnerSuccess=!0,t.expandPanels(),t.originalStory=angular.copy(l);var e=t.story.path.split("/");if(t.dirPath=e.slice(0,e.length-1).join("/"),""!==t.dirPath&&(t.dirPath+="/"),t.setAction(),void 0!==s.search().reportsId&&(t.storyFormClass="col-md-6",t.storyRunnerClass="col-md-6",t.storyRunnerVisible=!0,t.getReports(s.search().reportsId)),void 0!==s.search().openModal){var o=s.search().openModal;"openRunStory"===o&&t.openRunnerParams()}},t.setAction=function(){t.action=""!==t.story.name?"PUT":"POST"},t.expandPanels=function(){var e=!0;void 0===t.panelsExpanded?t.panelsExpanded=!1:(t.panelsExpanded=!t.panelsExpanded,e=t.panelsExpanded),t.panels={story:t.panelsExpanded,description:t.panelsExpanded,meta:t.panelsExpanded,narrative:t.panelsExpanded,givenStories:t.panelsExpanded,lifecycle:t.panelsExpanded,scenarios:e}},t.cssClass=p.cssClass,t.buttonCssClass=p.buttonCssClass,t.canSaveStory=function(){var e=t.storyForm.$valid,o=!angular.equals(t.story,t.originalStory);return e&&o},t.stepTextPattern=p.stepTextPattern,t.saveStory=function(){if(t.canSaveStory())if(t.story.path=t.dirPath+t.story.name+".story","POST"===t.action){var o=t.dirPath.split("/"),n=o.slice(0,o.length-1).join("/");""!==n&&(n+="/"),e.post("/stories/story.json",t.story).then(function(){s.path("/page/stories/view/"+n+t.story.name),t.originalStory=angular.copy(t.story)},function(e){t.openErrorModal(e.data)})}else t.story.name!==t.originalStory.name&&(t.story.originalPath=t.originalStory.path),e.put("/stories/story.json",t.story).then(function(){t.originalStory=angular.copy(t.story)},function(e){t.openErrorModal(e.data)})},t.canRunStory=function(){return t.storyForm.$valid&&!t.storyRunnerInProgress},t.runStory=function(){t.canRunStory()&&(t.saveStory(),t.openRunnerParams())},t.openRunnerParams=function(){t.openRunnerModal().result.then(function(o){var s=o.classes;t.storyFormClass="col-md-6",t.storyRunnerClass="col-md-6",t.storyRunnerVisible=!0,t.storyRunnerInProgress=!0,s.forEach(function(t){t.params.forEach(function(e){n.put(t.fullName+"."+e.key,e.value)})});var r={storyPaths:[{path:t.story.path}],classes:s,groovyComposites:t.groovyComposites};e.post("/runner/run.json",r).then(function(e){t.getReports(e.data.id)},function(e){t.storyRunnerSuccess=!1,t.storyRunnerInProgress=!1,t.openErrorModal(e.data)})},function(e){t.openErrorModal(e.data)})},t.getReports=function(o){e.get("/api/v1/reporters/list/"+o).then(function(e){if(console.log(o),console.log(e.data),"finished"!==e.data.status)console.log("111"),t.storyRunnerInProgress=!0,i(function(){t.getReports(o)},5e3);else{console.log("222");var s=e.data.reports;t.reports=s,t.reports.id=o,t.setPendingSteps(s),t.storyRunnerInProgress=!1,t.storyRunnerSuccess=t.isStoryRunnerSuccess(s)}},function(e){"ID is NOT correct"===e.data.message?i(function(){t.getReports(o)},5e3):(t.storyRunnerInProgress=!1,p.openErrorModal(e.data))})},t.isStoryRunnerSuccess=function(t){var e=!0;return t.forEach(function(t){t.steps.forEach(function(t){"successful"!==t.status&&"pending"!==t.status&&"notPerformed"!==t.status&&(e=!1)})}),e},t.getReportUrl=function(t,e){return"/api/v1/reporters/get/"+t+"/"+e},t.openRunnerModal=function(){return p.openRunnerParametersModal(!1,t)},t.getRunnerProgressCss=function(){return p.getRunnerProgressCss(t.storyRunnerInProgress)},t.getRunnerStatusCss=function(){return p.getRunnerStatusCss(t.storyRunnerInProgress,t.storyRunnerSuccess,t.pendingSteps>0)},t.setPendingSteps=function(e){t.pendingSteps=[],e.forEach(function(e){e.steps.forEach(function(e){"pending"===e.status&&t.pendingSteps.push({text:e.text})})})},t.hasPendingSteps=function(){return void 0!==t.pendingSteps&&t.pendingSteps.length>0},t.getStoryRunnerStatusText=function(){return p.getStoryRunnerStatusText(t.storyRunnerInProgress,t.storyRunnerSuccess,t.pendingSteps.length)},t.removeCollectionElement=p.removeCollectionElement,t.addElement=function(t){t.push({})},t.addScenarioElement=function(t){t.push({title:"",meta:[],steps:[],examplesTable:""})},t.revertStory=function(){t.story=angular.copy(t.originalStory),t.storyForm.$setPristine()},t.canRevertStory=function(){return!angular.equals(t.story,t.originalStory)},t.canDeleteStory=function(){return"PUT"===t.action&&!t.storyRunnerInProgress},t.deleteStory=function(){var e=t.dirPath+t.story.name+".story";p.deleteStory(e)},t.stepEnterKey=p.newCollectionItem,t.clickPendingStep=function(t){var e=n.get("compositeClass");return void 0===e||""===e?p.openCompositeClass(t):s.search("stepText",t).path("/page/composites/"+e+".groovy")},t.openErrorModal=p.openErrorModal,t.onLoad()}]).controller("storiesCtrl",["$scope","$http","$modal","$modalInstance","$location","$q","TcBddService","features",function(t,e,o,s,n,r,a,i){a.getStories(t,""),t.features=i,t.openDir=function(e){a.openDir(t,e)},t.close=function(){s.close()},t.openStory=function(e){t.onFinishJoyRide(),s.close(),n.path("/page/stories/view/"+t.rootPath+e)},t.allowToPrevDir=function(){return""!==t.rootPath},t.deleteStory=function(e,o){var s=t.rootPath+e+".story";a.deleteStory(s).then(function(){t.files.stories.splice(o,1)})},t.createDirectory=function(o){var s='{"path": "'+t.rootPath+o+'"}';e.post("/stories/dir.json",s).then(function(){t.files.dirs.push({name:o})},function(t){a.openErrorModal(t.data)})},t.onFinishJoyRide=function(){a.onFinishJoyRide(t)},t.startJoyRide=function(e){a.startJoyRide(e,t)}}]),angular.module("topMenuModule",[]).controller("topMenuController",["$scope","$location",function(t,e){t.getTitle=function(){var t=e.path();return 0===t.indexOf("/page/stories/view/")?"View Story":0===t.indexOf("/page/stories/new/")?"New Story":0===t.indexOf("/page/composites/")?"Composites":0===t.indexOf("/page/reports/")?"Reports":0===t.indexOf("/page/login/")?"Login":0===t.indexOf("/page/loginWelcome/")?"Welcome":0===t.indexOf("/page/tour/")?"Home":""}}]),angular.module("tourModule",[]).controller("tourCtrl",["$scope","$location",function(){}]);