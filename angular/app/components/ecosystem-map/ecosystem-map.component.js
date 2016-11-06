


class EcosystemMapController {
    constructor(SidemenuDataService,EcosystemService,$log,MapDataService,$localStorage) {
        'ngInject';

        this.SidemenuDataService = SidemenuDataService;
        this.EcosystemService = EcosystemService;
        this.MapDataService = MapDataService;
        this.$localStorage = $localStorage;
        this.$log = $log;
        this.markers =[];
                this.darEsSalaam={
                    lat: -6.792287,
                    lng: 39.2376063,
                    zoom: 6
                }
                //getting org initially
                this.SidemenuDataService.dataOrg().then((response)=>{
                  var markers = [];
                    this.$localStorage.organisations = response.data;
                  //  preparing initial location information
                    angular.forEach(this.$localStorage.organisations.data, (response)=> {
                      angular.forEach(response.locations, (locations)=>{
                        angular.forEach(locations, (location)=> {
                          var marker = {
                            lat: parseFloat(location.lat),
                            lng: parseFloat(location.long)
                          }
                          markers.push(marker);
                        })
                      })
                    });

                          this.markers = markers;

                });


    }

      // returns an array of selected org
    selectedOrganisations(){
      this.markers = this.MapDataService.checkedOrganisations()
    }


    $onInit() {

    }
}

export const EcosystemMapComponent = {
    templateUrl: './views/app/components/ecosystem-map/ecosystem-map.component.html',
    controller: EcosystemMapController,
    controllerAs: 'vm',
    bindings: {
      markers: '<'
    }
}
