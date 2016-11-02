(function() {
    'use strict';

    angular
        .module('todoApp')
        .directive('customList', directive);

    function directive() {
        return {
            scope: {
                template: '=',
            },
            bindToController: {
                items: '=',
                selectedItem: '=',
                filterFunction: '=',
                search: '=',
                tab: '=',
                sortBy:'=',
                searchIn: '=',
                template: '=', 
            },
            controller: customListController,
            controllerAs: 'customListCtrl',
            transclude: true,
            restrict: 'E',
            template: '<ng-include src="customListCtrl.template" ></ng-include>',
        };
    }

 
    customListController.$inject = ['storageService'];

    // controller //
    function customListController(storageService) {

        var vm = this;
        vm.selected= null; 
        
        vm.changePriority = changePriority;
        vm.checkStateChanged = checkStateChanged;
        vm.toggleSelection = toggleSelection
        vm.backGroundColor = backGroundColor;
        vm.filterSearch= filterSearch; 
        vm.itemSort = itemSort;


        function filterSearch(){
            if (vm.search== null) return "";
            else if(vm.searchIn== 0) return vm.search;
            else return {title: vm.search};
        }
       
        //toggle del tipo di ricerca, per titolo o data
        function itemSort(){
            if(vm.sortBy == 0) return 'title';
            else return 'dateForSort';

        }
     
     //colorazione del backGround ad elementi alterni per una migliore visibilità
        function backGroundColor(index,item){
            if (vm.selectedItem.selected.indexOf(item) == -1){
            if ((index%2)==0) return '#BBDEFB';
            else return '#E3F2FD';
            } else return '#00E676';
        }

        //Changes the priority of the given item
        function changePriority(item) {
            if (item.priority <= 0)
                item.priority++;
            else
                item.priority = -1;

            storageService.set(vm.items);
        }

        //Occurs when the status of an items changes
        function checkStateChanged() {
            storageService.set(vm.items);
        }

        //Select or deselect the given item
        function toggleSelection(item) {
             var index= vm.selectedItem.selected.indexOf(item);
            if (index == -1){
                vm.selectedItem.selected.push(item); 
            }
            else
                vm.selectedItem.selected.splice(index, 1);
                
        }
    }
})();