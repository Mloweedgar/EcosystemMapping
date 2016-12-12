class LeftMenuController {
    constructor(SidemenuDataService, $log, EcosystemFilterService,
       EcosystemService, MapDataService, $localStorage,$state,
       OrganizationService,$rootScope,$scope) {
        'ngInject';

        //Initilizing the services
        this.EcosystemFilterService = EcosystemFilterService;
        this.SidemenuDataService = SidemenuDataService;
        this.OrganizationService = OrganizationService;
        this.EcosystemService = EcosystemService;
        this.MapDataService = MapDataService;
        this.$localStorage = $localStorage;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$log = $log;
        this.$state = $state;


          //global variable
          this.isRoleChecked = {};
          this.isSectorChecked = {};
          this.markerIcons ={
            startup:{
              iconUrl: 'img/icons/startup.png',
               iconSize:     [25, 41]
            },
            coworkingSpaces:{
              iconUrl: 'img/icons/coworking.png',
               iconSize:     [25, 41]
            },
            fundingAgencies:{
              iconUrl: 'img/icons/investor.png',
               iconSize:     [25, 41]
            },
            randD:{
              iconUrl: 'img/icons/incubator.png',
               iconSize:     [25, 41]
            },
            event:{
              iconUrl: 'img/icons/event.png',
               iconSize:     [25, 41]
            },
            project:{
              iconUrl: 'img/icons/accelerator.png',
               iconSize:     [25, 41]
            }
          };



        //getting all roles
        this.roles = this.$localStorage.roles;

          //creating a role count object
            let roleCount = {};
        angular.forEach(this.roles,(role)=>{
          roleCount[role.id] =this.OrganizationService.getRoleCount(role.name);
            })

            this.countedRoles = roleCount;




        //getting all sectors
        this.sectors = this.$localStorage.sectors;

      //  this.orgLocation = this.MapDataService.checkedOrganisations();



      //showing Organisations,events,projects initially
    //  this.showOrganisations();

    }

    // updating makers
    selectedOrganisations() {
        this.markers = this.MapDataService.createMarkers(this.SidemenuDataService.getMapData());

    }

    //creates an array of select roles
    setRoleArray(roleId) {
        this.SidemenuDataService.roleArray(roleId);
        this.selectedOrganisations();
    }

    //creates an array of selected sectors
    setSectorArray(sectorId) {
        this.SidemenuDataService.sectorArray(sectorId);
        this.selectedOrganisations();
    }

    // show events
    showEvents() {
      this.$state.go('app.home.events.all');

            var scope = this.$scope;
            var markers = [];
            var evts = [];
            var eventMarkers = {markers:[],events:[]}


              //creating location information
              angular.forEach(this.$localStorage.organisations.data, (response)=> {
                if(response.events.data.length > 0 && response.locations.data.length > 0){
                  angular.forEach(response.events,(events)=>{
                    angular.forEach(events,(event)=>{
                      evts.push(event);


                        //creating markers
                          angular.forEach(response.locations,(locations)=>{
                            angular.forEach(locations,(location)=>{
                              var marker = {
                                lat: parseFloat(location.lat),
                                lng: parseFloat(location.long),
                                getMessageScope: function () {
                                                var infowindowScope = scope.$new(true);
                                                infowindowScope.data = event;
                                                return infowindowScope;
                                            },
                                message:'<message></message>',
                                icon: {}
                              }
                              marker.icon = this.markerIcons.event;
                              markers.push(marker);
                            })
                          })
                    })
                  });
                }
                else {
                      this.$log.log("no events or locations");
                }
              });

                    eventMarkers.markers = markers;
                    eventMarkers.events = evts;
              let data = eventMarkers;
            this.markers = data.markers;
            this.events = data.events;
    }

    // show projects
    showProjects() {
      this.$state.go('app.home.projects.all');

      var scope = this.$scope;
      var markers = [];
      var evts = [];
      var eventMarkers = {markers:[],events:[]}

        //creating location information
        angular.forEach(this.$localStorage.organisations.data, (response)=> {
          if(response.projects.data.length > 0 && response.locations.data.length > 0){
            angular.forEach(response.projects,(events)=>{
              angular.forEach(events,(event)=>{
                evts.push(event);

                  //creating markers
                    angular.forEach(response.locations,(locations)=>{
                      angular.forEach(locations,(location)=>{
                        var marker = {
                          lat: parseFloat(location.lat),
                          lng: parseFloat(location.long),
                          getMessageScope: function () {
                                          var infowindowScope = scope.$new(true);
                                          infowindowScope.data = event;
                                          return infowindowScope;
                                      },
                          message:'<project-msg></project-msg>',
                          icon: {}
                        }
                        marker.icon = this.markerIcons.project;
                        markers.push(marker);
                      })
                    })
              })
            });


          }
          else {
                this.$log.log("no events or locations");
          }

        });
                    eventMarkers.markers = markers;
                    eventMarkers.events = evts;

                    let data = eventMarkers;

            this.markers = data.markers;
            this.events = data.events;

    }

    // show all organisations
   showOrganisations() {
        this.$state.go('app.home.pins.all');



        let valueHolder = this.MapDataService.checkedOrganisations();

        if (valueHolder.length > 0) {
            this.markers = valueHolder;
        } else {
            var scope = this.$scope;
            let markers = [];
            let role = {};
            //creating location information
            angular.forEach(this.$localStorage.organisations.data, (response)=> {
              angular.forEach(response.locations, (locations)=>{
                angular.forEach(locations, (location)=> {
                  var marker = {
                    lat: parseFloat(location.lat),
                    lng: parseFloat(location.long),
                    getMessageScope: function () {
                                    var infowindowScope = scope.$new(true);
                                    infowindowScope.data = response;
                                    return infowindowScope;
                                },
                    message:'<organisation-msg></organisation-msg>',
                        icon: {}
                      }
                      try{
                        let roleName = response.roles.data[0].name;
                        if(roleName == "R&D"){
                            marker.icon = this.markerIcons.randD;
                            markers.push(marker);
                        }
                        else if (roleName == "Funding Agencies" ) {
                          marker.icon = this.markerIcons.fundingAgencies;
                          markers.push(marker);
                        }
                        else if (roleName == "Startup") {
                          marker.icon = this.markerIcons.startup;
                          markers.push(marker);
                        }
                        else if (roleName == "Coworking Space") {
                          marker.icon = this.markerIcons.coworkingSpaces;
                          markers.push(marker);
                        }
                        else {
                          this.$log.log("no such a role");
                        }


                      }
                      catch(e){
                        this.$log.log("no role info in this org");
                      }

                })
              })
            });

                  this.markers = markers;
        }
   }

    //showing number of organisions per role
    showRoleCount(roleName){
    return this.OrganizationService.getRoleCount(roleName);
    }


    $onInit() {}
}
export const LeftMenuComponent = {
    templateUrl: './views/app/components/left-menu/left-menu.component.html',
    controller: LeftMenuController,
    controllerAs: 'vm',
    bindings: {}
}
