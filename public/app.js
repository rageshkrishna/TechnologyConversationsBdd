angular.module("storiesModule",["ngRoute","ngCookies","ui.bootstrap","ui.sortable","configModule","bodyModule","topMenuModule","storyModule","compositesModule","runnerModule","loginModule","tourModule"]).service("TcBddService",["$modal","$http","$location","$q",function(o,t,e,s){this.openCompositeClass=function(t){var e=this;o.open({templateUrl:"/assets/html/composites/compositeClasses.tmpl.html",controller:"compositeClassesCtrl",resolve:{compositeClasses:["$route","$http","$modal",function(){return e.getJson("/groovyComposites",!1)}],compositeStepText:function(){return t}}})},this.newCollectionItem=function(o,t){13===o.which&&t.push({})},this.removeCollectionElement=function(o,t){o.splice(t,1)},this.buttonCssClass=function(o){return{"btn-success":o.$valid,"btn-danger":o.$invalid}},this.getRunnerProgressCss=function(o){return{"progress progress-striped active":o,progress:!o}},this.getStoryRunnerStatusText=function(o,t,e){return o?"Story run is in progress":t?e>0?"Story run was successful with "+e+" pending steps":"Story run was successful":"Story run failed"},this.getRunnerStatusCss=function(o,t,e){return{"progress-bar progress-bar-info":o,"progress-bar progress-bar-warning":!o&&t&&e,"progress-bar progress-bar-success":!o&&t&&!e,"progress-bar progress-bar-danger":!o&&!t}},this.openRunnerParametersModal=function(t,e){var s=this;return o.open({templateUrl:"/assets/html/runner/runnerParams.tmpl.html",controller:"runnerParamsCtrl",resolve:{data:["$route","$http","$modal",function(){return s.getJson("/steps/classes.json",!0)}],showGetApi:function(){return t},features:function(){return{runStory:e.features.runStory}}}})},this.openDir=function(o,t){if(".."===t){var e=o.rootPath.split("/");o.rootPath=e.slice(0,e.length-2).join("/"),""!==o.rootPath&&(o.rootPath+="/"),this.getStories(o,"")}else this.getStories(o,t)},this.getStories=function(o,e){var s=this;void 0===o.rootPath&&(o.rootPath=""),t.get("/stories/list.json?path="+o.rootPath+e).then(function(t){o.files=t.data,""!==e&&(o.rootPath+=e+"/")},function(o){s.openErrorModal(o.data)})},this.stepTextPattern=function(){return/^(Given|When|Then) .+$/},this.openConfirmationModal=function(t){return o.open({templateUrl:"/assets/html/confirmationModal.tmpl.html",controller:"modalCtrl",resolve:{data:function(){return t}}})},this.classNamePattern=function(){return/^[a-zA-Z_$][a-zA-Z\d_$]*$/},this.cssClass=function(o){return{"has-error":o.$invalid,"has-success":o.$valid&&o.$dirty}},this.deleteStory=function(o){var n=this,r=s.defer(),a={status:"Delete Story",message:"Are you sure you want to delete this story?"},i=this.openConfirmationModal(a);return i.result.then(function(){t.delete("/stories/story/"+o).then(function(){e.path("/page/stories/new/"),r.resolve("OK")},function(o){n.openErrorModal(o.data.meta),r.reject("NOK")})},function(){r.reject("NOK")}),r.promise},this.getJson=function(o,e){var s=this;return t.get(o,{cache:e}).then(function(o){return o.data},function(o){s.openErrorModal(o.data)})},this.openErrorModal=function(t){o.open({templateUrl:"/assets/html/errorModal.tmpl.html",controller:"modalCtrl",resolve:{data:function(){return t}}})},this.startJoyRide=function(o,e){t.get("/api/v1/data/"+o).then(function(o){e.configJoyRide=o.data.data,e.tours=[{}],e.startJoyRideFlag=!0},function(){e.startJoyRideFlag=!1})},this.onFinishJoyRide=function(o){o.startJoyRideFlag=!1,o.tours=[]},this.startJoyRideOnLoad=function(o,t){void 0!==o.search().tour&&(this.startJoyRide("tour_"+o.search().tour,t),o.search("tour",void 0))}}]).controller("modalCtrl",["$scope","$modalInstance","data",function(o,t,e){o.data=e,o.ok=function(){t.close("ok")},o.cancel=function(){t.dismiss("cancel")}}]),angular.module("configModule",[]).config(["$routeProvider","$locationProvider",function(o,t){t.html5Mode(!0),o.when("/page/tour/",{templateUrl:"/assets/html/tour/tour.tmpl.html",controller:"tourCtrl"}).when("/page/stories/new/",{templateUrl:"/assets/html/story/story.tmpl.html",controller:"storyCtrl",resolve:{story:["$http","$modal","TcBddService",function(o,t,e){return e.getJson("/stories/story.json",!1)}],steps:["$http","$modal","TcBddService",function(o,t,e){return e.getJson("/steps/list.json",!0)}],groovyComposites:["$http","$modal","TcBddService",function(o,t,e){return e.getJson("/groovyComposites",!0)}]}}).when("/page/stories/new/:path*",{templateUrl:"/assets/html/story/story.tmpl.html",controller:"storyCtrl",resolve:{story:["$route","$http","$modal","TcBddService",function(o,t,e,s){return s.getJson("/stories/story.json?path="+o.current.params.path+".story",!1)}],steps:["$http","$modal","TcBddService",function(o,t,e){return e.getJson("/steps/list.json",!0)}],groovyComposites:["$http","$modal","TcBddService",function(o,t,e){return e.getJson("/groovyComposites",!0)}]}}).when("/page/stories/view/:path*",{templateUrl:"/assets/html/story/story.tmpl.html",controller:"storyCtrl",resolve:{story:["$route","$http","$modal","TcBddService",function(o,t,e,s){return s.getJson("/stories/story.json?path="+o.current.params.path+".story",!1)}],steps:["$http","$modal","TcBddService",function(o,t,e){return e.getJson("/steps/list.json",!0)}],groovyComposites:["$http","$modal","TcBddService",function(o,t,e){return e.getJson("/groovyComposites",!0)}]},reloadOnSearch:!1}).when("/page/composites/:className*",{templateUrl:"/assets/html/composites/composites.tmpl.html",controller:"compositesCtrl",resolve:{compositesClass:["$route","$http",function(o,t){var e=o.current.params.className,s="/groovyComposites/"+e;return t.get(s,{cache:!1}).then(function(o){return o.data},function(){var o=e.substring(0,e.lastIndexOf("."));return{"class":o,composites:[{stepText:"",compositeSteps:[{}]}],isNew:!0}})}],steps:["$http","$modal","TcBddService",function(o,t,e){return e.getJson("/steps/list.json",!1)}]}}).when("/page/runner/",{templateUrl:"/assets/html/runner/runner.tmpl.html",controller:"runnerCtrl",reloadOnSearch:!1,resolve:{data:["$route",function(o){return{reportsPath:o.current.params.path}}]}}).when("/page/login/",{templateUrl:"/assets/html/login/login.tmpl.html",controller:"loginCtrl"}).when("/page/loginWelcome/",{templateUrl:"/assets/html/login/loginWelcome.tmpl.html",controller:"loginWelcomeCtrl"}).otherwise({redirectTo:"/page/tour"})}]),angular.module("bodyModule",["ngJoyRide"]).controller("bodyCtrl",["$scope","$http","$modal","$location","TcBddService","$rootScope",function(o,t,e,s,n){o.onFinishJoyRide=function(){n.onFinishJoyRide(o)},o.startJoyRide=function(t){n.startJoyRide(t,o)},o.startJoyRideOnLoad=function(){void 0!==s.search().tour&&o.startJoyRide("tour_"+s.search().tour)},o.openStory=function(){e.open({templateUrl:"/assets/html/stories.tmpl.html",controller:"storiesCtrl",resolve:{data:function(){return{}},features:function(){return{deleteStory:o.features.deleteStory}}}})},o.openCompositeClass=function(){n.openCompositeClass()},o.openModal=function(){if(void 0!==s.search().openModal){var t=s.search().openModal;"openStory"===t?o.openStory():"openCompositeClass"===t&&o.openCompositeClass()}},o.loadFeatures=function(){t.get("/api/v1/data/features").then(function(t){o.features=t.data.data,o.openModal()},function(){o.features=[]})},o.loadFeatures()}]),angular.module("loginModule",[]).controller("loginCtrl",["$scope","$location","TcBddService",function(o,t,e){o.init=function(){o.users=[]},o.cssClass=e.cssClass,o.buttonCssClass=e.buttonCssClass,o.canLogin=function(){return o.loginForm.$valid},o.register=function(){o.users.push(o.user),o.user={}},o.delete=function(){angular.forEach(o.users,function(t,e){t.username===o.user.username&&(o.users.splice(e,1),o.user={})})},o.login=function(){angular.forEach(o.users,function(e){e.username===o.user.username&&t.path("/page/loginWelcome")}),o.user.notRegistered=!0},o.init()}]).controller("loginWelcomeCtrl",["$scope",function(){}]),angular.module("runnerModule",[]).controller("runnerCtrl",["$scope","$modal","$http","$location","$timeout","TcBddService",function(o,t,e,s,n,r){o.openRunnerSelector=function(){return t.open({templateUrl:"/assets/html/runner/runnerSelector.tmpl.html",controller:"runnerSelectorCtrl",resolve:{data:function(){return{}}}})},o.openRunner=function(){var t=o.openRunnerSelector();void 0!==t&&t.result.then(function(t){var s=[];t.dirs.forEach(function(o){s.push({path:o.path+"/**/*.story"})}),t.stories.forEach(function(o){s.push({path:o.path})}),r.openRunnerParametersModal(!0,o).result.then(function(t){var n=t.classes,r=t.action;e.get("/groovyComposites").then(function(t){var e=t.data;o.apiJson={storyPaths:s,classes:n,groovyComposites:e},"run"===r?(o.run(o.apiJson),o.showApi=!1):o.showApi=!0})})})},o.run=function(t){var s="/api/v1/reporters/get/";o.reportsUrl="",o.storyRunnerSuccess=!1,o.showRunnerProgress=!0,e.post("/runner/run.json",t).then(function(t){var e=t.data;"OK"===e.status?(o.reportsUrl=s+e.reportsPath,o.storyRunnerInProgress=!0,o.getReports(e.id)):"FAILED"===e.status?(o.reportsUrl=s+e.reportsPath,o.storyRunnerInProgress=!1):r.openErrorModal(e)},function(t){o.storyRunnerInProgress=!1,o.storyRunnerSuccess=!1,r.openErrorModal(t.data)})},o.getReports=function(t){e.get("/api/v1/reporters/list/"+t).then(function(e){o.reports=e.data,"finished"!==o.reports.status?(o.showRunnerProgress=!0,n(function(){o.getReports(t)},15e3)):o.showRunnerProgress=!1},function(e){"ID is NOT correct"===e.data.message?n(function(){o.getReports(t)},15e3):(o.showRunnerProgress=!1,r.openErrorModal(e.data))})},o.getRunnerStatusCss=function(){return r.getRunnerStatusCss(o.storyRunnerInProgress,o.storyRunnerSuccess,o.pendingSteps>0)},o.getStoryRunnerStatusText=function(){return o.storyRunnerInProgress?"Stories run is in progress":"Stories run is finished"},o.getRunnerProgressCss=function(){return r.getRunnerProgressCss(o.storyRunnerInProgress)},o.onLoad=function(){if(o.storyRunnerInProgress=!1,o.storyRunnerSuccess=!1,o.showRunnerProgress=!1,o.pendingSteps=[],o.reportsUrl="",void 0===s.search().reportsId)o.openRunner();else{var t=s.search().reportsId;o.reportsUrl="/api/v1/reporters/get/"+t+"/view/reports.html",o.getReports(t)}o.showApi=!1},o.apiUrl=function(){return s.protocol()+"://"+s.host()+":"+s.port()+"/runner/run.json"},o.onLoad()}]).controller("runnerSelectorCtrl",["$scope","$http","$modal","$modalInstance","$location","TcBddService",function(o,t,e,s,n,r){o.onLoad=function(){o.files={dirs:[],stories:[]},r.startJoyRideOnLoad(n,o)},r.getStories(o,""),o.openDir=function(t){r.openDir(o,t)},o.cancelRunnerSelector=function(){s.dismiss("cancel")},o.okRunnerSelector=function(){var t={dirs:[],stories:[]};angular.forEach(o.files.dirs,function(e){e.selected&&t.dirs.push({path:o.rootPath+e.name})}),angular.forEach(o.files.stories,function(e){e.selected&&t.stories.push({path:o.rootPath+e.name+".story"})}),s.close(t)},o.allowToPrevDir=function(){return""!==o.rootPath},o.canContinue=function(){var t=!1;return angular.forEach(o.files.dirs,function(o){o.selected&&(t=!0)}),t||angular.forEach(o.files.stories,function(o){o.selected&&(t=!0)}),t},o.onFinishJoyRide=function(){r.onFinishJoyRide(o)},o.startJoyRide=function(t){r.startJoyRide(t,o)},o.onLoad()}]).controller("runnerParamsCtrl",["$scope","$modalInstance","$cookieStore","$location","data","showGetApi","TcBddService","features",function(o,t,e,s,n,r,a,i){o.onLoad=function(){o.paramArray=[],o.features=i,a.startJoyRideOnLoad(s,o)},o.classes=n.classes,o.setParams=function(){o.classes.forEach(function(o){o.params.forEach(function(t){if(void 0!==t.value&&""!==t.value)t.disabled=!0;else{t.disabled=!1;try{t.value=e.get(o.fullName+"."+t.key)}catch(s){console.log("Could not retrieve cookie "+o.fullName+"."+t.key),console.log(s.message)}}})})},o.hasOptions=function(o){return o?o.length>0:!1},o.hasParams=function(o){return void 0!==o.params&&o.params.length>0},o.ok=function(){t.close({action:"run",classes:o.classes})},o.cancel=function(){t.dismiss("cancel")},o.showGetApi=function(){return r},o.getApi=function(){t.close({action:"api",classes:o.classes})},o.paramElementId=function(o,t){var e=o.charAt(0).toLowerCase()+o.slice(1),s=t.charAt(0).toUpperCase()+t.slice(1);return e+s},o.setParams(),o.onFinishJoyRide=function(){a.onFinishJoyRide(o)},o.startJoyRide=function(t){a.startJoyRide(t,o)},o.onLoad()}]),angular.module("storyModule",[]).controller("storyCtrl",["$scope","$http","$modal","$location","$cookieStore","$q","$anchorScroll","$timeout","story","steps","groovyComposites","TcBddService",function(o,t,e,s,n,r,a,i,l,c,u,p){o.onLoad=function(){o.pendingSteps=[],o.story=l,o.steps=c,o.groovyComposites=u,o.stepTypes=["GIVEN","WHEN","THEN"],o.storyFormClass="col-md-12",o.storyRunnerVisible=!1,o.storyRunnerInProgress=!1,o.storyRunnerSuccess=!0,o.expandPanels(),o.originalStory=angular.copy(l),o.scenarioToggles=[];var t=o.story.path.split("/");if(o.dirPath=t.slice(0,t.length-1).join("/"),""!==o.dirPath&&(o.dirPath+="/"),o.setAction(),void 0!==s.search().reportsId&&(o.storyFormClass="col-md-6",o.storyRunnerClass="col-md-6",o.storyRunnerVisible=!0,o.getReports(s.search().reportsId)),void 0!==s.search().openModal){var e=s.search().openModal;"openRunStory"===e&&o.openRunnerParams()}p.startJoyRideOnLoad(s,o)},o.setAction=function(){o.action=""!==o.story.name?"PUT":"POST"},o.expandPanels=function(){var t=!0;void 0===o.panelsExpanded?o.panelsExpanded=!1:(o.panelsExpanded=!o.panelsExpanded,t=o.panelsExpanded),o.panels={story:o.panelsExpanded,description:o.panelsExpanded,meta:o.panelsExpanded,narrative:o.panelsExpanded,givenStories:o.panelsExpanded,lifecycle:o.panelsExpanded,scenarios:t}},o.cssClass=p.cssClass,o.buttonCssClass=p.buttonCssClass,o.canSaveStory=function(){var t=o.storyForm.$valid,e=!angular.equals(o.story,o.originalStory);return t&&e},o.stepTextPattern=p.stepTextPattern,o.saveStory=function(){if(o.canSaveStory())if(o.story.path=o.dirPath+o.story.name+".story","POST"===o.action){var e=o.dirPath.split("/"),n=e.slice(0,e.length-1).join("/");""!==n&&(n+="/"),t.post("/stories/story.json",o.story).then(function(){s.path("/page/stories/view/"+n+o.story.name),o.originalStory=angular.copy(o.story)},function(t){o.openErrorModal(t.data)})}else o.story.name!==o.originalStory.name&&(o.story.originalPath=o.originalStory.path),t.put("/stories/story.json",o.story).then(function(){o.originalStory=angular.copy(o.story)},function(t){o.openErrorModal(t.data)})},o.canRunStory=function(){return o.storyForm.$valid&&!o.storyRunnerInProgress},o.runStory=function(){o.canRunStory()&&(o.saveStory(),o.openRunnerParams())},o.openRunnerParams=function(){o.openRunnerModal().result.then(function(e){var s=e.classes;o.storyFormClass="col-md-6",o.storyRunnerClass="col-md-6",o.storyRunnerVisible=!0,o.storyRunnerInProgress=!0,s.forEach(function(o){o.params.forEach(function(t){n.put(o.fullName+"."+t.key,t.value)})});var r={storyPaths:[{path:o.story.path}],classes:s,groovyComposites:o.groovyComposites};t.post("/runner/run.json",r).then(function(t){o.getReports(t.data.id)},function(t){o.storyRunnerSuccess=!1,o.storyRunnerInProgress=!1,o.openErrorModal(t.data)})},function(t){o.openErrorModal(t.data)})},o.getReports=function(e){t.get("/api/v1/reporters/list/"+e).then(function(t){if(console.log(e),console.log(t.data),"finished"!==t.data.status)console.log("111"),o.storyRunnerInProgress=!0,i(function(){o.getReports(e)},5e3);else{console.log("222");var s=t.data.reports;o.reports=s,o.reports.id=e,o.setPendingSteps(s),o.storyRunnerInProgress=!1,o.storyRunnerSuccess=o.isStoryRunnerSuccess(s)}},function(t){"ID is NOT correct"===t.data.message?i(function(){o.getReports(e)},5e3):(o.storyRunnerInProgress=!1,p.openErrorModal(t.data))})},o.isStoryRunnerSuccess=function(o){var t=!0;return o.forEach(function(o){o.steps.forEach(function(o){"successful"!==o.status&&"pending"!==o.status&&"notPerformed"!==o.status&&(t=!1)})}),t},o.getReportUrl=function(o,t){return"/api/v1/reporters/get/"+o+"/"+t},o.openRunnerModal=function(){return p.openRunnerParametersModal(!1,o)},o.getRunnerProgressCss=function(){return p.getRunnerProgressCss(o.storyRunnerInProgress)},o.getRunnerStatusCss=function(){return p.getRunnerStatusCss(o.storyRunnerInProgress,o.storyRunnerSuccess,o.pendingSteps>0)},o.setPendingSteps=function(t){o.pendingSteps=[],t.forEach(function(t){t.steps.forEach(function(t){"pending"===t.status&&o.pendingSteps.push({text:t.text})})})},o.hasPendingSteps=function(){return void 0!==o.pendingSteps&&o.pendingSteps.length>0},o.getStoryRunnerStatusText=function(){return p.getStoryRunnerStatusText(o.storyRunnerInProgress,o.storyRunnerSuccess,o.pendingSteps.length)},o.removeCollectionElement=p.removeCollectionElement,o.addElement=function(o){o.push({})},o.addScenarioElement=function(o){o.push({title:"",meta:[],steps:[],examplesTable:""})},o.revertStory=function(){o.story=angular.copy(o.originalStory),o.storyForm.$setPristine()},o.canRevertStory=function(){return!angular.equals(o.story,o.originalStory)},o.canDeleteStory=function(){return"PUT"===o.action&&!o.storyRunnerInProgress},o.deleteStory=function(){var t=o.dirPath+o.story.name+".story";p.deleteStory(t)},o.stepEnterKey=p.newCollectionItem,o.clickPendingStep=function(o){var t=n.get("compositeClass");return void 0===t||""===t?p.openCompositeClass(o):s.search("stepText",o).path("/page/composites/"+t+".groovy")},o.openErrorModal=function(){p.openErrorModal()},o.changeScenarioToggle=function(t,e){var s=!1;o.scenarioToggles.forEach(function(o){if(o.scenario===t){var n=void 0===e?!o.expanded:e;o.expanded=n,s=!0}}),s||o.scenarioToggles.push({scenario:t,expanded:!0})},o.getScenarioToggle=function(t){var e=!1;return o.scenarioToggles.forEach(function(o){o.scenario===t&&(e=o.expanded)}),e},o.onFinishJoyRide=function(){p.onFinishJoyRide(o)},o.startJoyRide=function(t){p.startJoyRide(t,o)},o.expandPanelsTour=function(){o.expandPanels()},o.changeScenarioToggleTour=function(){o.changeScenarioToggle(3)},o.onLoad()}]).controller("storiesCtrl",["$scope","$http","$modal","$modalInstance","$location","$q","TcBddService","features",function(o,t,e,s,n,r,a,i){o.onLoad=function(){o.features=i,a.getStories(o,""),a.startJoyRideOnLoad(n,o)},o.openDir=function(t){a.openDir(o,t)},o.close=function(){s.close()},o.openStory=function(t){o.onFinishJoyRide(),s.close(),n.path("/page/stories/view/"+o.rootPath+t)},o.allowToPrevDir=function(){return""!==o.rootPath},o.deleteStory=function(t,e){var s=o.rootPath+t+".story";a.deleteStory(s).then(function(){o.files.stories.splice(e,1)})},o.createDirectory=function(e){var s='{"path": "'+o.rootPath+e+'"}';t.post("/stories/dir.json",s).then(function(){o.files.dirs.push({name:e})},function(o){a.openErrorModal(o.data)})},o.onFinishJoyRide=function(){a.onFinishJoyRide(o)},o.startJoyRide=function(t){a.startJoyRide(t,o)},o.openDirsTour=function(){o.openDir("tcbdd/login")},o.onLoad()}]),angular.module("topMenuModule",[]).controller("topMenuController",["$scope","$location",function(o,t){o.getTitle=function(){var o=t.path();return 0===o.indexOf("/page/stories/view/")?"View Story":0===o.indexOf("/page/stories/new/")?"New Story":0===o.indexOf("/page/composites/")?"Composites":0===o.indexOf("/page/reports/")?"Reports":0===o.indexOf("/page/login/")?"Login":0===o.indexOf("/page/loginWelcome/")?"Welcome":0===o.indexOf("/page/tour/")?"Home":""}}]),angular.module("tourModule",[]).controller("tourCtrl",["$scope","$location",function(){}]),angular.module("compositesModule",[]).controller("compositesCtrl",["$scope","$http","$modal","$location","$cookieStore","compositesClass","steps","TcBddService",function(o,t,e,s,n,r,a,i){o.onLoad=function(){o.compositesClass=r,o.addStepTextParam(),o.originalCompositesClass=angular.copy(r),o.setLastComposite(),o.steps=a,o.stepTextPattern=i.stepTextPattern,o.cssClass=i.cssClass,i.startJoyRideOnLoad(s,o)},o.classNamePattern=function(){return i.classNamePattern()},o.addNewComposite=function(){o.composite={stepText:"",compositeSteps:[{}]},o.compositesClass.composites.push(o.composite)},o.addStepTextParam=function(){void 0!==s.search().stepText&&""!==s.search().stepText&&o.compositesClass.composites.push({stepText:s.search().stepText,compositeSteps:[]})},o.addNewCompositeStep=function(){o.composite.compositeSteps.push({})},o.setLastComposite=function(){if(void 0!==o.compositesClass){var t=o.compositesClass.composites.length;o.composite=o.compositesClass.composites[t-1]}else o.composite={}},o.buttonCssClass=function(o,t){return i.buttonCssClass(o.$valid?t:o)},o.openComposite=function(t){o.composite=t},o.newCollectionItem=i.newCollectionItem,o.removeCollectionElement=i.removeCollectionElement,o.revertCompositesClass=function(){o.compositesClass=angular.copy(o.originalCompositesClass),o.composite=o.compositesClass.composites[0]},o.canRevertCompositesClass=function(){return!angular.equals(o.compositesClass,o.originalCompositesClass)},o.canSaveCompositesClass=function(t){var e=t.$valid,s=!angular.equals(o.compositesClass,o.originalCompositesClass),n=o.compositesClass.isNew;return(n||s)&&e},o.compositesAreValid=function(t){var e=t.$valid;return angular.forEach(o.compositesClass.composites,function(o){void 0===o.stepText||""===o.stepText?e=!1:(void 0===o.compositeSteps||0===o.compositeSteps.length)&&(e=!1)}),e},o.saveCompositesClass=function(){t.put("/groovyComposites",o.compositesClass).then(function(){o.deleteCompositesClassWithoutConfirmation(),s.path("/page/composites/"+o.compositesClass.class+".groovy"),o.compositesClass.isNew=!1,o.originalCompositesClass=angular.copy(o.compositesClass),n.put("compositeClass",o.compositesClass.class)},function(o){i.openErrorModal(o.data)})},o.canDeleteCompositesClass=function(){return!o.compositesClass.isNew},o.deleteCompositesClassWithoutConfirmation=function(){var e=o.compositesClass.class,s=o.originalCompositesClass.class;e!==s&&t.delete("/groovyComposites/"+s).then(function(){},function(o){i.openErrorModal(o.data)})},o.deleteCompositesClass=function(){var e={status:"Delete Composites Class",message:"Are you sure you want to delete this composites class?"},n=i.openConfirmationModal(e);n.result.then(function(){t.delete("/groovyComposites/"+o.originalCompositesClass.class).then(function(){s.path("/")},function(o){i.openErrorModal(o.data)})},function(){})},o.saveCompositesText=function(){return o.compositesClass.isNew?"Create New Composites":"Update Composites"},o.onFinishJoyRide=function(){i.onFinishJoyRide(o)},o.startJoyRide=function(t){i.startJoyRide(t,o)},o.onLoad()}]).controller("compositeClassesCtrl",["$scope","$http","$modalInstance","$location","compositeClasses","compositeStepText","TcBddService",function(o,t,e,s,n,r,a){o.onLoad=function(){o.compositeClasses=n,o.compositeStepText=r,o.data={"class":""},a.startJoyRideOnLoad(s,o)},o.close=function(){e.close()},o.compositeClassUrl=function(t,e){var s="/page/composites/";void 0!==t&&""!==t&&(s+=t+".");var n;return n=e.split(e.indexOf("/")>=0?"/":"\\"),s+=n[n.length-1],void 0!==o.compositeStepText&&""!==o.compositeStepText&&(s+="?stepText="+o.compositeStepText),s},o.compositeClassText=function(o){var t;t=o.split(o.indexOf("/")>=0?"/":"\\");var e=t[t.length-1];return e.indexOf(".")>=0&&(e=e.substr(0,e.lastIndexOf("."))),e},o.classNamePattern=function(){return a.classNamePattern()},o.cssClass=a.cssClass,o.onFinishJoyRide=function(){a.onFinishJoyRide(o)},o.startJoyRide=function(t){a.startJoyRide(t,o)},o.onLoad()}]);